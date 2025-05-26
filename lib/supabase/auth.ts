import { createClient } from "./client";
import type { UserProfile } from "./types";

// Cache for storing profile data and last fetch time
const profileCache = new Map<string, { profile: UserProfile | null; timestamp: number }>();
const CACHE_DURATION = 60000; // 1 minute cache
const MIN_FETCH_INTERVAL = 10000; // 10 seconds minimum between fetches
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to convert between formats
export function getMacroPercentages(profile: UserProfile | null): {
  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;
} {
  if (!profile || !profile.macro_settings) {
    // Default values
    return {
      protein_pct: 25,
      carbs_pct: 50,
      fat_pct: 25,
    };
  }
  return profile.macro_settings;
}

// Transform the database response to match the expected UserProfile type
function transformProfileResponse(profile: any): UserProfile {
  if (!profile) return profile;

  // Create a new object with the expected structure
  const transformedProfile = { ...profile } as UserProfile;

  // If macro_settings exists, extract the percentages as top-level properties
  // This maintains backward compatibility with the frontend
  if (profile.macro_settings) {
    transformedProfile.protein_pct = profile.macro_settings.protein_pct;
    transformedProfile.carbs_pct = profile.macro_settings.carbs_pct;
    transformedProfile.fat_pct = profile.macro_settings.fat_pct;
  }

  return transformedProfile;
}

// Helper function to handle retries
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return withRetry(operation, retries - 1);
    }
    throw error;
  }
}

// Update getUserProfile to also transform the response
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const now = Date.now();
    const cachedData = profileCache.get(userId);

    // Return cached data if it's still valid
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.profile;
    }

    // Check if we're fetching too frequently
    if (cachedData && now - cachedData.timestamp < MIN_FETCH_INTERVAL) {
      console.warn('Fetching profile too frequently, returning cached data');
      return cachedData.profile;
    }

    const supabase = createClient();
    
    // Wrap the database operations in retry logic
    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        
        // If profile doesn't exist, create one
        if (error.code === "PGRST116") {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("Error getting user data:", userError);
            return null;
          }

          if (userData.user) {
            try {
              const { data: newProfile, error: insertError } = await supabase
                .from("profiles")
                .insert({
                  user_id: userId,
                  email: userData.user.email,
                  full_name: userData.user.email?.split("@")[0] || "User",
                  macro_settings: {
                    protein_pct: 25,
                    carbs_pct: 50,
                    fat_pct: 25,
                  },
                })
                .select()
                .single();

              if (insertError) {
                if (insertError.code === "42501") {
                  console.error("Permission denied: Please check RLS policies for the profiles table");
                } else {
                  console.error("Error creating user profile:", insertError);
                }
                return null;
              }
              return newProfile;
            } catch (insertError) {
              console.error("Unexpected error creating profile:", insertError);
              return null;
            }
          }
        }
        return null;
      }

      return data;
    });

    if (!result) return null;

    const transformedProfile = transformProfileResponse(result);
    profileCache.set(userId, { profile: transformedProfile, timestamp: now });
    return transformedProfile;
  } catch (error) {
    console.error("Unexpected error in getUserProfile:", error);
    return null;
  }
}

// Update user profile by user_id
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const supabase = createClient();
    const now = Date.now();

    // Convert individual macro percentages to macro_settings if present
    const updatedData: Record<string, any> = { ...updates };

    // Check if any of the individual macro percentages are being updated
    if (
      "protein_pct" in updates ||
      "carbs_pct" in updates ||
      "fat_pct" in updates
    ) {
      // Get existing profile to merge with updates
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      // Start with existing macro settings or defaults
      const existingMacros = existingProfile?.macro_settings || {
        protein_pct: 25,
        carbs_pct: 50,
        fat_pct: 25,
      };

      // Create updated macro settings
      const macroSettings = {
        protein_pct:
          "protein_pct" in updates
            ? Number(updates.protein_pct)
            : existingMacros.protein_pct,
        carbs_pct:
          "carbs_pct" in updates
            ? Number(updates.carbs_pct)
            : existingMacros.carbs_pct,
        fat_pct:
          "fat_pct" in updates
            ? Number(updates.fat_pct)
            : existingMacros.fat_pct,
      };

      // Replace individual fields with the macro_settings object
      delete updatedData.protein_pct;
      delete updatedData.carbs_pct;
      delete updatedData.fat_pct;
      updatedData.macro_settings = macroSettings;
    }

    // Wrap the database operations in retry logic
    const result = await withRetry(async () => {
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching existing profile:", fetchError);
        // Create profile if it doesn't exist
        if (fetchError.code === "PGRST116") {
          // No rows returned error
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({ user_id: userId, ...updatedData })
            .select()
            .single();

          if (insertError) {
            console.error("Error creating new profile:", insertError);
            throw insertError;
          }
          return newProfile;
        }
        throw fetchError;
      }

      // Update the existing profile
      const { data, error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }

      return data;
    });

    if (!result) return null;

    const transformedProfile = transformProfileResponse(result);
    // Update cache with new data
    profileCache.set(userId, { profile: transformedProfile, timestamp: now });
    return transformedProfile;
  } catch (error) {
    console.error("Exception in updateUserProfile:", error);
    return null;
  }
}
