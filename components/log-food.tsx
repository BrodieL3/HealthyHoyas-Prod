"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ArrowLeft,
  Search,
  Loader2,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import {
  getDiningHalls,
  getMealPeriods,
  getStations,
  getMenuDay,
  getFoodsByStation,
  getAllFoodItems,
  createMeal,
  createCustomFoodItem,
  getCurrentUser,
  getNutritionCache,
  type DailyMenuData,
  type DiningHall,
  type FoodItem,
  type FoodItemDetails,
  type Meal,
  type MealPeriod,
  type Station,
  type User,
} from "@/lib/meals";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  searchUSDAFoods,
  convertUSDAToFoodItem,
  type USDASearchResult,
} from "@/lib/usda";

// Define props type
interface LogFoodProps {
  userId: string;
}

// Type definition for the structure of the cached nutrition data
interface CachedNutritionData {
  [key: string]: string | undefined; // Allows keys like 'Calories', 'Fat', etc.
}

export function LogFood({ userId }: LogFoodProps) {
  // Accept userId prop
  // Form state
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [mealPeriod, setMealPeriod] = useState<MealPeriod | null>(null);
  const [diningHallId, setDiningHallId] = useState<string | null>(null);
  const [mealDate, setMealDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [mealTime, setMealTime] = useState(format(new Date(), "HH:mm"));
  const [mealNotes, setMealNotes] = useState("");

  // Data state
  const [diningHalls, setDiningHalls] = useState<DiningHall[]>([]);
  const [mealPeriods, setMealPeriods] = useState<MealPeriod[]>([]);
  const [dailyMenuData, setDailyMenuData] = useState<DailyMenuData | null>(
    null
  );
  const [selectedFoodItems, setSelectedFoodItems] = useState<
    (FoodItem & { quantity: number })[]
  >([]);
  // Add state for nutrition cache
  const [nutritionCache, setNutritionCache] = useState<
    Record<string, CachedNutritionData>
  >({});

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openFoodSelector, setOpenFoodSelector] = useState(false);
  const [showDiningHallSuggestions, setShowDiningHallSuggestions] =
    useState(false);
  const [skippedMealPeriodStep, setSkippedMealPeriodStep] = useState(false);

  // Dining hall search state
  const [diningHallSearchResults, setDiningHallSearchResults] = useState<
    FoodItem[]
  >([]);
  const [isSearchingDiningHall, setIsSearchingDiningHall] = useState(false);

  // State for user-selected Meal Type
  const [selectedMealType, setSelectedMealType] = useState<
    "Breakfast" | "Lunch" | "Dinner" | null
  >(null);

  // Fetch initial data (today's menu AND nutrition cache)
  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      setDiningHallId(null);
      setMealPeriod(null);
      try {
        // Fetch both in parallel
        const [todayMenu, cache] = await Promise.all([
          getMenuDay(), // Fetch today's menu
          getNutritionCache(), // Fetch nutrition cache
        ]);

        console.log("Fetched Nutrition Cache object:", cache);

        setDailyMenuData(todayMenu);
        setNutritionCache(cache);

        if (todayMenu) {
          const halls = getDiningHalls(todayMenu);
          setDiningHalls(halls);
        } else {
          console.warn("Could not fetch today's menu data.");
          setDiningHalls([]);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setDiningHalls([]);
        setNutritionCache({}); // Clear cache on error too
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, []); // Runs once on mount

  // Fetch menu data when the date changes (keep cache fetching separate)
  useEffect(() => {
    async function fetchMenuForDate() {
      if (mealDate) {
        setIsLoading(true);
        setDailyMenuData(null);
        setDiningHalls([]);
        setMealPeriods([]);
        setDiningHallId(null);
        setMealPeriod(null);
        try {
          const dateObj = parseISO(mealDate);
          const menu = await getMenuDay({
            year: dateObj.getFullYear(),
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate(),
          });
          setDailyMenuData(menu);

          if (menu) {
            const halls = getDiningHalls(menu);
            setDiningHalls(halls);
          }
        } catch (error) {
          console.error("Error fetching menu for date:", mealDate, error);
          setDiningHalls([]);
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchMenuForDate();
  }, [mealDate]);

  // Update available meal periods when dining hall changes (and menu data is available)
  // Simplified: This effect now ONLY sets the list of available periods.
  // Selection logic is handled by the button clicks.
  useEffect(() => {
    if (dailyMenuData && diningHallId) {
      const periods = getMealPeriods(dailyMenuData, diningHallId);
      setMealPeriods(periods);
      // REMOVED: Logic that auto-selected mealPeriod here
    } else {
      setMealPeriods([]); // Clear periods if no menu or hall selected
    }
    // We don't clear the selected mealPeriod here,
    // it's cleared explicitly when needed (e.g., in goBack or handleSubmit reset)
  }, [dailyMenuData, diningHallId]); // Runs when menu data or dining hall ID changes

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowDiningHallSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMealPeriodSelect = (period: MealPeriod) => {
    setMealPeriod(period);
    console.log(`Selected meal period: ${period.name}`);
    setSkippedMealPeriodStep(false);
    setStep(3); // Proceed to food selection
  };

  const handleDiningHallSelect = (id: string) => {
    setDiningHallId(id);
    console.log(`Selected dining hall id: ${id}`);
    setSelectedFoodItems([]); // Clear selected items when changing hall
    setSearchQuery(""); // Clear search

    // Check if we can skip Step 2 (Meal Period selection)
    if (dailyMenuData) {
      const periods = getMealPeriods(dailyMenuData, id);
      if (periods.length === 1) {
        console.log(
          `Only one meal period (${periods[0].name}), skipping step 2.`
        );
        setMealPeriod(periods[0]); // Auto-select the only period
        setSkippedMealPeriodStep(true);
        setStep(3); // Go directly to food selection
      } else {
        // Multiple or zero periods, need user selection
        setMealPeriod(null); // Ensure no period is selected yet
        setSkippedMealPeriodStep(false);
        setStep(2); // Proceed to meal period selection
        // The useEffect above will update the mealPeriods state for display
      }
    } else {
      // Should not happen often if Step 1 loaded halls, but fallback just in case
      console.warn("No menu data available when selecting dining hall.");
      setMealPeriod(null);
      setSkippedMealPeriodStep(false);
      setStep(2); // Go to step 2, useEffect will populate periods when data loads
    }
  };

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

    setOpenFoodSelector(false);
    setSearchQuery("");
    setShowDiningHallSuggestions(false);
  };

  const handleUpdateFoodQuantity = (id: string, quantity: number) => {
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

  const handleRemoveFoodItem = (id: string) => {
    setSelectedFoodItems(selectedFoodItems.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("You must be logged in to log a meal");
      return;
    }
    if (selectedFoodItems.length === 0) {
      alert("Please add at least one food item to your meal");
      return;
    }
    if (!mealPeriod) {
      alert("Internal error: Meal period not set."); // Should be set by flow
      return;
    }
    // Ensure a Meal Type (Breakfast/Lunch/Dinner) is selected
    if (!selectedMealType) {
      alert("Please select a meal type (Breakfast, Lunch, or Dinner).");
      return;
    }

    setIsLoading(true);
    try {
      const mealData: Partial<Meal> & {
        user_id: string;
        meal_type: "Breakfast" | "Lunch" | "Dinner";
      } = {
        user_id: userId,
        notes: mealNotes || undefined,
        meal_period_name: mealPeriod.name, // Store the serving period name (optional context)
        meal_type: selectedMealType, // Store the user-selected meal type
      };

      const foodItemsData = selectedFoodItems.map((item) => ({
        food_id: item.id,
        amount: item.quantity,
        unit: "serving",
      }));

      console.warn("createMeal requires implementation. Simulating success.");
      const simulatedMealId = `meal-${Date.now()}`;

      if (simulatedMealId) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setStep(1);
          setDiningHallId(null);
          setMealPeriod(null);
          setSelectedMealType(null); // Reset Meal Type
          setMealPeriods([]);
          setMealDate(format(new Date(), "yyyy-MM-dd"));
          setMealTime(format(new Date(), "HH:mm"));
          setMealNotes("");
          setSelectedFoodItems([]);
          setSearchQuery("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting meal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      const previousStep = step - 1;

      if (step === 3) {
        // Clear Meal Type when leaving Step 3
        setSelectedMealType(null);
        if (skippedMealPeriodStep) {
          console.log("Going back from Step 3, skipping Step 2");
          setStep(1);
        } else {
          console.log("Going back from Step 3 to Step 2");
          setStep(2);
        }
      } else {
        setStep(previousStep);
      }

      if (step === 3) {
        setSearchQuery("");
        setDiningHallSearchResults([]);
        setShowDiningHallSuggestions(false);
      }
      if (step === 2 || (step === 3 && skippedMealPeriodStep)) {
        setMealPeriod(null);
      }
    }
  };

  const totalNutrition = useMemo(() => {
    return selectedFoodItems.reduce(
      (acc, item) => {
        return {
          calories: acc.calories + (item.calories || 0) * item.quantity,
          protein: acc.protein + (item.protein || 0) * item.quantity,
          carbs: acc.carbs + (item.carbs || 0) * item.quantity,
          fat: acc.fat + (item.fat || 0) * item.quantity,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [selectedFoodItems]);

  // Derived state for available dining hall foods with nutrition info
  const availableDiningHallFoods = useMemo(() => {
    // Check if necessary data is loaded
    if (
      !dailyMenuData ||
      !diningHallId ||
      !mealPeriod ||
      Object.keys(nutritionCache).length === 0
    ) {
      if (Object.keys(nutritionCache).length === 0) {
        // console.log("availableDiningHallFoods: Skipping, nutritionCache is empty");
      }
      return []; // Return empty array if data isn't ready
    }

    console.log(
      `useMemo: Recalculating availableDiningHallFoods for ${diningHallId}, ${mealPeriod.name}`
    );

    // Use helper functions to get base food items
    const stations = getStations(dailyMenuData, diningHallId, mealPeriod.name);
    let allFoods: FoodItem[] = [];

    stations.forEach((station) => {
      const foodsFromStation = getFoodsByStation(
        dailyMenuData,
        diningHallId,
        mealPeriod.name,
        station.name
      );

      // Enrich each food item with nutrition data from the cache
      const enrichedFoods = foodsFromStation.map((food) => {
        // Use recipeId as the key, matching how the cache is likely structured/fetched
        const cacheKey = String(food.recipeId);
        const cachedNutrition = nutritionCache[cacheKey];

        // Default nutrition details (parsed as numbers)
        let nutritionDetails: Partial<FoodItemDetails> = {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
          sugar: 0,
          fiber: 0,
          sodium: 0,
        };

        if (cachedNutrition) {
          // Parse cache values into numbers, default to 0 if missing/NaN
          nutritionDetails = {
            calories: parseFloat(cachedNutrition["Calories"] || "0") || 0,
            protein: parseFloat(cachedNutrition["Protein (g)"] || "0") || 0,
            fat: parseFloat(cachedNutrition["Fat (g)"] || "0") || 0,
            carbs: parseFloat(cachedNutrition["Carbohydrates (g)"] || "0") || 0,
            sugar: parseFloat(cachedNutrition["Sugar (g)"] || "0") || 0,
            fiber: parseFloat(cachedNutrition["Fiber (g)"] || "0") || 0,
            sodium: parseFloat(cachedNutrition["Sodium (mg)"] || "0") || 0,
          };
        }

        // Return the original food item spread with the parsed nutrition values merged/overwritten
        return {
          ...food, // Spread base food info (id, name, recipeId, flags, etc.)
          ...nutritionDetails, // Spread parsed nutrition details directly onto the object
        };
      });
      allFoods = allFoods.concat(enrichedFoods);
    });

    // Deduplicate based on food ID (recipeId might be better if unique)
    const uniqueFoods = Array.from(
      new Map(allFoods.map((food) => [food.id, food])).values()
    );

    console.log(
      "useMemo: Finished calculating availableDiningHallFoods. Count:",
      uniqueFoods.length
    );
    return uniqueFoods;
  }, [dailyMenuData, diningHallId, mealPeriod, nutritionCache]); // Depend on cache

  const filterDiningHallFoods = (query: string): FoodItem[] => {
    if (!query) return [];
    return availableDiningHallFoods.filter((food) =>
      food.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleDiningHallSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setDiningHallSearchResults([]);
      setShowDiningHallSuggestions(false);
      return;
    }

    setIsSearchingDiningHall(true);
    const results = filterDiningHallFoods(query);
    setDiningHallSearchResults(results);
    setShowDiningHallSuggestions(true);
    setIsSearchingDiningHall(false);
  };

  const handleDiningHallFoodSelect = (food: FoodItem) => {
    handleAddFoodItem(food);
  };

  // New handler to change meal period directly from Step 3
  const handleChangeMealPeriod = (period: MealPeriod) => {
    if (mealPeriod?.name !== period.name) {
      // Only update if different
      console.log(`Changing meal period to: ${period.name}`);
      setMealPeriod(period);
      setSelectedFoodItems([]); // Clear selected foods as available items change
      setSearchQuery(""); // Clear search
      setShowDiningHallSuggestions(false); // Hide suggestions
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold">Select Dining Hall</h2>
        <p className="text-muted-foreground">Choose where you ate on campus</p>
      </div>

      {isLoading && diningHalls.length === 0 ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : diningHalls.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No dining halls found for {mealDate}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {diningHalls.map((hall) => (
            <Button
              key={hall.id}
              variant={diningHallId === hall.id ? "default" : "outline"}
              className="flex flex-col items-start justify-between h-auto p-4 border-2 w-full"
              onClick={() => handleDiningHallSelect(hall.id)}
            >
              <div className="flex flex-col items-start">
                <span className="text-base font-medium">{hall.name}</span>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h2 className="text-xl font-semibold">Select Meal Period</h2>
          <p className="text-muted-foreground">
            Choose which meal you're logging (
            {diningHalls.find((h) => h.id === diningHallId)?.name})
          </p>
        </div>
      </div>

      {isLoading && mealPeriods.length === 0 ? (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : mealPeriods.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No meal periods available for this dining hall.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {mealPeriods.map((period) => (
            <Button
              key={period.name}
              variant={mealPeriod?.name === period.name ? "default" : "outline"}
              className="flex flex-col items-center justify-center h-auto py-4 border-2"
              onClick={() => handleMealPeriodSelect(period)}
            >
              <span className="text-base font-medium">{period.name}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  const renderStep3 = () => {
    const currentDiningHallName = diningHalls.find(
      (hall) => hall.id === diningHallId
    )?.name;
    // Use selectedMealType for the title if available, otherwise fallback
    const displayMealName = selectedMealType || mealPeriod?.name || "Meal";
    const stepTitle = `Log ${displayMealName} (${
      currentDiningHallName || "Dining Hall"
    })`;

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          {/* Back Button */}
          <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {/* Title */}
          <div>
            <h2 className="text-xl font-semibold">{stepTitle}</h2>
            <p className="text-sm text-muted-foreground">
              Select Meal Type, then search items.
            </p>
          </div>
        </div>

        {/* Meal Type Selection Buttons (Breakfast/Lunch/Dinner) */}
        <div className="space-y-2">
          <Label>What type of meal is this?</Label>
          <div className="flex flex-wrap gap-2">
            {(["Breakfast", "Lunch", "Dinner"] as const).map((type) => (
              <Button
                key={type}
                variant={selectedMealType === type ? "default" : "secondary"} // Use secondary for non-selected
                size="sm"
                onClick={() => setSelectedMealType(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Food Search - Only enable if Meal Type is selected? Or allow search anytime? */}
          {/* Let's allow search anytime, but submission requires Meal Type */}
          <div className="space-y-2">
            <Label htmlFor="food-search">Search Menu Items</Label>
            {/* ... Input and Search Results ... */}
            <div className="relative search-container">
              <Input
                id="food-search"
                name="food-search"
                value={searchQuery}
                onChange={(e) => handleDiningHallSearch(e.target.value)}
                placeholder={`Search ${mealPeriod?.name || "menu"} items...`}
                autoComplete="off"
                disabled={availableDiningHallFoods.length === 0 && !isLoading}
              />
              {isSearchingDiningHall && (
                <div className="absolute right-2.5 top-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}

              {showDiningHallSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {diningHallSearchResults.length > 0 ? (
                    <div className="p-1">
                      {diningHallSearchResults.map((food) => (
                        <div
                          key={food.id}
                          className="px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm flex flex-col text-sm"
                          onClick={() => handleDiningHallFoodSelect(food)}
                        >
                          <span className="font-medium">{food.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {food.calories || 0} cal | P: {food.protein || 0}g |
                            C: {food.carbs || 0}g | F: {food.fat || 0}g
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      No matching food items found for "{searchQuery}".
                    </div>
                  )}
                </div>
              )}
            </div>
            {availableDiningHallFoods.length === 0 && !isLoading && (
              <p className="text-xs text-muted-foreground text-center pt-1">
                No food items loaded for this dining hall and serving period.
              </p>
            )}
          </div>

          {/* Selected Items Section */}
          <div className="space-y-2 pt-4">
            {/* ... Selected items list and totals ... */}
            <div className="flex justify-between items-center">
              <h3 className="font-medium">
                Selected Items for {selectedMealType || "Meal"}
              </h3>
              <Badge variant="secondary">
                {selectedFoodItems.length} items
              </Badge>
            </div>

            {selectedFoodItems.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <p>Search and select items to add them here.</p>
              </div>
            ) : (
              <ScrollArea className="h-[180px] rounded-md border">
                <div className="p-2 space-y-1">
                  {selectedFoodItems.map((food) => (
                    <div
                      key={food.id}
                      className="flex justify-between items-center p-2 rounded-md"
                    >
                      <div className="flex-1 mr-2">
                        <div className="font-medium text-sm leading-tight">
                          {food.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((food.calories || 0) * food.quantity)} cal
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleUpdateFoodQuantity(
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
                            handleUpdateFoodQuantity(
                              food.id,
                              food.quantity + 0.5
                            )
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

            {/* Meal Totals */}
            {selectedFoodItems.length > 0 && (
              <div className="rounded-md border p-3 mt-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Meal Totals</h4>
                  <span className="text-lg font-semibold">
                    {Math.round(totalNutrition.calories)} Cal
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Serving Period Switcher Buttons - Only if > 1 period exists */}
          {mealPeriods.length > 1 && (
            <div className="space-y-2 pt-4 border-t">
              <Label className="text-xs text-muted-foreground">
                Change Available Items By Serving Period
              </Label>
              <div className="flex flex-wrap gap-2">
                {mealPeriods.map((period) => (
                  <Button
                    key={period.name}
                    variant={
                      mealPeriod?.name === period.name ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleChangeMealPeriod(period)} // Existing handler works fine
                  >
                    {period.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Meal Details Section */}
          <div className="space-y-4 pt-4 border-t">
            {/* ... Date, Time, Notes inputs ... */}
            <h3 className="font-medium">Log Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="meal-date">Date</Label>
                <Input
                  id="meal-date"
                  type="date"
                  value={mealDate}
                  onChange={(e) => setMealDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meal-time">Time</Label>
                <Input
                  id="meal-time"
                  type="time"
                  value={mealTime}
                  onChange={(e) => setMealTime(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meal-notes">Notes (Optional)</Label>
              <Textarea
                id="meal-notes"
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
                placeholder="Add any notes about this meal..."
                rows={2}
                className="text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-6"
            disabled={
              selectedFoodItems.length === 0 || isLoading || !selectedMealType
            } // Also disable if no meal type selected
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Log {selectedMealType || "Meal"} (
            {Math.round(totalNutrition.calories)} Cal)
          </Button>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-2xl font-medium mb-1">Meal Logged!</h3>
      <p className="text-muted-foreground text-center">
        Your nutrition data has been updated.
      </p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto pb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">
        Log Food
      </h1>

      <Card className="shadow-md">
        <CardContent className="pt-6">
          {submitted ? (
            renderSuccess()
          ) : (
            <>
              {isLoading && step === 1 && diningHalls.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                  <p className="text-muted-foreground">
                    Loading Dining Halls...
                  </p>
                </div>
              ) : (
                <>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
