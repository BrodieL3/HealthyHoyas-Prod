// Re-export all types
export type * from "./types";

// Re-export client
export { createClient } from "./client";

// Re-export auth functions
export { getUserProfile, updateUserProfile, getMacroPercentages } from "./auth";

// Re-export nutrition functions
export {
  getDiningHalls,
  getFoodsByDiningHall,
  getCommonFoodItems,
  getUserMeals,
  getDailyNutritionSummary,
  logUserMeal,
  updateUserMeal,
  testFetchFoodItemNutrients,
} from "./nutrition";

// Re-export health functions
export {
  getUserWeightEntries,
  saveWeightEntry,
  getUserSleepEntries,
  getUserStepsEntries,
  saveStepsEntry,
  saveSleepEntry,
} from "./health";
