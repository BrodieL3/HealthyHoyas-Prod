import supabase from "./supabase";

async function getFile(path: string) {
  {
    try {
      console.log(`Attempting to fetch file ${path}`);
      const { data, error } = await supabase.storage
        .from("menus")
        .download(path);

      if (error) {
        console.error(`Error fetching file: ${path}`);
        throw error;
      }

      console.log(`Successfully retreived file ${path}`);
      const text = await data.text();
      const parsed = JSON.parse(text);
      // No need to log the entire potentially huge file content here
      // console.log(`File header:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error in getFileFromStorage for ${path}`, error);
      return null;
    }
  }
}

// --- Data Structure Types (Mirroring JSON) ---

// Represents the detailed information about a food item (value in the items map)
export type FoodItemDetails = {
  name: string;
  recipeId: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  timeFetched: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  description?: string;
};

// Represents a station within a meal period (value in the stations map)
type StationData = {
  itemIDs: string[];
};

// Represents a meal period (e.g., Breakfast, Lunch) (value in the mealPeriods map)
type MealPeriodData = {
  stations: { [stationName: string]: StationData };
};

// Represents a dining hall location (value in the locations map)
type LocationData = {
  name: string;
  mealPeriods: { [mealPeriodName: string]: MealPeriodData };
};

// Represents the entire menu structure fetched from the JSON file
export type DailyMenuData = {
  locations: { [locationId: string]: LocationData };
  items: { [itemId: string]: FoodItemDetails };
  date: string;
  lastUpdated: string;
};

// --- User-Friendly Output Types ---

export type DiningHall = {
  id: string;
  name: string;
};

export type MealPeriod = {
  name: string;
  // You could potentially add stations here if needed
};

export type Station = {
  name: string;
  // You could potentially add items here if needed
};

// Extends FoodItemDetails to include the item's ID
export type FoodItem = FoodItemDetails & { id: string };

// --- Cache and Menu Fetching ---

export async function getNutritionCache() {
  const data = await getFile("nutrition_cache.json");
  return data || {}; // Return empty object if fetch fails or data is null
}

type DateOffsetInput = {
  year?: number;
  month?: number;
  day?: number;
  offset?: number; // days to shift: +1 for tomorrow, -1 for yesterday
};

async function getMenu({
  year,
  month,
  day,
  offset = 0,
}: DateOffsetInput = {}): Promise<DailyMenuData | null> {
  const now = new Date();

  // Use provided date or fallback to current
  const baseDate = new Date(
    year ?? now.getFullYear(),
    (month ?? now.getMonth() + 1) - 1, // JS months are 0-indexed
    day ?? now.getDate()
  );

  // Adjust by offset in days
  baseDate.setDate(baseDate.getDate() + offset);

  const yyyy = baseDate.getFullYear();
  const mm = String(baseDate.getMonth() + 1).padStart(2, "0");
  const dd = String(baseDate.getDate()).padStart(2, "0");

  const data = await getFile(`${yyyy}-${mm}-${dd}.json`);
  // Type assertion assumes getFile returns the correct structure or null
  return data as DailyMenuData | null;
}

// --- Getter Functions ---

export function getDiningHalls(menu: DailyMenuData | null): DiningHall[] {
  if (!menu?.locations) {
    return [];
  }
  return Object.entries(menu.locations).map(([id, locationData]) => ({
    id: id,
    name: locationData.name,
  }));
}

export function getMealPeriods(
  menu: DailyMenuData | null,
  diningHallId: string
): MealPeriod[] {
  const location = menu?.locations?.[diningHallId];
  if (!location?.mealPeriods) {
    return [];
  }
  return Object.keys(location.mealPeriods).map((name) => ({ name }));
}

export function getStations(
  menu: DailyMenuData | null,
  diningHallId: string,
  mealPeriodName: string
): Station[] {
  const mealPeriod =
    menu?.locations?.[diningHallId]?.mealPeriods?.[mealPeriodName];
  if (!mealPeriod?.stations) {
    return [];
  }
  return Object.keys(mealPeriod.stations).map((name) => ({ name }));
}

