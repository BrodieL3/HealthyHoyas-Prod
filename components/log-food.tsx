"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  CheckCircle2,
  Search,
  Loader2,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  TrendingUp,
  Info,
  Minus,
  X,
  Utensils,
} from "lucide-react";
import {
  getDiningHalls,
  getMealPeriods,
  getMenuDay,
  getFoodsByStation,
  getStations,
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
import { format } from "date-fns";
import { logUserMeal } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { dataEntryToasts, errorToasts, loadingToasts } from "@/lib/toast-utils";
import { NutritionFactsDialog } from "@/components/nutrition-facts-dialog";

// Types
type ExtendedFoodItem = FoodItem & {
  diningHallId?: string;
  diningHallName?: string;
  mealPeriodName?: string;
};

type CachedNutritionData = Record<string, string>;

interface LogFoodProps {
  userId: string;
  initialDiningHallId?: string | null;
}

export function LogFood({ userId, initialDiningHallId }: LogFoodProps) {
  const { toast } = useToast();

  // Core state
  const [diningHallId, setDiningHallId] = useState<string | null>(
    initialDiningHallId || null
  );
  const [mealPeriod, setMealPeriod] = useState<MealPeriod | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<
    "Breakfast" | "Lunch" | "Dinner" | null
  >(null);
  const [mealDate, setMealDate] = useState(new Date());
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
  const [nutritionCache, setNutritionCache] = useState<
    Record<string, CachedNutritionData>
  >({});

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExtendedFoodItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFoodForNutrition, setSelectedFoodForNutrition] = useState<
    (FoodItem & { quantity: number }) | null
  >(null);
  const [nutritionDialogOpen, setNutritionDialogOpen] = useState(false);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial data
  useEffect(() => {
    async function fetchInitialData() {
      setIsLoading(true);
      try {
        const [todayMenu, cache] = await Promise.all([
          getMenuDay(),
          getNutritionCache(),
        ]);

        setDailyMenuData(todayMenu);
        setNutritionCache(cache);

        if (todayMenu) {
          const halls = getDiningHalls(todayMenu);
          setDiningHalls(halls);
        } else {
          setDiningHalls([]);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setDiningHalls([]);
        setNutritionCache({});
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // Fetch menu data when date changes
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
          const menu = await getMenuDay({
            year: mealDate.getFullYear(),
            month: mealDate.getMonth() + 1,
            day: mealDate.getDate(),
          });
          setDailyMenuData(menu);

          if (menu) {
            const halls = getDiningHalls(menu);
            setDiningHalls(halls);
          }
        } catch (error) {
          console.error("Error fetching menu for date:", error);
          setDiningHalls([]);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchMenuForDate();
  }, [mealDate]);

  // Update meal periods when dining hall changes
  useEffect(() => {
    if (dailyMenuData && diningHallId) {
      const periods = getMealPeriods(dailyMenuData, diningHallId);
      setMealPeriods(periods);
    } else {
      setMealPeriods([]);
    }
  }, [dailyMenuData, diningHallId]);

  // Get all available foods with nutrition data
  const availableFoods = useMemo(() => {
    if (!dailyMenuData || Object.keys(nutritionCache).length === 0) {
      return [];
    }

    let allFoods: ExtendedFoodItem[] = [];
    const halls = getDiningHalls(dailyMenuData);

    halls.forEach((hall) => {
      const periods = getMealPeriods(dailyMenuData, hall.id);
      periods.forEach((period) => {
        const stations = getStations(dailyMenuData, hall.id, period.name);
        stations.forEach((station) => {
          const foodsFromStation = getFoodsByStation(
            dailyMenuData,
            hall.id,
            period.name,
            station.name
          );
          const enrichedFoods = foodsFromStation.map((food) => {
            const cacheKey = String(food.recipeId);
            const cachedNutrition = nutritionCache[cacheKey];

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
              const parseNutritionValue = (
                value: string | undefined
              ): number => {
                if (!value) return 0;
                const numericPart = value.replace(/[^\d.]/g, "");
                return parseFloat(numericPart) || 0;
              };

              nutritionDetails = {
                calories: parseNutritionValue(cachedNutrition["Calories"]),
                protein: parseNutritionValue(cachedNutrition["Protein"]),
                fat: parseNutritionValue(cachedNutrition["Fat"]),
                carbs: parseNutritionValue(cachedNutrition["Carbohydrate"]),
                sugar: parseNutritionValue(cachedNutrition["Sugars"]),
                fiber: parseNutritionValue(cachedNutrition["Dietary Fiber"]),
                sodium: parseNutritionValue(cachedNutrition["Sodium"]),
              };
            }

            return {
              ...food,
              ...nutritionDetails,
              diningHallId: hall.id,
              diningHallName: hall.name,
              mealPeriodName: period.name,
            };
          });
          allFoods = allFoods.concat(enrichedFoods);
        });
      });
    });

    return Array.from(
      new Map(allFoods.map((food) => [food.id, food])).values()
    );
  }, [dailyMenuData, nutritionCache]);

  // Filter foods based on current selection
  const filteredFoods = useMemo(() => {
    let foods = availableFoods;

    if (diningHallId) {
      foods = foods.filter((food) => food.diningHallId === diningHallId);
    }

    if (mealPeriod) {
      foods = foods.filter((food) => food.mealPeriodName === mealPeriod.name);
    }

    return foods;
  }, [availableFoods, diningHallId, mealPeriod]);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // Show all available foods when no query
      setSearchResults(filteredFoods.slice(0, 20));
      setShowSearchResults(filteredFoods.length > 0);
      return;
    }

    const queryLower = query.toLowerCase();
    const results = filteredFoods.filter((food) =>
      food.name.toLowerCase().includes(queryLower)
    );

    setSearchResults(results.slice(0, 10));
    setShowSearchResults(results.length > 0);
  };

  // Handle search input focus - show menu items when clicked
  const handleSearchFocus = () => {
    // Always show available foods when focused, regardless of query
    if (filteredFoods.length > 0) {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults(filteredFoods.slice(0, 20));
        setShowSearchResults(true);
      }
    }
  };

  // Handle Enter key to add top search result
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      e.preventDefault();
      handleAddFoodItem(searchResults[0]);
      setSearchQuery("");
      setShowSearchResults(false);
    }
  };

  // Calculate total nutrition
  const totalNutrition = useMemo(() => {
    return selectedFoodItems.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0) * item.quantity,
        protein: acc.protein + (item.protein || 0) * item.quantity,
        carbs: acc.carbs + (item.carbs || 0) * item.quantity,
        fat: acc.fat + (item.fat || 0) * item.quantity,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [selectedFoodItems]);

  // Food item handlers
  const handleAddFoodItem = (food: ExtendedFoodItem) => {
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

  const handleFoodItemClick = (food: FoodItem & { quantity: number }) => {
    // Find the nutrition cache data for this food item
    const cacheKey = String(food.recipeId || food.id);
    const nutritionData = nutritionCache[cacheKey] || {};

    // Add nutrition cache data to the food item
    const foodWithNutritionData = {
      ...food,
      nutritionData: nutritionData,
    };

    setSelectedFoodForNutrition(foodWithNutritionData);
    setNutritionDialogOpen(true);
  };

  // Submit meal
  const handleSubmit = async () => {
    if (!userId) {
      errorToasts.auth();
      return;
    }

    if (selectedFoodItems.length === 0) {
      errorToasts.validation("Please add at least one food item to your meal");
      return;
    }

    if (!selectedMealType) {
      errorToasts.validation(
        "Please select a meal type (Breakfast, Lunch, or Dinner)"
      );
      return;
    }

    setIsLoading(true);

    try {
      const loadingToastId = loadingToasts.saving("meal");

      const result = await logUserMeal({
        userId,
        mealType: selectedMealType,
        mealDate: format(mealDate, "yyyy-MM-dd"),
        mealNotes,
        foodItems: selectedFoodItems.map(
          ({ quantity, id, calories, protein, carbs, fat, ...item }) => ({
            ...item,
            id: Number(id),
            calories: calories ?? 0,
            protein: protein ?? 0,
            carbs: carbs ?? 0,
            fat: fat ?? 0,
            quantity,
            is_dining_hall_food: true,
          })
        ),
      });

      if (result && result.id) {
        dataEntryToasts.mealSaved(
          `${selectedMealType} (${Math.round(
            totalNutrition.calories
          )} calories)`
        );

        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setDiningHallId(null);
          setMealPeriod(null);
          setSelectedMealType(null);
          setMealPeriods([]);
          setMealDate(new Date());
          setMealTime(format(new Date(), "HH:mm"));
          setMealNotes("");
          setSelectedFoodItems([]);
          setSearchQuery("");
          setShowSearchResults(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting meal:", error);
      errorToasts.saveFailed("meal");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 w-full max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Meal Logged!
            </h3>
            <p className="text-gray-600">
              Your nutrition data has been updated successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* First Row: Dining Location/Meal Period (1/3) + Food Selection (2/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Dining Location & Meal Period (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Dining Location Selector */}
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                Dining Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={diningHallId || "all"}
                onValueChange={(value) => {
                  if (value === "all") {
                    setDiningHallId(null);
                    setMealPeriod(null);
                  } else {
                    setDiningHallId(value);
                    setMealPeriod(null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select dining location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {diningHalls.map((hall) => (
                    <SelectItem key={hall.id} value={hall.id}>
                      {hall.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Meal Period Selector */}
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                Meal Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={mealPeriod?.name || ""}
                onValueChange={(value) => {
                  const period = mealPeriods.find((p) => p.name === value);
                  setMealPeriod(period || null);
                }}
                disabled={!diningHallId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal period" />
                </SelectTrigger>
                <SelectContent>
                  {mealPeriods.map((period) => (
                    <SelectItem key={period.name} value={period.name}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!diningHallId && (
                <p className="text-sm text-muted-foreground mt-2">
                  Select a dining location first
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Food Selection (2/3) */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Search className="h-5 w-5 mr-2 text-green-500" />
                Food Selection
              </CardTitle>
              <p className="text-gray-600">
                {diningHallId && mealPeriod ? (
                  <>
                    Searching items from{" "}
                    {diningHalls.find((h) => h.id === diningHallId)?.name} •{" "}
                    {mealPeriod.name}
                  </>
                ) : (
                  "Search and add items to your meal"
                )}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={() => {
                    // Add a small delay to allow clicks on search results
                    setTimeout(() => setShowSearchResults(false), 150);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search menu items... (Press Enter to add top result)"
                  className="h-12 text-sm pr-10"
                />
                <Search className="absolute right-3 top-3 h-6 w-6 text-gray-400" />

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    <div className="p-2">
                      {searchResults.map((food, index) => (
                        <div
                          key={food.id}
                          className={cn(
                            "px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-lg flex justify-between items-center group",
                            index === 0 && "bg-blue-50 border border-blue-200"
                          )}
                          onClick={() => {
                            handleAddFoodItem(food);
                            setSearchQuery("");
                            setShowSearchResults(false);
                          }}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {food.name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              <span className="text-red-500 font-medium">
                                {food.calories || 0}
                              </span>{" "}
                              cal • P:{" "}
                              <span className="text-green-500 font-medium">
                                {food.protein || 0}g
                              </span>{" "}
                              • C:{" "}
                              <span className="text-yellow-500 font-medium">
                                {food.carbs || 0}g
                              </span>{" "}
                              • F:{" "}
                              <span className="text-blue-500 font-medium">
                                {food.fat || 0}g
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {food.diningHallName} • {food.mealPeriodName}
                            </div>
                          </div>
                          <Plus className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Your Meal Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Your Meal
                  </h3>
                  <Badge variant="secondary">
                    {selectedFoodItems.length} items
                  </Badge>
                </div>

                {selectedFoodItems.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <Search className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                      No items added yet
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Search and select items to build your meal
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedFoodItems.map((food) => (
                      <div
                        key={food.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleFoodItemClick(food)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {food.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <span className="text-red-500 font-medium">
                              {Math.round((food.calories || 0) * food.quantity)}
                            </span>{" "}
                            cal • P:{" "}
                            <span className="text-green-500 font-medium">
                              {Math.round((food.protein || 0) * food.quantity)}g
                            </span>{" "}
                            • C:{" "}
                            <span className="text-yellow-500 font-medium">
                              {Math.round((food.carbs || 0) * food.quantity)}g
                            </span>{" "}
                            • F:{" "}
                            <span className="text-blue-500 font-medium">
                              {Math.round((food.fat || 0) * food.quantity)}g
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateFoodQuantity(
                                food.id.toString(),
                                food.quantity - 1
                              );
                            }}
                            disabled={food.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">
                            {food.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateFoodQuantity(
                                food.id.toString(),
                                food.quantity + 1
                              );
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFoodItem(food.id.toString());
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Integrated Nutrition Summary - Always visible */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    Nutrition Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">
                        {Math.round(totalNutrition.calories) || 0}
                      </div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">
                        {Math.round(totalNutrition.protein) || 0}g
                      </div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {Math.round(totalNutrition.carbs) || 0}g
                      </div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">
                        {Math.round(totalNutrition.fat) || 0}g
                      </div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Row: Meal Details (Full Width) */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Utensils className="h-5 w-5 mr-2 text-purple-500" />
            Meal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Meal Type */}
            <div>
              <Label className="text-base font-medium">Meal Type</Label>
              <Select
                value={selectedMealType || ""}
                onValueChange={(value) =>
                  setSelectedMealType(value as "Breakfast" | "Lunch" | "Dinner")
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">Breakfast</SelectItem>
                  <SelectItem value="Lunch">Lunch</SelectItem>
                  <SelectItem value="Dinner">Dinner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <Label className="text-base font-medium">Date</Label>
              <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-2 justify-start text-left font-normal",
                      !mealDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {mealDate ? (
                      format(mealDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={mealDate}
                    onSelect={(date) => {
                      setMealDate(date || new Date());
                      setOpenDatePicker(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div>
              <Label className="text-base font-medium">Time</Label>
              <Input
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Notes */}
            <div>
              <Label className="text-base font-medium">Notes (Optional)</Label>
              <Textarea
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
                placeholder="Add any notes about this meal..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>

          {/* Log Meal Button - Full Width */}
          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 text-lg"
              disabled={
                selectedFoodItems.length === 0 || isLoading || !selectedMealType
              }
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-5 w-5 mr-2" />
              )}
              Log {selectedMealType || "Meal"}
              {selectedFoodItems.length > 0 && (
                <span className="ml-2 text-sm opacity-75">
                  ({Math.round(totalNutrition.calories)} cal)
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Facts Dialog */}
      <NutritionFactsDialog
        food={selectedFoodForNutrition}
        isOpen={nutritionDialogOpen}
        onClose={() => {
          setNutritionDialogOpen(false);
          setSelectedFoodForNutrition(null);
        }}
      />

      <Toaster />
    </div>
  );
}
