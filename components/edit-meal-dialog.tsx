"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Save, X } from "lucide-react";
import { MealWithFoodItems, FoodItem, updateUserMeal } from "@/lib/supabase";
import { format, parseISO } from "date-fns";
import {
  getNutritionCache,
  getMenuDay,
  getAllFoodItems,
  DailyMenuData,
} from "@/lib/meals";

interface EditMealDialogProps {
  meal: MealWithFoodItems | null;
  isOpen: boolean;
  onClose: () => void;
  onMealUpdated: () => void;
}

export function EditMealDialog({
  meal,
  isOpen,
  onClose,
  onMealUpdated,
}: EditMealDialogProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedFoodItems, setSelectedFoodItems] = useState<
    (FoodItem & { quantity: number })[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [nutritionCache, setNutritionCache] = useState<Record<string, any>>({});
  const [dailyMenu, setDailyMenu] = useState<DailyMenuData | null>(null);
  const [availableFoods, setAvailableFoods] = useState<FoodItem[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load the selected meal's food items when the meal changes
  useEffect(() => {
    if (meal && meal.food_items) {
      setSelectedFoodItems(
        meal.food_items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }))
      );
    } else {
      setSelectedFoodItems([]);
    }
  }, [meal]);

  // Load nutrition cache and daily menu when dialog opens
  useEffect(() => {
    async function loadData() {
      if (!meal || !isOpen) return;

      try {
        setLoading(true);

        // Get the date from the meal
        const mealDate = parseISO(meal.meal_date);

        console.log(
          "Loading data for meal date:",
          format(mealDate, "yyyy-MM-dd")
        );

        // Load both nutrition cache and the menu for that specific date in parallel
        const [cache, menuData] = await Promise.all([
          getNutritionCache(),
          getMenuDay({
            year: mealDate.getFullYear(),
            month: mealDate.getMonth() + 1,
            day: mealDate.getDate(),
          }),
        ]);

        console.log(
          "Loaded nutrition cache with",
          Object.keys(cache).length,
          "items"
        );
        console.log("Loaded menu data:", menuData);

        setNutritionCache(cache);
        setDailyMenu(menuData);

        // Get all food items from the menu and enrich with nutrition data
        if (menuData && Object.keys(cache).length > 0) {
          const allMenuFoods = getAllFoodItems(menuData);
          console.log("Found", allMenuFoods.length, "food items in menu");

          // Enrich each food item with nutrition data from cache
          const enrichedFoods: FoodItem[] = allMenuFoods.map((food, index) => {
            const cacheKey = String(food.recipeId);
            const cachedNutrition = cache[cacheKey];

            // Default nutrition values
            let nutritionDetails = {
              calories: food.calories || 0,
              protein: food.protein || 0,
              carbs: food.carbs || 0,
              fat: food.fat || 0,
            };

            // If we have cached nutrition data, use it
            if (cachedNutrition) {
              const extractNumber = (value: any): number => {
                if (value === undefined || value === null) return 0;
                if (typeof value === "number") return value;
                if (typeof value === "string") {
                  const numStr = value.replace(/[^\d.]/g, "");
                  return parseFloat(numStr) || 0;
                }
                return 0;
              };

              nutritionDetails = {
                calories: extractNumber(
                  cachedNutrition.Calories || cachedNutrition.calories
                ),
                protein: extractNumber(
                  cachedNutrition.Protein || cachedNutrition.protein
                ),
                carbs: extractNumber(
                  cachedNutrition.Carbohydrate || cachedNutrition.carbs
                ),
                fat: extractNumber(cachedNutrition.Fat || cachedNutrition.fat),
              };
            }

            // Use recipeId as the primary ID, with fallbacks to ensure uniqueness
            const foodId = food.recipeId || parseInt(food.id) || 10000 + index;

            return {
              id: foodId,
              name: food.name, // Use the name from the menu, which should be user-friendly
              calories: nutritionDetails.calories,
              protein: nutritionDetails.protein,
              carbs: nutritionDetails.carbs,
              fat: nutritionDetails.fat,
              is_dining_hall_food: true,
            };
          });

          console.log("Enriched foods:", enrichedFoods.slice(0, 3));
          setAvailableFoods(enrichedFoods);
        }
      } catch (error) {
        console.error("Error loading meal data:", error);
        setError("Failed to load meal data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [meal, isOpen]);

  // Calculate total nutrition
  const totalNutrition = {
    calories: selectedFoodItems.reduce(
      (total, item) => total + (item.calories || 0) * item.quantity,
      0
    ),
    protein: selectedFoodItems.reduce(
      (total, item) => total + (item.protein || 0) * item.quantity,
      0
    ),
    carbs: selectedFoodItems.reduce(
      (total, item) => total + (item.carbs || 0) * item.quantity,
      0
    ),
    fat: selectedFoodItems.reduce(
      (total, item) => total + (item.fat || 0) * item.quantity,
      0
    ),
  };

  // Search food items function
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);

    // Search through available foods from the menu
    const queryLower = query.toLowerCase();
    const results = availableFoods.filter((food) =>
      food.name.toLowerCase().includes(queryLower)
    );

    console.log(`Found ${results.length} matching food items for "${query}"`);
    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowSearchResults(results.length > 0);
    setIsSearching(false);
  };

  // Add food item
  const handleAddFoodItem = (food: FoodItem) => {
    const existingIndex = selectedFoodItems.findIndex(
      (item) => item.id === food.id
    );

    if (existingIndex >= 0) {
      const updatedItems = [...selectedFoodItems];
      updatedItems[existingIndex].quantity += 1;
      setSelectedFoodItems(updatedItems);
    } else {
      setSelectedFoodItems([...selectedFoodItems, { ...food, quantity: 1 }]);
    }

    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Update food quantity
  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedFoodItems(selectedFoodItems.filter((item) => item.id !== id));
    } else {
      setSelectedFoodItems(
        selectedFoodItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove food item
  const handleRemoveFoodItem = (id: number) => {
    setSelectedFoodItems(selectedFoodItems.filter((item) => item.id !== id));
  };

  // Save updated meal
  const handleSaveMeal = async () => {
    if (!meal) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Call API to update the meal
      await updateUserMeal(meal.id, {
        foodItems: selectedFoodItems,
      });

      setSuccess("Meal updated successfully!");
      onMealUpdated();

      // Close the dialog after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error updating meal:", err);
      setError("Failed to update meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!meal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col z-[1000]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Edit Meal: {meal.meal_type}
          </DialogTitle>
          <DialogDescription>
            {format(new Date(meal.meal_date), "MMMM d, yyyy")}
            {meal.meal_time ? ` at ${meal.meal_time}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-hidden flex flex-col">
          {/* Loading state */}
          {loading && availableFoods.length === 0 && (
            <div className="text-center py-6">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Loading menu data...
              </p>
            </div>
          )}

          {/* Search Bar */}
          {!loading && (
            <div className="mb-4">
              <Label htmlFor="food-search">Search Food Items</Label>
              <div className="relative z-20 mx-1">
                <Input
                  id="food-search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search food items..."
                  autoComplete="off"
                  className="pr-8 text-sm"
                />
                {isSearching && (
                  <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-muted-foreground z-40" />
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div
                    className="absolute z-[1000] w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto -mx-1"
                    style={{ minWidth: "100%" }}
                  >
                    {searchResults.length > 0 ? (
                      <div className="p-1">
                        {searchResults.map((food, index) => (
                          <div
                            key={`search-${food.id}-${index}`}
                            className="px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm flex flex-col text-sm"
                            onClick={() => handleAddFoodItem(food)}
                          >
                            <span className="font-medium">{food.name}</span>
                            <span className="text-xs text-muted-foreground">
                              <span className="text-red-500">
                                {food.calories || 0}
                              </span>{" "}
                              cal | P:{" "}
                              <span className="text-green-500">
                                {food.protein || 0}g
                              </span>{" "}
                              | C:{" "}
                              <span className="text-yellow-500">
                                {food.carbs || 0}g
                              </span>{" "}
                              | F:{" "}
                              <span className="text-blue-500">
                                {food.fat || 0}g
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        No matching food items found.
                      </div>
                    )}
                  </div>
                )}
              </div>
              {availableFoods.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {availableFoods.length} food items available from menu
                </p>
              )}
            </div>
          )}

          {/* Selected Items Section */}
          <div className="space-y-2 flex-grow overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm">Items in this meal</h3>
              <Badge variant="secondary">
                {selectedFoodItems.length} items
              </Badge>
            </div>

            {selectedFoodItems.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm border rounded-md">
                <p>No items in this meal yet. Search to add food items.</p>
              </div>
            ) : (
              <ScrollArea className="h-[250px] rounded-md border">
                <div className="p-2 space-y-1">
                  {selectedFoodItems.map((food, index) => (
                    <div
                      key={`selected-${food.id}-${index}`}
                      className="flex justify-between items-center p-2 rounded-md"
                    >
                      <div className="flex-1 mr-2">
                        <div className="font-medium text-sm leading-tight">
                          {food.name}
                        </div>
                        <div className="text-xs text-red-500">
                          {Math.round((food.calories || 0) * food.quantity)} cal
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleUpdateQuantity(
                              food.id,
                              food.quantity - (food.quantity > 1 ? 1 : 0.5)
                            )
                          }
                          disabled={food.quantity <= 0.5}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {food.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleUpdateQuantity(food.id, food.quantity + 0.5)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveFoodItem(food.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Meal Totals */}
          {selectedFoodItems.length > 0 && (
            <div className="rounded-md border p-3 mt-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Meal Totals</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Calories:</span>
                  <span className="text-xl font-semibold text-red-500">
                    {Math.round(totalNutrition.calories)} Cal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Protein:</span>
                  <span className="text-sm font-medium text-green-500">
                    {Math.round(totalNutrition.protein)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Carbs:</span>
                  <span className="text-sm font-medium text-yellow-500">
                    {Math.round(totalNutrition.carbs)}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fat:</span>
                  <span className="text-sm font-medium text-blue-500">
                    {Math.round(totalNutrition.fat)}g
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <div className="mt-3 p-2 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-3 p-2 bg-green-50 text-green-600 rounded-md text-sm">
              {success}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSaveMeal} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