// Note: Renamed from getFoodsByDailyMenu for clarity
export function getFoodsByStation(
  menu: DailyMenuData | null,
  diningHallId: string,
  mealPeriodName: string,
  stationName: string
): FoodItem[] {
  const station =
    menu?.locations?.[diningHallId]?.mealPeriods?.[mealPeriodName]?.stations?.[
      stationName
    ];
  if (!station?.itemIDs || !menu?.items) {
    return [];
  }

  return station.itemIDs
    .map((itemId) => {
      const itemDetails = menu.items[itemId];
      if (!itemDetails) {
        console.warn(
          `Food item with ID ${itemId} not found in the main items list.`
        );
        return null; // Handle missing item details gracefully
      }
      return { ...itemDetails, id: itemId }; // Combine details with id
    })
    .filter((item): item is FoodItem => item !== null); // Filter out nulls and assert type
}

// Note: Renamed from getCommonFoodItems as it returns all items listed in the menu
export function getAllFoodItems(menu: DailyMenuData | null): FoodItem[] {
  if (!menu?.items) {
    return [];
  }
  return Object.entries(menu.items).map(([id, details]) => ({
    ...details,
    id: id,
  }));
}

export function getFoodItemById(
  menu: DailyMenuData | null,
  itemId: string
): FoodItem | null {
  const itemDetails = menu?.items?.[itemId];
  if (!itemDetails) {
    return null;
  }
  return { ...itemDetails, id: itemId };
}

// --- Placeholder/Unimplemented Functions (Syntax Corrected) ---

// Potentially fetches the menu for the current day or a specified offset
export async function getMenuDay(
  options?: DateOffsetInput
): Promise<DailyMenuData | null> {
  return getMenu(options);
}

export function createMeal() {
  // Implementation needed
  console.warn("createMeal function is not implemented.");
  return null;
}

export function createCustomFoodItem() {
  // Implementation needed
  console.warn("createCustomFoodItem function is not implemented.");
  return null;
}

export async function getCurrentUser(): Promise<User | null> {
  // Implementation needed based on auth provider (e.g., Supabase Auth)
  console.warn("getCurrentUser function is not implemented. Returning null.");
  return null;
}

// --- Placeholder Types (Syntax Corrected) ---
// These might need actual definitions based on your data model elsewhere

export type Meal = {
  id: string;
  user_id?: string;
  notes?: string;
  created_at?: string;
  meal_period_name?: string;
  meal_type: "Breakfast" | "Lunch" | "Dinner";
};

export type User = {
  id: string;
};

// --- Additional Types for Dashboard ---

export type DailyNutritionSummary = {
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  // Add other relevant totals if needed (fiber, sugar, etc.)
};

// Represents a food item within a logged meal, including quantity
export type MealFoodItem = FoodItem & { quantity: number };

// Represents a Meal with its associated Food Items fetched
// Adapt based on your actual 'meals' table structure and relations
export type MealWithDetails = Meal & {
  // Assuming 'meal_items' is the join table name and 'food_items' is the food table
  meal_items: {
    quantity: number;
    food_items: FoodItem;
  }[];
  // Include other relations if needed by the dashboard (e.g., dining hall, meal period)
  // These are placeholders based on dashboard usage - adjust if your schema differs
  daily_menu?: {
    // This structure seems less likely for a logged meal, maybe remove?
    date?: string;
    dining_hall?: { name?: string };
    meal_period?: { name?: string };
  };
  // Add direct fields if they exist on the 'meals' table
  date?: string; // If the meal itself has a date
  created_at: string; // Ensure Meal type includes this
};

// --- Updated/New Functions ---

/**
 * Fetches recent meals for a user, including details about the food items.
 * @param userId The UUID of the user.
 * @param limit The maximum number of recent meals to fetch.
 * @returns An array of MealWithDetails objects.
 */
