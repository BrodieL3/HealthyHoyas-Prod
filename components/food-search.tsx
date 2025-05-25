"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { FoodItem } from "@/lib/meals";

// Extended FoodItem type with dining hall and meal period metadata
type ExtendedFoodItem = FoodItem & {
  diningHallId?: string;
  diningHallName?: string;
  mealPeriodName?: string;
};

interface FoodSearchProps {
  availableFoods: ExtendedFoodItem[];
  diningHallId?: string | null;
  mealPeriod?: { name: string } | null;
  onFoodSelect: (food: ExtendedFoodItem) => void;
  placeholder?: string;
  className?: string;
}

export function FoodSearch({
  availableFoods,
  diningHallId,
  mealPeriod,
  onFoodSelect,
  placeholder = "Search menu items...",
  className = "h-12 text-lg",
}: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExtendedFoodItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to get filtered foods based on current filters
  const getFilteredFoods = () => {
    let results = [...availableFoods];

    // Filter by selected dining hall if one is selected
    if (diningHallId) {
      results = results.filter((food) => food.diningHallId === diningHallId);
    }

    // Filter by selected meal period if one is selected
    if (mealPeriod) {
      results = results.filter(
        (food) => food.mealPeriodName === mealPeriod.name
      );
    }

    return results;
  };

  // Search function that handles both query-based search and showing all results
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    const filteredFoods = getFilteredFoods();

    let results = filteredFoods;

    // If there's a search query, filter by name
    if (query.trim()) {
      results = filteredFoods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    console.log(
      `Found ${results.length} matching food items for "${
        query || "all items"
      }"`
    );
    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowResults(true);
    setIsSearching(false);
  };

  // Handle input focus - show all available foods
  const handleFocus = () => {
    if (!showResults) {
      handleSearch(searchQuery); // This will show all foods if query is empty
    }
  };

  // Handle clicking outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        const dropdown = document.querySelector(".food-search-dropdown");
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setShowResults(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFoodSelect = (food: ExtendedFoodItem) => {
    onFoodSelect(food);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="relative search-container mx-1">
      <Input
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />

      {isSearching && (
        <div className="absolute right-3 top-3">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {showResults && (
        <div className="food-search-dropdown absolute z-[1000] w-full mt-1 bg-white border rounded-lg shadow-xl max-h-80 overflow-y-auto -mx-1">
          {searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((food) => (
                <div
                  key={food.id}
                  className="px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-lg flex justify-between items-center group"
                  onClick={() => handleFoodSelect(food)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{food.name}</div>
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
                    {/* Show which dining hall and meal period this food is from */}
                    <div className="text-xs text-gray-400 mt-1">
                      {food.diningHallName} • {food.mealPeriodName}
                    </div>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              {searchQuery ? (
                <>No matching food items found for "{searchQuery}".</>
              ) : (
                <>No food items available.</>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
