"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/supabase";
import { createClient } from "@/utils/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

const activityOptions = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Light Exercise (1-2 days/week)" },
  { value: "moderate", label: "Moderate Exercise (3-5 days/week)" },
  { value: "heavy", label: "Heavy Exercise (6-7 days/week)" },
  { value: "athlete", label: "Athlete (2x per day)" },
];

const sexOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

// Default recommended macro distribution
const RECOMMENDED_PROTEIN_PCT = 25;
const RECOMMENDED_CARBS_PCT = 50;
const RECOMMENDED_FAT_PCT = 25;
const DEVIATION_THRESHOLD = 25; // 25% deviation threshold

type TDEEArgs = {
  age?: number;
  height?: number;
  weight?: number;
  sex?: string;
  activity_level?: string;
};

function calculateTDEE({
  age,
  height,
  weight,
  sex,
  activity_level,
}: TDEEArgs): number | null {
  if (!age || !height || !weight || !sex || !activity_level) return null;
  const weightKg = weight * 0.453592;
  const heightCm = height * 2.54;
  let bmr = 0;
  if (sex === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    athlete: 1.9,
  };
  const multiplier =
    activityMultipliers[activity_level as keyof typeof activityMultipliers] ||
    1.2;
  return Math.round(bmr * multiplier);
}

