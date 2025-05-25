import { createClient } from "./client";
import type {
  DiningHall,
  FoodItem,
  MealWithFoodItems,
  DailyNutritionSummary,
} from "./types";

export async function getDiningHalls(): Promise<DiningHall[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("dining_halls")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching dining halls:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching dining halls:", error);
    return [];
  }
}

export async function getFoodsByDiningHall(
  diningHallId: number
): Promise<FoodItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_food_logs")
      .select("*")
      .eq("dining_hall_id", diningHallId)
      .eq("is_dining_hall_food", true)
      .order("name");

    if (error) {
      console.error("Error fetching food items:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching food items:", error);
    return [];
  }
}

export async function getCommonFoodItems(): Promise<FoodItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_food_logs")
      .select("*")
      .eq("is_dining_hall_food", false)
      .order("name");

    if (error) {
      console.error("Error fetching common food items:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching common food items:", error);
    return [];
  }
}

export async function getUserMeals(
  userId: string,
  limit = 10
): Promise<MealWithFoodItems[]> {
  try {
    const supabase = createClient();
    // Fetch user food logs
    const { data: logs, error: logsError } = await supabase
      .from("user_food_logs")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(limit);

    if (logsError) {
      console.error("Error fetching user food logs:", logsError);
      return [];
    }

    if (!logs || logs.length === 0) {
      return [];
    }

    // Map logs to MealWithFoodItems[]
    const mealsWithFoodItems: MealWithFoodItems[] = logs.map((log: any) => {
      // food_items is an array of objects, items_amount is an array of numbers
      const food_items = (log.food_items || []).map(
        (item: any, idx: number) => ({
          ...item,
          quantity: (log.items_amount && log.items_amount[idx]) || 1,
        })
      );

      return {
        id: log.id,
        user_id: log.user_id,
        meal_type: log.meal_type,
        location_type: log.meal_type, // or another field if you have it
        dining_hall_id: undefined, // not in user_food_logs
        meal_date: log.date,
        meal_time: "", // not in user_food_logs, so use empty string
        notes: "", // not in user_food_logs, so use empty string
        created_at: log.created_at,
        updated_at: log.updated_at,
        food_items,
      };
    });

    return mealsWithFoodItems;
  } catch (error) {
    console.error("Error fetching user meals with food items:", error);
    return [];
  }
}

export async function getDailyNutritionSummary(
  userId: string,
  date: string
): Promise<DailyNutritionSummary | null> {
  try {
    const supabase = createClient();
    // Fetch all food logs for the user on the given date
    const { data: logs, error: logsError } = await supabase
      .from("user_food_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date);

    if (logsError) {
      console.error(
        "Error fetching user food logs for nutrition summary:",
        logsError
      );
      return null;
    }

    if (!logs || logs.length === 0) {
      return {
        meal_date: date,
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
      };
    }

    // Calculate totals
    const summary: DailyNutritionSummary = {
      meal_date: date,
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    };

    logs.forEach((log: any) => {
      (log.food_items || []).forEach((item: any, idx: number) => {
        const quantity = (log.items_amount && log.items_amount[idx]) || 1;
        if (item) {
          summary.total_calories += (item.calories || 0) * quantity;
          summary.total_protein += (item.protein || 0) * quantity;
          summary.total_carbs += (item.carbs || 0) * quantity;
          summary.total_fat += (item.fat || 0) * quantity;
        }
      });
    });

    return summary;
  } catch (error) {
    console.error("Error calculating nutrition summary:", error);
    return null;
  }
}

/**
 * Log a new meal for a user in the user_food_logs table.
 * @param params - The meal log parameters
 * @returns The inserted log entry or its id
 */
export async function logUserMeal({
  userId,
  mealType,
  mealDate,
  mealNotes,
  foodItems, // array of full food item objects with quantity
}: {
  userId: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  mealDate: string;
  mealNotes?: string;
  foodItems: (Omit<FoodItem, "quantity"> & { quantity: number })[];
}): Promise<any> {
  try {
    const supabase = createClient();
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("user_food_logs")
      .insert([
        {
          user_id: userId,
          meal_type: mealType,
          date: mealDate,
          notes: mealNotes || null,
          food_items: foodItems.map(({ quantity, ...item }) => item), // store all food item details
          items_amount: foodItems.map((item) => item.quantity),
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();
    if (error) {
      console.error("Error logging user meal:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error in logUserMeal:", error);
    throw error;
  }
}

/**
 * Update an existing meal for a user in the user_food_logs table.
 * @param mealId - The ID of the meal to update
 * @param updates - The updates to apply to the meal
 * @returns The updated meal or null on error
 */
export async function updateUserMeal(
  mealId: number,
  updates: {
    foodItems: (Omit<FoodItem, "quantity"> & { quantity: number })[];
  }
): Promise<any> {
  try {
    const supabase = createClient();

    // Get the current food log to preserve other fields
    const { data: existingMeal, error: fetchError } = await supabase
      .from("user_food_logs")
      .select("*")
      .eq("id", mealId)
      .single();

    if (fetchError) {
      console.error("Error fetching meal to update:", fetchError);
      throw fetchError;
    }

    // Update only the food items and amounts
    const { data, error } = await supabase
      .from("user_food_logs")
      .update({
        food_items: updates.foodItems.map(({ quantity, ...item }) => item),
        items_amount: updates.foodItems.map((item) => item.quantity),
        updated_at: new Date().toISOString(),
      })
      .eq("id", mealId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user meal:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in updateUserMeal:", error);
    throw error;
  }
}

/**
 * Test function to fetch a food item by id and return its nutrient data.
 * @param id - The id of the food item
 * @returns An object with calories, protein, carbs, and fat
 */
export async function testFetchFoodItemNutrients(id: string | number) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_food_logs")
      .select("calories, protein, carbs, fat")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching food item nutrients:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in testFetchFoodItemNutrients:", error);
    return null;
  }
}