export async function getUserMeals(
  userId: string,
  limit: number = 5
): Promise<MealWithDetails[]> {
  if (!userId) {
    console.error("User ID is required to fetch meals.");
    return [];
  }

  try {
    // Fetch meals and their related items
    // Adjust the query based on your actual table names and relationships
    // This example assumes a 'meals' table and a 'meal_items' join table
    // linking to 'food_items'
    const { data, error } = await supabase
      .from("meals")
      .select(
        `
                *,
                meal_items (
                    quantity,
                    food_items (*)
                )
            `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching user meals:", error);
      throw error;
    }

    // Process data to match MealWithDetails structure more closely if needed
    // For example, renaming nested food_items to food_items directly under meal_items
    // or mapping the result to a structure expected by the dashboard component.
    // The current structure returned by the query might already work depending
    // on how the dashboard accesses it.
    // The below type assertion assumes the returned structure is compatible.

    return (data as MealWithDetails[]) || [];
  } catch (error) {
    console.error("Caught error in getUserMeals:", error);
    return [];
  }
}

/**
 * Calculates the total nutrition consumed by a user on a specific date.
 * @param userId The UUID of the user.
 * @param date The date in YYYY-MM-DD format.
 * @returns A DailyNutritionSummary object or null if an error occurs or no meals found.
 */
export async function getDailyNutritionSummary(
  userId: string,
  date: string
): Promise<DailyNutritionSummary | null> {
  if (!userId || !date) {
    console.error("User ID and date are required for nutrition summary.");
    return null;
  }

  try {
    // Fetch meals for the given user and date, including food items and quantities
    // Note: Supabase filters dates based on the full timestamp by default.
    // If your 'meals' table has a 'date' column of type DATE, use that.
    // If using 'created_at' (TIMESTAMP), you need to filter by range.

    // Example using created_at range:
    const startDate = `${date}T00:00:00.000Z`;
    const endDate = `${date}T23:59:59.999Z`;

    const { data: meals, error } = await supabase
      .from("meals")
      .select(
        `
                meal_items (
                    quantity,
                    food_items (
                        calories,
                        protein,
                        carbs,
                        fat
                    )
                )
            `
      )
      .eq("user_id", userId)
      .gte("created_at", startDate) // Greater than or equal to start of day
      .lte("created_at", endDate); // Less than or equal to end of day
    // If using a 'date' column of type DATE, replace gte/lte with: .eq('date', date)

    if (error) {
      console.error("Error fetching meals for nutrition summary:", error);
      throw error;
    }

    if (!meals || meals.length === 0) {
      // Return default zero summary if no meals found for the date
      return {
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
      };
    }

    // Calculate totals
    const summary: DailyNutritionSummary = {
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    };

    meals.forEach((meal) => {
      // Type guard to ensure meal_items is an array
      if (Array.isArray(meal.meal_items)) {
        meal.meal_items.forEach((item) => {
          // Adjust access to food_items assuming it might be an array[1]
          const foodDetails = Array.isArray(item.food_items)
            ? item.food_items[0]
            : item.food_items;

          // Type guard for nested food_items (now checking foodDetails)
          if (foodDetails) {
            const quantity = item.quantity || 0;
            summary.total_calories += (foodDetails.calories || 0) * quantity;
            summary.total_protein += (foodDetails.protein || 0) * quantity;
            summary.total_carbs += (foodDetails.carbs || 0) * quantity;
            summary.total_fat += (foodDetails.fat || 0) * quantity;
          }
        });
      }
    });

    // Round totals for cleaner display if desired
    summary.total_calories = Math.round(summary.total_calories);
    summary.total_protein = Math.round(summary.total_protein * 10) / 10; // e.g., one decimal place
    summary.total_carbs = Math.round(summary.total_carbs * 10) / 10;
    summary.total_fat = Math.round(summary.total_fat * 10) / 10;

    return summary;
  } catch (error) {
    console.error("Caught error in getDailyNutritionSummary:", error);
    return null;
  }
}
