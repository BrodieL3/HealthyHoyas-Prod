"use client";

import type React from "react";
import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  CheckCircle2,
  ArrowLeft,
  Search,
  Loader2,
  Plus,
  Trash2,
  Save,
  MapPin,
  Clock,
  Calendar as CalendarIcon,
  Target,
  TrendingUp,
  Filter,
  Check,
  ChevronsUpDown,
  X,
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
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  searchUSDAFoods,
  convertUSDAToFoodItem,
  type USDASearchResult,
} from "@/lib/usda";
import { logUserMeal } from "@/lib/supabase";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FoodSearch } from "@/components/food-search";
import { dataEntryToasts, errorToasts, loadingToasts } from "@/lib/toast-utils";

// Define props type
interface LogFoodProps {
  userId: string;
  initialDiningHallId?: string | null;
}

// Type definition for the structure of the cached nutrition data
interface CachedNutritionData {
  [key: string]: string | undefined;
}

// Extended FoodItem type with dining hall and meal period metadata
type ExtendedFoodItem = FoodItem & {
  diningHallId?: string;
  diningHallName?: string;
  mealPeriodName?: string;
};

export function LogFood({ userId, initialDiningHallId }: LogFoodProps) {
  const { toast } = useToast();

  // Form state
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [mealPeriod, setMealPeriod] = useState<MealPeriod | null>(null);
  const [diningHallId, setDiningHallId] = useState<string | null>(null);
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
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<
    "Breakfast" | "Lunch" | "Dinner" | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<string>("");

  // Ref to store available foods
  const availableFoodsRef = useRef<ExtendedFoodItem[]>([]);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  // Derived state for available foods
  const availableDiningHallFoods = useMemo(() => {
    if (!dailyMenuData || Object.keys(nutritionCache).length === 0) {
      return [];
    }

    let allFoods: FoodItem[] = [];
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

    const uniqueFoods = Array.from(
      new Map(allFoods.map((food) => [food.id, food])).values()
    );
    availableFoodsRef.current = uniqueFoods as ExtendedFoodItem[];
    return uniqueFoods;
  }, [dailyMenuData, nutritionCache]);

  // Filter foods based on current selection
  const filteredFoods = useMemo(() => {
    let foods = availableDiningHallFoods as ExtendedFoodItem[];

    if (diningHallId) {
      foods = foods.filter((food) => food.diningHallId === diningHallId);
    }

    if (mealPeriod) {
      foods = foods.filter((food) => food.mealPeriodName === mealPeriod.name);
    }

    return foods;
  }, [availableDiningHallFoods, diningHallId, mealPeriod]);

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

  const handleDiningHallSelect = (hallId: string) => {
    if (hallId === "all") {
      setDiningHallId(null);
      setMealPeriod(null);
    } else {
      setDiningHallId(hallId);
      setMealPeriod(null);
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

  const handleStartEditingQuantity = (id: string, currentQuantity: number) => {
    setEditingQuantity(id);
    setTempQuantity(currentQuantity.toString());
  };

  const handleFinishEditingQuantity = (id: string) => {
    const quantity = parseFloat(tempQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      handleUpdateFoodQuantity(id, quantity);
    }
    setEditingQuantity(null);
    setTempQuantity("");
  };

  const handleCancelEditingQuantity = () => {
    setEditingQuantity(null);
    setTempQuantity("");
  };

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
      // Show loading toast
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
        // Show success toast with meal details
        dataEntryToasts.mealSaved(
          `${selectedMealType} (${Math.round(
            totalNutrition.calories
          )} calories)`
        );

        // Reset form with animation
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setStep(1);
          setDiningHallId(null);
          setMealPeriod(null);
          setSelectedMealType(null);
          setMealPeriods([]);
          setMealDate(new Date());
          setMealTime(format(new Date(), "HH:mm"));
          setMealNotes("");
          setSelectedFoodItems([]);
          setSearchQuery("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting meal:", error);
      errorToasts.saveFailed("meal");
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapper function to handle ExtendedFoodItem from the search component
  const handleFoodSelectFromSearch = (food: ExtendedFoodItem) => {
    // Convert ExtendedFoodItem to FoodItem format
    const foodItem: FoodItem = {
      id: food.id,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      recipeId: typeof food.id === "string" ? parseInt(food.id) : food.id,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      timeFetched: new Date().toISOString(),
    };
    handleAddFoodItem(foodItem);
  };

  // Get current dining hall name
  const currentDiningHall = diningHalls.find(
    (hall) => hall.id === diningHallId
  );

  // Desktop layout using modern shadcn components
  const DesktopLayout = () => (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar - Filters & Selection */}
      <div className="col-span-3 space-y-4">
        {/* Dining Hall Selection - Scrollable */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-500 animate-wiggle" />
              Dining Location
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64 px-4">
              <div className="space-y-2 py-2">
                {/* All Locations Option */}
                <div
                  className={`p-3 rounded-lg border cursor-pointer hover-lift ${
                    !diningHallId
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleDiningHallSelect("all")}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        !diningHallId ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        All Locations
                      </div>
                      <div className="text-xs text-gray-500">
                        Browse all available items
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Dining Halls */}
                {diningHalls.map((hall) => (
                  <div
                    key={hall.id}
                    className={`p-3 rounded-lg border cursor-pointer hover-lift ${
                      diningHallId === hall.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleDiningHallSelect(hall.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          diningHallId === hall.id
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {hall.name}
                        </div>
                        {diningHallId === hall.id && (
                          <div className="text-xs text-blue-600 animate-fade-in-up">
                            Currently selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Meal Period Selection - Show when dining hall is selected */}
        {diningHallId && (
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift animate-fade-in-down">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-500 animate-wiggle" />
                Meal Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={mealPeriod?.name || ""}
                onValueChange={(value) => {
                  if (value === "all") {
                    setMealPeriod(null);
                  } else {
                    const period = mealPeriods.find((p) => p.name === value);
                    setMealPeriod(period || null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meal period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Periods</SelectItem>
                  {mealPeriods.map((period) => (
                    <SelectItem key={period.name} value={period.name}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Nutrition Summary */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-500 animate-wiggle" />
              Nutrition Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFoodItems.length > 0 ? (
              <div className="space-y-3 animate-fade-in-up">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 animate-bounce-in">
                    {Math.round(totalNutrition.calories)}
                  </div>
                  <div className="text-sm text-gray-500">Calories</div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">Protein:</span>
                    <span className="font-semibold text-green-500">
                      {Math.round(totalNutrition.protein)}g
                    </span>
                  </div>
                  <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">Carbs:</span>
                    <span className="font-semibold text-yellow-500">
                      {Math.round(totalNutrition.carbs)}g
                    </span>
                  </div>
                  <div className="flex justify-between items-center hover:bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-600">Fat:</span>
                    <span className="font-semibold text-blue-500">
                      {Math.round(totalNutrition.fat)}g
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-xl font-bold text-gray-300">0</div>
                <div className="text-sm text-gray-400">Calories</div>
                <p className="text-xs text-gray-400 mt-2">
                  Add items to see nutrition
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area - Food Search */}
      <div className="col-span-6">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 h-full hover-lift">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Search className="h-5 w-5 mr-2 text-orange-500 animate-wiggle" />
              Food Selection
            </CardTitle>
            <p className="text-gray-600">
              {diningHallId && currentDiningHall ? (
                <>
                  Searching items from {currentDiningHall.name}
                  {mealPeriod && <> • {mealPeriod.name}</>}
                </>
              ) : (
                <>Search and add items from any dining hall or meal period</>
              )}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reverted Food Search */}
            <div className="relative">
              <FoodSearch
                availableFoods={filteredFoods}
                diningHallId={diningHallId}
                mealPeriod={mealPeriod}
                onFoodSelect={handleFoodSelectFromSearch}
                placeholder="Search menu items..."
                className="h-12 text-lg"
              />
            </div>

            {/* Selected Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Your Meal</h3>
                <Badge variant="secondary">
                  {selectedFoodItems.length} items
                </Badge>
              </div>

              {selectedFoodItems.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg animate-fade-in-up">
                  <Target className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-wiggle" />
                  <p className="text-gray-500 font-medium">
                    No items added yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Search and select items to build your meal
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-80 border rounded-lg">
                  <div className="p-4 space-y-3">
                    {selectedFoodItems.map((food, index) => (
                      <div
                        key={food.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {food.name}
                          </div>
                          <div className="text-xs text-red-500 font-medium mt-1">
                            {Math.round((food.calories || 0) * food.quantity)}{" "}
                            cal
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleUpdateFoodQuantity(
                                food.id.toString(),
                                food.quantity - 0.5
                              )
                            }
                            disabled={food.quantity <= 0.5}
                          >
                            -
                          </Button>
                          {editingQuantity === food.id.toString() ? (
                            <Input
                              type="number"
                              step="0.1"
                              min="0.1"
                              value={tempQuantity}
                              onChange={(e) => setTempQuantity(e.target.value)}
                              onBlur={() =>
                                handleFinishEditingQuantity(food.id.toString())
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleFinishEditingQuantity(
                                    food.id.toString()
                                  );
                                } else if (e.key === "Escape") {
                                  handleCancelEditingQuantity();
                                }
                              }}
                              className="w-16 h-7 text-center text-sm"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="w-8 text-center text-sm font-medium cursor-pointer hover:bg-gray-200 rounded px-1 py-1"
                              onClick={() =>
                                handleStartEditingQuantity(
                                  food.id.toString(),
                                  food.quantity
                                )
                              }
                              title="Click to edit quantity"
                            >
                              {food.quantity}
                            </span>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              handleUpdateFoodQuantity(
                                food.id.toString(),
                                food.quantity + 0.5
                              )
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleRemoveFoodItem(food.id.toString())
                            }
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
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar - Meal Details */}
      <div className="col-span-3 space-y-4">
        {/* Meal Details - Moved to top */}
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Meal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meal Type Selection - Fixed layout */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Meal Type</Label>
              <div className="flex flex-col gap-2">
                {(["Breakfast", "Lunch", "Dinner"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedMealType === type ? "default" : "outline"}
                    className={cn(
                      "w-full justify-center h-9 text-sm transition-all duration-200"
                    )}
                    onClick={() => setSelectedMealType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date and Time - Stacked vertically */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Date</Label>
                <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !mealDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(mealDate, "MMMM d, yyyy")}
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
              <div>
                <Label className="text-sm">Time</Label>
                <Input
                  type="time"
                  value={mealTime}
                  onChange={(e) => setMealTime(e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm">Notes (Optional)</Label>
              <Textarea
                value={mealNotes}
                onChange={(e) => setMealNotes(e.target.value)}
                placeholder="Add any notes about this meal..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full h-12 text-lg"
          disabled={
            selectedFoodItems.length === 0 || isLoading || !selectedMealType
          }
          size="lg"
          loading={isLoading}
        >
          {!isLoading && (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Log {selectedMealType || "Meal"}
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Mobile layout with simplified steps
  const MobileLayout = () => {
    if (submitted) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 w-full max-w-md animate-bounce-in">
            <CardContent className="pt-8 pb-8 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 animate-pulse-success" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in-up">
                Meal Logged!
              </h3>
              <p className="text-gray-600 animate-fade-in-up">
                Your nutrition data has been updated successfully.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="p-4">
        <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="pt-6 space-y-6">
            {/* Location & Period Selection */}
            <div className="space-y-4">
              <div>
                <Label>Dining Location</Label>
                <Select
                  value={diningHallId || "all"}
                  onValueChange={handleDiningHallSelect}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              </div>

              {diningHallId && (
                <div>
                  <Label>Meal Period</Label>
                  <Select
                    value={mealPeriod?.name || "all"}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setMealPeriod(null);
                      } else {
                        const period = mealPeriods.find(
                          (p) => p.name === value
                        );
                        setMealPeriod(period || null);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Periods</SelectItem>
                      {mealPeriods.map((period) => (
                        <SelectItem key={period.name} value={period.name}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Food Search */}
            <div className="space-y-3">
              <Label>Search Food Items</Label>
              <Command className="border rounded-lg">
                <CommandInput
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No food items found.</CommandEmpty>
                  <CommandGroup>
                    <ScrollArea className="h-48">
                      {filteredFoods
                        .filter(
                          (food) =>
                            !searchQuery ||
                            food.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 20)
                        .map((food) => (
                          <CommandItem
                            key={food.id}
                            value={food.name}
                            onSelect={() => handleAddFoodItem(food)}
                            className="flex justify-between items-center p-2"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {food.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {food.diningHallName}
                              </div>
                            </div>
                            <div className="text-xs text-red-500 font-medium">
                              {Math.round(food.calories || 0)} cal
                            </div>
                          </CommandItem>
                        ))}
                    </ScrollArea>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>

            {/* Selected Items */}
            {selectedFoodItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Selected Items</Label>
                  <Badge variant="secondary">
                    {Math.round(totalNutrition.calories)} cal
                  </Badge>
                </div>
                <ScrollArea className="h-32 border rounded-lg p-2">
                  <div className="space-y-2">
                    {selectedFoodItems.map((food) => (
                      <div
                        key={food.id}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{food.name}</div>
                          <div className="text-xs text-gray-500">
                            {food.quantity}x serving
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            handleRemoveFoodItem(food.id.toString())
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Submit Button */}
            {selectedFoodItems.length > 0 && (
              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                Log Meal
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      {/* Toast notifications */}
      <Toaster />
    </>
  );
}
