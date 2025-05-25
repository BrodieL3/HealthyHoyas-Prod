import { testFetchFoodItemNutrients } from "./lib/supabase";

async function main() {
  // Replace with a real food item id from your DB if needed
  const id = "flour-tortilla-5318";
  const result = await testFetchFoodItemNutrients(id);
  console.log("Nutrient data for", id, ":", result);
}

main();