export function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<string | number | undefined>(
    undefined
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [macroWarning, setMacroWarning] = useState<string | null>(null);
  const [macroForm, setMacroForm] = useState({
    protein_pct: RECOMMENDED_PROTEIN_PCT,
    carbs_pct: RECOMMENDED_CARBS_PCT,
    fat_pct: RECOMMENDED_FAT_PCT,
  });
  const [macroTotal, setMacroTotal] = useState(100);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  // Calculated macros in grams based on calorie goal
  const calorieGoal = profile?.calorie_goal || profile?.tdee || 2000;
  const proteinGrams = Math.round(
    (calorieGoal * (macroForm.protein_pct / 100)) / 4
  );
  const carbsGrams = Math.round(
    (calorieGoal * (macroForm.carbs_pct / 100)) / 4
  );
  const fatGrams = Math.round((calorieGoal * (macroForm.fat_pct / 100)) / 9);

  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError("Please sign in to view your settings.");
          setLoading(false);
          return;
        }
        const prof = await getUserProfile(user.id);
        setProfile(prof);
        setForm(prof || {});
        setAvatarUrl(prof?.avatar_url);

        // Initialize macro form with user values or defaults
        setMacroForm({
          protein_pct: prof?.protein_pct ?? RECOMMENDED_PROTEIN_PCT,
          carbs_pct: prof?.carbs_pct ?? RECOMMENDED_CARBS_PCT,
          fat_pct: prof?.fat_pct ?? RECOMMENDED_FAT_PCT,
        });
      } catch (e) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Adding a visual indicator for debugging
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  // Update fat percentage whenever protein or carbs change
  useEffect(() => {
    const proteinPct = macroForm.protein_pct;
    const carbsPct = macroForm.carbs_pct;
    const fatPct = 100 - proteinPct - carbsPct;

    // Ensure fat percentage is not negative
    const newFatPct = Math.max(0, fatPct);

    setMacroForm((prev) => ({
      ...prev,
      fat_pct: newFatPct,
    }));

    const total = proteinPct + carbsPct + newFatPct;
    setMacroTotal(Math.round(total));

    // Check for significant deviations from recommended values
    const proteinDeviation =
      (Math.abs(proteinPct - RECOMMENDED_PROTEIN_PCT) /
        RECOMMENDED_PROTEIN_PCT) *
      100;
    const carbsDeviation =
      (Math.abs(carbsPct - RECOMMENDED_CARBS_PCT) / RECOMMENDED_CARBS_PCT) *
      100;
    const fatDeviation =
      (Math.abs(newFatPct - RECOMMENDED_FAT_PCT) / RECOMMENDED_FAT_PCT) * 100;

    if (
      proteinDeviation > DEVIATION_THRESHOLD ||
      carbsDeviation > DEVIATION_THRESHOLD ||
      fatDeviation > DEVIATION_THRESHOLD
    ) {
      setMacroWarning(
        "Your macro distribution deviates significantly from recommended values."
      );
    } else {
      setMacroWarning(null);
    }
  }, [macroForm.protein_pct, macroForm.carbs_pct]);

  // Simplified macro slider interaction
  const handleSliderClick = (e: React.MouseEvent) => {
    if (!barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (clickX / rect.width) * 100));

    // Determine if we're closer to protein marker or carbs marker
    const proteinPos = macroForm.protein_pct;
    const carbsPos = macroForm.protein_pct + macroForm.carbs_pct;

    const distToProtein = Math.abs(pct - proteinPos);
    const distToCarbs = Math.abs(pct - carbsPos);

    if (distToProtein < distToCarbs) {
      // Adjust protein
      const newProtein = Math.round(pct);
      const newCarbs = Math.max(0, 100 - newProtein - macroForm.fat_pct);

      setMacroForm({
        protein_pct: newProtein,
        carbs_pct: newCarbs,
        fat_pct: macroForm.fat_pct,
      });
    } else {
      // Adjust carbs+protein
      const newCarbsPos = Math.round(pct);
      const newCarbs = Math.max(0, newCarbsPos - macroForm.protein_pct);

      setMacroForm({
        protein_pct: macroForm.protein_pct,
        carbs_pct: newCarbs,
        fat_pct: 100 - macroForm.protein_pct - newCarbs,
      });
    }
  };

  // Direct drag handling with animation
  const [draggingHandle, setDraggingHandle] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, percent: 0 });

  const handleDragStart = (handle: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    const startX = e.clientX;
    const startPercent =
      handle === "protein"
        ? macroForm.protein_pct
        : macroForm.protein_pct + macroForm.carbs_pct;

    setDraggingHandle(handle);
    setDragPosition({ x: startX, percent: startPercent });

    const handleDragMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();

      // Calculate the new percentage based on mouse movement
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / rect.width) * 100;
      const newPercent = Math.min(
        100,
        Math.max(0, startPercent + deltaPercent)
      );

      // Update visual position immediately for smooth animation
      setDragPosition({
        x: moveEvent.clientX,
        percent: newPercent,
      });

      // Update actual macro values
      if (handle === "protein") {
        const newProtein = Math.min(
          Math.round(newPercent),
          100 - macroForm.fat_pct
        );
        setMacroForm((prev) => ({
          ...prev,
          protein_pct: newProtein,
          carbs_pct: 100 - newProtein - prev.fat_pct,
        }));
      } else {
        const combinedPercent = Math.min(Math.round(newPercent), 100);
        const newCarbs = Math.max(0, combinedPercent - macroForm.protein_pct);
        setMacroForm((prev) => ({
          ...prev,
          carbs_pct: newCarbs,
          fat_pct: 100 - prev.protein_pct - newCarbs,
        }));
      }
    };

    const handleDragEnd = () => {
      setDraggingHandle(null);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.body.style.cursor = "grabbing";
  };

  // Simplified direct input adjustment
  const adjustMacro = (type: "protein" | "carbs", value: number) => {
    value = Math.min(100, Math.max(0, value));

    if (type === "protein") {
      const newProtein = value;
      const remainingPct = 100 - newProtein;
      const newCarbs = Math.min(macroForm.carbs_pct, remainingPct);
      const newFat = 100 - newProtein - newCarbs;

      setMacroForm({
        protein_pct: newProtein,
        carbs_pct: newCarbs,
        fat_pct: newFat,
      });
    } else if (type === "carbs") {
      const maxCarbs = 100 - macroForm.protein_pct;
      const newCarbs = Math.min(value, maxCarbs);

      setMacroForm({
        protein_pct: macroForm.protein_pct,
        carbs_pct: newCarbs,
        fat_pct: 100 - macroForm.protein_pct - newCarbs,
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setForm(profile || {});
    setSuccess(null);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm(profile || {});
    setSuccess(null);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "full_name"
          ? value
          : value === ""
          ? undefined
          : name === "sex" || name === "activity_level"
          ? value
          : Number(value),
    }));
  };

  const handleMacroSave = async () => {
    if (macroTotal !== 100) {
      setError("Macro percentages must add up to 100%");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not signed in.");
        setLoading(false);
        return;
      }

      const updates = {
        protein_pct: macroForm.protein_pct,
        carbs_pct: macroForm.carbs_pct,
        fat_pct: macroForm.fat_pct,
      };

      const updated = await updateUserProfile(user.id, updates);

      if (!updated) {
        setError(
          "Failed to update macro distribution. If this is your first time setting macros, please try again."
        );
        return;
      }

      setProfile(updated);
      setForm(updated || {});
      setSuccess("Macro distribution updated!");
    } catch (e) {
      console.error("Error updating macros:", e);
      // Show a more detailed error message about the schema issue if applicable
      if (e && typeof e === "object" && "code" in e && e.code === "PGRST204") {
        setError("There was a database schema issue. Please contact support.");
      } else {
        setError(
          e instanceof Error
            ? `Error: ${e.message}`
            : "Failed to update macro distribution."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateTDEE = async () => {
    const tdee = calculateTDEE({
      age: form.age,
      height: form.height,
      weight: form.weight,
      sex: form.sex,
      activity_level: form.activity_level,
    });
    if (!tdee) {
      setError(
        "Please enter age, height, weight, sex, and activity level to calculate TDEE."
      );
      return;
    }
    setForm((prev) => ({ ...prev, tdee }));
    setSuccess(null);
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in.");
        setLoading(false);
        return;
      }
      const updated = await updateUserProfile(user.id, { ...form, tdee });
      setProfile(updated);
      setForm(updated || {});
      setSuccess("TDEE calculated and saved!");
    } catch (e) {
      setError("Failed to update TDEE.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldEdit = (
    field: string,
    value: string | number | undefined
  ) => {
    setEditingField(field);
    setFieldValue(value);
    setSuccess(null);
    setError(null);
  };

  const handleFieldSave = async (field: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in.");
        setLoading(false);
        return;
      }

      // Validate field value
      if (fieldValue === undefined || fieldValue === "") {
        setError(`${field} cannot be empty.`);
        setLoading(false);
        return;
      }

      const updates: any = { [field]: fieldValue };
      const updated = await updateUserProfile(user.id, updates);

      if (!updated) {
        setError("Failed to update profile. Please try again.");
        return;
      }

      setProfile(updated);
      setForm(updated || {});
      setEditingField(null);
      setSuccess("Profile updated!");
    } catch (e) {
      console.error("Error updating profile field:", e);
      setError(
        e instanceof Error ? `Error: ${e.message}` : "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFieldCancel = () => {
    setEditingField(null);
    setFieldValue(undefined);
    setError(null);
    setSuccess(null);
  };

  const DataField = ({
    label,
    value,
    field,
  }: {
    label: string;
    value: string | number | undefined;
    field: string;
  }) => (
    <div className="flex items-center justify-between py-3 border-b">
      <div className="text-sm">{label}</div>
      <div className="flex items-center gap-2">
        {editingField === field ? (
          <>
            {field === "sex" || field === "activity_level" ? (
              <select
                className="w-44 border rounded px-2 py-1"
                value={fieldValue ?? ""}
                onChange={(e) => setFieldValue(e.target.value)}
              >
                <option value="">Select</option>
                {(field === "sex" ? sexOptions : activityOptions).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                className="w-24"
                type={field === "full_name" ? "text" : "number"}
                value={fieldValue ?? ""}
                onChange={(e) =>
                  setFieldValue(
                    field === "full_name"
                      ? e.target.value
                      : Number(e.target.value)
                  )
                }
              />
            )}
            <Button
              size="sm"
              onClick={() => handleFieldSave(field)}
              disabled={loading}
            >
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleFieldCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <span className="font-medium">
              {value !== undefined ? (
                field === "sex" ? (
                  sexOptions.find((opt) => opt.value === value)?.label
                ) : field === "activity_level" ? (
                  activityOptions.find((opt) => opt.value === value)?.label
                ) : (
                  value
                )
              ) : (
                <span className="text-muted-foreground">Not set</span>
              )}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleFieldEdit(field, value)}
            >
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bio Information Card */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <Avatar className="h-16 w-16">
            {avatarUrl ? (
              <AvatarImage
                src={avatarUrl}
                alt={profile?.full_name || "Profile"}
              />
            ) : (
              <AvatarFallback>
                {profile?.full_name
                  ? profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <CardTitle className="text-xl">
              {profile?.full_name || "User"}
            </CardTitle>
            <CardDescription>{profile?.email}</CardDescription>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <h2 className="text-base font-semibold mb-4">Personal Information</h2>
          <div className="space-y-1">
            <DataField
              label="Name"
              value={profile?.full_name}
              field="full_name"
            />
            <DataField label="Age" value={profile?.age} field="age" />
            <DataField
              label="Height (in)"
              value={profile?.height}
              field="height"
            />
            <DataField
              label="Weight (lbs)"
              value={profile?.weight}
              field="weight"
            />
            <DataField label="Sex" value={profile?.sex} field="sex" />
            <DataField
              label="Activity Level"
              value={profile?.activity_level}
              field="activity_level"
            />

            {/* TDEE Section */}
            <div className="flex items-center justify-between py-3 border-b">
              <div className="text-sm">TDEE</div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {profile?.tdee ?? (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCalculateTDEE}
                  disabled={loading}
                  type="button"
                >
                  Calculate
                </Button>
              </div>
            </div>

            {/* Calorie Goal */}
            <DataField
              label="Calorie Goal"
              value={profile?.calorie_goal}
              field="calorie_goal"
            />
          </div>
        </CardContent>
      </Card>

      {/* Nutrition Preferences Card */}
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift">
        <CardHeader>
          <CardTitle>Macro Nutrient Distribution</CardTitle>
          <CardDescription>
            Adjust your preferred protein, carbs, and fat distribution
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Interactive Macro Distribution Bar */}
            <div
              className="relative mt-8"
              ref={barRef}
              onClick={handleSliderClick}
            >
              {/* Base colored bar */}
              <div className="h-4 w-full rounded-full overflow-hidden flex relative cursor-pointer">
                <div
                  className="bg-green-500"
                  style={{ width: `${macroForm.protein_pct}%` }}
                />
                <div
                  className="bg-yellow-500"
                  style={{ width: `${macroForm.carbs_pct}%` }}
                />
                <div
                  className="bg-blue-500"
                  style={{ width: `${macroForm.fat_pct}%` }}
                />
              </div>

              {/* Protein Handle */}
              <div
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
                style={{
                  left: `${
                    draggingHandle === "protein"
                      ? dragPosition.percent
                      : macroForm.protein_pct
                  }%`,
                  zIndex: 10,
                  transition:
                    draggingHandle === "protein"
                      ? "none"
                      : "left 0.1s ease-out",
                }}
                onMouseDown={handleDragStart("protein")}
              >
                <div className="h-7 w-7 rounded-full bg-white border-2 border-black shadow-md hover:shadow-lg" />
              </div>

              {/* Carbs Handle */}
              <div
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing touch-none"
                style={{
                  left: `${
                    draggingHandle === "carbs"
                      ? dragPosition.percent
                      : macroForm.protein_pct + macroForm.carbs_pct
                  }%`,
                  zIndex: 10,
                  transition:
                    draggingHandle === "carbs" ? "none" : "left 0.1s ease-out",
                }}
                onMouseDown={handleDragStart("carbs")}
              >
                <div className="h-7 w-7 rounded-full bg-white border-2 border-black shadow-md hover:shadow-lg" />
              </div>
            </div>

            {/* Direct input controls */}
            <div className="flex justify-between text-sm">
              <div className="text-center">
                <div className="font-semibold mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full inline-block"></div>
                  <span>Protein</span>
                </div>
                <div className="flex items-center gap-1 justify-center">
                  <button
                    className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
                    onClick={() =>
                      adjustMacro("protein", macroForm.protein_pct - 5)
                    }
                  >
                    -
                  </button>
                  <span className="w-12 text-center">
                    {macroForm.protein_pct}%
                  </span>
                  <button
                    className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
                    onClick={() =>
                      adjustMacro("protein", macroForm.protein_pct + 5)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {proteinGrams}g
                </div>
              </div>

              <div className="text-center">
                <div className="font-semibold mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></div>
                  <span>Carbs</span>
                </div>
                <div className="flex items-center gap-1 justify-center">
                  <button
                    className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
                    onClick={() =>
                      adjustMacro("carbs", macroForm.carbs_pct - 5)
                    }
                  >
                    -
                  </button>
                  <span className="w-12 text-center">
                    {macroForm.carbs_pct}%
                  </span>
                  <button
                    className="w-6 h-6 rounded-full border text-xs flex items-center justify-center"
                    onClick={() =>
                      adjustMacro("carbs", macroForm.carbs_pct + 5)
                    }
                  >
                    +
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  {carbsGrams}g
                </div>
              </div>

              <div className="text-center">
                <div className="font-semibold mb-1 flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full inline-block"></div>
                  <span>Fat</span>
                </div>
                <div className="w-12 text-center">{macroForm.fat_pct}%</div>
                <div className="text-xs text-muted-foreground">{fatGrams}g</div>
              </div>
            </div>

            {/* Save button */}
            <div className="pt-6">
              <Button
                className="w-full"
                onClick={handleMacroSave}
                disabled={loading}
              >
                Save Macro Distribution
              </Button>

              <div className="text-xs text-muted-foreground text-center mt-2">
                Recommended: {RECOMMENDED_PROTEIN_PCT}% protein /{" "}
                {RECOMMENDED_CARBS_PCT}% carbs / {RECOMMENDED_FAT_PCT}% fat
              </div>

              {macroWarning && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{macroWarning}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {(success || error) && (
        <div className="lg:col-span-2">
          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md">
              {success}
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
          )}
        </div>
      )}
    </div>
  );
}
