import { createClient } from "./client";
import type { WeightEntry, SleepEntry, StepsEntry } from "./types";

export async function getUserWeightEntries(
  userId: string
): Promise<WeightEntry[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching weight entries:", error);
      throw new Error(`Failed to fetch weight entries: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserWeightEntries:", error);
    throw error;
  }
}

export async function saveWeightEntry(
  userId: string,
  weight: number
): Promise<WeightEntry | null> {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Check if an entry already exists for today
    const { data: existingEntry } = await supabase
      .from("weight_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { data, error } = await supabase
        .from("weight_logs")
        .update({ weight })
        .eq("id", existingEntry.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating weight entry:", error);
        throw new Error(`Failed to update weight entry: ${error.message}`);
      }

      return data;
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from("weight_logs")
        .insert([
          {
            user_id: userId,
            weight,
            date: today,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating weight entry:", error);
        throw new Error(`Failed to create weight entry: ${error.message}`);
      }

      return data;
    }
  } catch (error) {
    console.error("Error in saveWeightEntry:", error);
    throw error;
  }
}

export async function getUserSleepEntries(
  userId: string
): Promise<SleepEntry[] | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching sleep entries:", error);
      return null;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserSleepEntries:", error);
    return null;
  }
}

export async function getUserStepsEntries(
  userId: string
): Promise<StepsEntry[] | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("steps_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching steps entries:", error);
      return null;
    }

    return data || [];
  } catch (error: unknown) {
    console.error("Error in getUserStepsEntries:", error);
    return null;
  }
}

export async function saveStepsEntry(data: {
  userId: string;
  steps: number;
  steps_quality: number;
  date: string;
}): Promise<StepsEntry | null> {
  try {
    const supabase = createClient();

    // Check if an entry already exists for this user and date
    const { data: existingEntry } = await supabase
      .from("steps_logs")
      .select("*")
      .eq("user_id", data.userId)
      .eq("date", data.date)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { data: result, error } = await supabase
        .from("steps_logs")
        .update({
          steps: data.steps,
          steps_quality: data.steps_quality,
        })
        .eq("id", existingEntry.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating steps entry:", error);
        return null;
      }

      return result;
    } else {
      // Create new entry
      const { data: result, error } = await supabase
        .from("steps_logs")
        .insert({
          user_id: data.userId,
          steps: data.steps,
          steps_quality: data.steps_quality,
          date: data.date,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving steps entry:", error);
        return null;
      }

      return result;
    }
  } catch (error) {
    console.error("Exception saving steps entry:", error);
    return null;
  }
}

export async function saveSleepEntry(data: {
  userId: string;
  sleep: number;
  sleep_quality: number;
  date: string;
}): Promise<SleepEntry | null> {
  try {
    const supabase = createClient();

    // Check if an entry already exists for this user and date
    const { data: existingEntry } = await supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", data.userId)
      .eq("date", data.date)
      .single();

    if (existingEntry) {
      // Update existing entry
      const { data: result, error } = await supabase
        .from("sleep_logs")
        .update({
          sleep: data.sleep,
          sleep_quality: data.sleep_quality,
        })
        .eq("id", existingEntry.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating sleep entry:", error);
        return null;
      }

      return result;
    } else {
      // Create new entry
      const { data: result, error } = await supabase
        .from("sleep_logs")
        .insert({
          user_id: data.userId,
          sleep: data.sleep,
          sleep_quality: data.sleep_quality,
          date: data.date,
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving sleep entry:", error);
        return null;
      }

      return result;
    }
  } catch (error) {
    console.error("Exception saving sleep entry:", error);
    return null;
  }
}
