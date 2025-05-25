// Types for our data models
export type DiningHall = {
  id: number;
  name: string;
  location: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type FoodItem = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  description?: string;
  is_dining_hall_food: boolean;
  dining_hall_id?: number;
  created_at?: string;
  updated_at?: string;
};

export type Meal = {
  id: number;
  user_id: string;
  meal_type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  location_type: "Dining Hall" | "Off-Campus";
  dining_hall_id?: number;
  meal_date: string;
  meal_time: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export type MealFoodItem = {
  id: number;
  meal_id: number;
  food_item_id: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
};

export type MealWithFoodItems = Meal & {
  dining_hall?: DiningHall;
  food_items: (FoodItem & { quantity: number })[];
};

export type DailyNutritionSummary = {
  meal_date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
};

export type WeightEntry = {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  created_at: string;
};

export interface StepsEntry {
  id?: number;
  user_id: string;
  steps: number;
  steps_quality: number;
  date: string;
  created_at?: string;
}

export interface SleepEntry {
  id?: number;
  user_id: string;
  sleep: number;
  sleep_quality: number;
  date: string;
  created_at?: string;
}

export type UserProfile = {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  age?: number;
  height?: number;
  weight?: number;
  sex?: string;
  activity_level?: string;
  tdee?: number;
  calorie_goal?: number;
  // Keep these fields for TypeScript compatibility with existing code
  protein_pct?: number;
  carbs_pct?: number;
  fat_pct?: number;
  // New field to actually store in database
  macro_settings?: {
    protein_pct: number;
    carbs_pct: number;
    fat_pct: number;
  };
  created_at?: string;
  updated_at?: string;
};
