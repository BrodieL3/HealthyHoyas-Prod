import { createClient } from "./client";
import type { UserProfile } from "./types";

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

// Update getUserProfile to also transform the response
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  return transformProfileResponse(data);
}

// Update user profile by user_id
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const supabase = createClient();

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
        return transformProfileResponse(newProfile);
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

    return transformProfileResponse(data);
  } catch (error) {
    console.error("Exception in updateUserProfile:", error);
    return null;
  }
}
