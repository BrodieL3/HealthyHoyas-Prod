import supabase from "./supabase";

// Define the type based on the Supabase table schema
export type WeightEntry = {
  id: string; // uuid
  user_id: string; // uuid
  weight: number; // numeric
  date: string; // date (YYYY-MM-DD format)
  created_at: string; // timestamp
  updated_at: string; // timestamp
};

/**
 * Saves a new weight entry for a given user.
 * @param userId The UUID of the user.
 * @param weight The weight value to save.
 * @returns The newly created WeightEntry object or null if an error occurred.
 */
export async function saveWeightEntry(
  userId: string,
  weight: number
): Promise<WeightEntry | null> {
  if (!userId || !weight) {
    console.error("User ID and weight are required to save an entry.");
    return null;
  }

  const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD

  try {
    const { data, error } = await supabase
      .from("weight_entries") // Assuming table name is 'weight_entries'
      .insert({
        user_id: userId,
        weight: weight,
        date: today, // Set the date to today
      })
      .select() // Select the inserted row
      .single(); // Expect only one row back

    if (error) {
      console.error("Error saving weight entry:", error);
      throw error; // Re-throw the error to be caught by the caller
    }

    console.log("Weight entry saved:", data);
    return data as WeightEntry; // Type assertion based on successful insert/select
  } catch (error) {
    // Error already logged, return null to indicate failure
    return null;
  }
}

/**
 * Fetches all weight entries for a specific user, ordered by date descending.
 * @param userId The UUID of the user.
 * @returns An array of WeightEntry objects or an empty array if none found or error.
 */
export async function getUserWeightEntries(
  userId: string
): Promise<WeightEntry[]> {
  if (!userId) {
    console.error("User ID is required to fetch weight entries.");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("weight_entries")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false }); // Order by date, newest first

    if (error) {
      console.error("Error fetching weight entries:", error);
      throw error; // Re-throw
    }

    return (data as WeightEntry[]) || []; // Return data or empty array if null
  } catch (error) {
    // Error already logged, return empty array to indicate failure or no data
    return [];
  }
}
