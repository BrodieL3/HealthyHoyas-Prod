"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FoodItem } from "@/lib/meals";

interface NutritionFactsDialogProps {
  food: (FoodItem & { quantity: number; nutritionData?: any }) | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to extract numeric value from nutrition cache string
function extractNutrientValue(value: any): number {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const numericPart = value.replace(/[^\d.]/g, "");
    return parseFloat(numericPart) || 0;
  }
  return 0;
}

// Helper function to get the unit from a nutrition value string
function extractUnit(value: any): string {
  if (!value || typeof value !== "string") return "";
  const match = value.match(/[a-zA-Z]+/);
  return match ? match[0] : "";
}

export function NutritionFactsDialog({
  food,
  isOpen,
  onClose,
}: NutritionFactsDialogProps) {
  if (!food) return null;

  const servings = food.quantity;

  // Use nutrition cache data if available, otherwise fall back to basic food data
  const nutritionData = food.nutritionData || {};

  // Get serving size from cache or default
  const servingSize = nutritionData["Serving Size"] || "1 serving";

  // Extract all nutrition values from cache with proper scaling
  const calories = Math.round(
    extractNutrientValue(nutritionData["Calories"] || food.calories) * servings
  );
  const totalFat =
    Math.round(
      extractNutrientValue(nutritionData["Fat"] || food.fat) * servings * 10
    ) / 10;
  const saturatedFat =
    Math.round(
      extractNutrientValue(nutritionData["Saturated Fat"]) * servings * 10
    ) / 10;
  const transFat =
    Math.round(
      extractNutrientValue(nutritionData["Trans Fat"]) * servings * 10
    ) / 10;
  const cholesterol = Math.round(
    extractNutrientValue(nutritionData["Cholesterol"]) * servings
  );
  const sodium = Math.round(
    extractNutrientValue(nutritionData["Sodium"]) * servings
  );
  const totalCarbs =
    Math.round(
      extractNutrientValue(nutritionData["Carbohydrate"] || food.carbs) *
        servings *
        10
    ) / 10;
  const dietaryFiber =
    Math.round(
      extractNutrientValue(nutritionData["Dietary Fiber"] || food.fiber) *
        servings *
        10
    ) / 10;
  const totalSugars =
    Math.round(
      extractNutrientValue(nutritionData["Sugars"] || food.sugar) *
        servings *
        10
    ) / 10;
  const addedSugars =
    Math.round(
      extractNutrientValue(nutritionData["Added Sugar"]) * servings * 10
    ) / 10;
  const protein =
    Math.round(
      extractNutrientValue(nutritionData["Protein"] || food.protein) *
        servings *
        10
    ) / 10;

  // Micronutrients
  const calcium =
    Math.round(extractNutrientValue(nutritionData["Calcium"]) * servings * 10) /
    10;
  const iron =
    Math.round(extractNutrientValue(nutritionData["Iron"]) * servings * 10) /
    10;
  const potassium =
    Math.round(
      extractNutrientValue(nutritionData["Potassium"]) * servings * 10
    ) / 10;
  const vitaminD =
    Math.round(
      extractNutrientValue(nutritionData["Vitamin D"]) * servings * 10
    ) / 10;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Nutrition Facts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Food name and serving info */}
          <div className="border-b pb-3">
            <h3 className="font-semibold text-lg">{food.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">
                {servings} serving{servings !== 1 ? "s" : ""}
              </Badge>
              {food.quantity !== 1 && (
                <span className="text-sm text-muted-foreground">
                  ({food.quantity}x {servingSize})
                </span>
              )}
            </div>
          </div>

          {/* Nutrition facts label style */}
          <div className="bg-white border-2 border-black p-4 font-mono text-sm">
            <div className="border-b-8 border-black pb-2 mb-3">
              <h4 className="text-2xl font-bold">Nutrition Facts</h4>
              <div className="text-base">
                {servings} serving{servings !== 1 ? "s" : ""} ({food.quantity} ×{" "}
                {servingSize})
              </div>
            </div>

            {/* Calories */}
            <div className="border-b-4 border-black py-2 mb-2">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold">Calories</span>
                <span className="text-3xl font-bold">{calories}</span>
              </div>
            </div>

            <div className="text-right text-xs font-bold mb-2">
              % Daily Value*
            </div>

            {/* Macronutrients */}
            <div className="space-y-1">
              <div className="flex justify-between border-b border-gray-400 py-1">
                <span className="font-bold">Total Fat</span>
                <span className="font-bold">{totalFat}g</span>
              </div>

              {saturatedFat > 0 && (
                <div className="flex justify-between border-b border-gray-300 py-1 pl-4">
                  <span>Saturated Fat</span>
                  <span>{saturatedFat}g</span>
                </div>
              )}

              {transFat > 0 && (
                <div className="flex justify-between border-b border-gray-300 py-1 pl-4">
                  <span>Trans Fat</span>
                  <span>{transFat}g</span>
                </div>
              )}

              {cholesterol > 0 && (
                <div className="flex justify-between border-b border-gray-400 py-1">
                  <span className="font-bold">Cholesterol</span>
                  <span className="font-bold">{cholesterol}mg</span>
                </div>
              )}

              {sodium > 0 && (
                <div className="flex justify-between border-b border-gray-400 py-1">
                  <span className="font-bold">Sodium</span>
                  <span className="font-bold">{sodium}mg</span>
                </div>
              )}

              <div className="flex justify-between border-b border-gray-400 py-1">
                <span className="font-bold">Total Carbohydrate</span>
                <span className="font-bold">{totalCarbs}g</span>
              </div>

              {dietaryFiber > 0 && (
                <div className="flex justify-between border-b border-gray-300 py-1 pl-4">
                  <span>Dietary Fiber</span>
                  <span>{dietaryFiber}g</span>
                </div>
              )}

              {totalSugars > 0 && (
                <div className="flex justify-between border-b border-gray-300 py-1 pl-4">
                  <span>Total Sugars</span>
                  <span>{totalSugars}g</span>
                </div>
              )}

              {addedSugars > 0 && (
                <div className="flex justify-between border-b border-gray-300 py-1 pl-8">
                  <span>Added Sugars</span>
                  <span>{addedSugars}g</span>
                </div>
              )}

              <div className="flex justify-between border-b-4 border-black py-1">
                <span className="font-bold">Protein</span>
                <span className="font-bold">{protein}g</span>
              </div>

              {/* Micronutrients */}
              {vitaminD > 0 && (
                <div className="flex justify-between py-1">
                  <span>Vitamin D</span>
                  <span>{vitaminD}mcg</span>
                </div>
              )}

              {calcium > 0 && (
                <div className="flex justify-between py-1">
                  <span>Calcium</span>
                  <span>{calcium}mg</span>
                </div>
              )}

              {iron > 0 && (
                <div className="flex justify-between py-1">
                  <span>Iron</span>
                  <span>{iron}mg</span>
                </div>
              )}

              {potassium > 0 && (
                <div className="flex justify-between py-1">
                  <span>Potassium</span>
                  <span>{potassium}mg</span>
                </div>
              )}
            </div>

            <div className="border-t border-black pt-2 mt-4 text-xs">
              <p>
                * The % Daily Value (DV) tells you how much a nutrient in a
                serving of food contributes to a daily diet. 2,000 calories a
                day is used for general nutrition advice.
              </p>
            </div>
          </div>

          {/* Additional info */}
          <div className="text-xs text-muted-foreground space-y-1">
            {food.vegetarian && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Vegetarian
              </Badge>
            )}
            {food.vegan && (
              <Badge
                variant="outline"
                className="text-green-700 border-green-700"
              >
                Vegan
              </Badge>
            )}
            {food.glutenFree && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                Gluten Free
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
