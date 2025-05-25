"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MealWithFoodItems, getUserMeals } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowRight, UtensilsCrossed, Edit, Plus, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { EditMealDialog } from "@/components/edit-meal-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";

interface RecentMealsProps {
  meals: MealWithFoodItems[];
  loading?: boolean;
  className?: string;
  onMealUpdated?: () => void;
}

export function RecentMeals({
  meals,
  loading = false,
  className,
  onMealUpdated = () => {},
}: RecentMealsProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealWithFoodItems | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [allMeals, setAllMeals] = useState<MealWithFoodItems[]>([]);
  const [allMealsLoading, setAllMealsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleMealClick = (meal: MealWithFoodItems) => {
    setSelectedMeal(meal);
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedMeal(null);
  };

  const handleMealUpdated = () => {
    onMealUpdated();
    // Refresh all meals if drawer is open
    if (isDrawerOpen) {
      fetchAllMeals();
    }
  };

  const fetchAllMeals = async () => {
    try {
      setAllMealsLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const allUserMeals = await getUserMeals(user.id, 50); // Get more meals
      setAllMeals(allUserMeals);
    } catch (error) {
      console.error("Error fetching all meals:", error);
    } finally {
      setAllMealsLoading(false);
    }
  };

  const handleViewAllClick = () => {
    setIsDrawerOpen(true);
    fetchAllMeals();
  };

  const MealItem = ({
    meal,
    onClick,
  }: {
    meal: MealWithFoodItems;
    onClick: () => void;
  }) => {
    const totalCalories = meal.food_items.reduce(
      (total, item) => total + (item.calories || 0) * (item.quantity || 1),
      0
    );

    // Handle dining_hall which might be a string or object
    const diningHallName =
      typeof meal.dining_hall === "string"
        ? meal.dining_hall
        : meal.dining_hall?.name || null;

    return (
      <div
        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-accent/10 rounded-md p-2 -mx-2 cursor-pointer transition-colors"
        onClick={onClick}
      >
        <div>
          <p className="font-medium flex items-center">
            {meal.meal_type}
            <Edit className="h-3.5 w-3.5 ml-1.5 text-muted-foreground" />
          </p>
          <p className="text-sm text-muted-foreground">
            {format(new Date(meal.meal_date), "MMM d, yyyy")}
            {meal.meal_time && ` at ${meal.meal_time}`}
          </p>
          {diningHallName && (
            <p className="text-xs text-muted-foreground">{diningHallName}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-medium">{Math.round(totalCalories)} kcal</p>
          <p className="text-sm text-muted-foreground">
            {meal.food_items.length} items
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card
        className={cn(
          "shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift",
          className
        )}
      >
        <CardHeader className="pb-3">
          <div>
            <CardTitle>Recent Meals</CardTitle>
            <CardDescription>
              Your food logs from the past 5 days
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* Log New Meal Button */}
          <Link href="/log-food" className="w-full mb-4 block">
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Log New Meal
            </Button>
          </Link>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : meals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No meals logged yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Use the button above to log your first meal
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {meals.map((meal) => (
                  <MealItem
                    key={meal.id}
                    meal={meal}
                    onClick={() => handleMealClick(meal)}
                  />
                ))}
              </div>

              {/* View All Button - Small and Centered */}
              <div className="flex justify-center mt-4">
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs px-3 py-1 h-7"
                      onClick={handleViewAllClick}
                    >
                      View All
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>All Meals</SheetTitle>
                      <SheetDescription>
                        Complete history of your logged meals
                      </SheetDescription>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
                      {allMealsLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : allMeals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">
                            No meals found
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 pr-4">
                          {allMeals.map((meal) => (
                            <MealItem
                              key={meal.id}
                              meal={meal}
                              onClick={() => {
                                handleMealClick(meal);
                                setIsDrawerOpen(false);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <EditMealDialog
        meal={selectedMeal}
        isOpen={isEditDialogOpen}
        onClose={handleCloseDialog}
        onMealUpdated={handleMealUpdated}
      />
    </>
  );
}
