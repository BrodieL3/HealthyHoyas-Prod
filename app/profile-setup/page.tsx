"use client";

import { act, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");
  const [proteinPct, setProteinPct] = useState("25");
  const [carbsPct, setCarbsPct] = useState("50");
  const [fatPct, setFatPct] = useState("25");

  // Match settings page options
  const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
  const activityOptions = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Light Exercise (1-2 days/week)" },
    { value: "moderate", label: "Moderate Exercise (3-5 days/week)" },
    { value: "heavy", label: "Heavy Exercise (6-7 days/week)" },
    { value: "athlete", label: "Athlete (2x per day)" },
  ];

  // Modal state for TDEE
  const [showTDEE, setShowTDEE] = useState(false);
  const [tdeeValue, setTDEEValue] = useState<number | null>(null);
  const [tdeeError, setTDEEError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (profile && isMounted) {
        setName(profile.full_name || "");
        setAge(profile.age ? String(profile.age) : "");
        setHeight(profile.height ? String(profile.height) : "");
        setWeight(profile.weight ? String(profile.weight) : "");
        setSex(profile.sex || "");
        setActivityLevel(profile.activity_level || "");
        setCalorieGoal(profile.calorie_goal ? String(profile.calorie_goal) : "");
        setProteinPct(profile.macro_settings?.protein_pct ? String(profile.macro_settings.protein_pct) : "25");
        setCarbsPct(profile.macro_settings?.carbs_pct ? String(profile.macro_settings.carbs_pct) : "50");
        setFatPct(profile.macro_settings?.fat_pct ? String(profile.macro_settings.fat_pct) : "25");
      }
      setLoading(false);
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !age || !height || !weight || !sex || !activityLevel || !calorieGoal ) {
      setError("Fill in all the fields");
      setLoading(false);
      return;
    }


    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    // Validate macro percentages
    const totalMacros = Number(proteinPct) + Number(carbsPct) + Number(fatPct);
    if (totalMacros !== 100) {
      setError("Macro percentages must add up to 100%");
      setLoading(false);
      return;
    }

    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({
        email: user.email,
        full_name: name || user.email?.split("@")[0] || "User",
        age: age ? parseInt(age) : null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        sex: sex || null,
        activity_level: activityLevel || null,
        calorie_goal: calorieGoal ? parseInt(calorieGoal) : null,
        macro_settings: {
          protein_pct: proteinPct ? parseInt(proteinPct) : 25,
          carbs_pct: carbsPct ? parseInt(carbsPct) : 50,
          fat_pct: fatPct ? parseInt(fatPct) : 25,
        },
      })
      .eq('user_id', user.id)
      .select();

    if (updateError) {
      console.error("Failed to save profile:", updateError);
      setError("Failed to save profile: " + updateError.message);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setError("No profile was updated. Please try again.");
      setLoading(false);
      return;
    }

    // Redirect to dashboard
    router.push("/");
  }

  // TDEE calculation helper
  function calculateTDEE({ age, height, weight, sex, activity_level }: { age?: number; height?: number; weight?: number; sex?: string; activity_level?: string; }): number | null {
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
    const multiplier = activityMultipliers[activity_level as keyof typeof activityMultipliers] || 1.2;
    return Math.round(bmr * multiplier);
  }

  function handleCalculateTDEE() {
    setTDEEError(null);
    const ageNum = Number(age);
    const heightNum = Number(height);
    const weightNum = Number(weight);
    if (!ageNum || !heightNum || !weightNum || !sex || !activityLevel) {
      setTDEEError("Please fill in age, height, weight, sex, and activity level.");
      return;
    }
    const tdee = calculateTDEE({ age: ageNum, height: heightNum, weight: weightNum, sex, activity_level: activityLevel });
    if (!tdee) {
      setTDEEError("Could not calculate TDEE. Please check your inputs.");
      return;
    }
    setTDEEValue(tdee);
    setShowTDEE(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>Complete Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <Label>Age</Label>
              <Input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" min={0} max={120} />
            </div>
            <div>
              <Label>Height (inches)</Label>
              <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Height in inches" min={0} step={0.1} />
            </div>
            <div>
              <Label>Weight (pounds)</Label>
              <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Weight in pounds" min={0} step={0.1} />
            </div>
            <div>
              <Label>Sex</Label>
              <select
                className="w-full border rounded px-2 py-2"
                value={sex}
                onChange={e => setSex(e.target.value)}
              >
                <option value="">Select</option>
                {sexOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Activity Level</Label>
              <select
                className="w-full border rounded px-2 py-2"
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value)}
              >
                <option value="">Select</option>
                {activityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Calculate TDEE Button */}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={handleCalculateTDEE}
                disabled={loading}
                className="mt-2"
              >
                Calculate TDEE (Total Daily Energy Expenditure) to pick calories
              </Button>
              {tdeeError && <p className="text-xs text-red-500 mt-1">{tdeeError}</p>}
            </div>
            {showTDEE && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full relative animate-fade-in">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowTDEE(false)}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h3 className="text-xl font-semibold mb-2">Estimated TDEE</h3>
                  <p className="text-2xl font-bold mb-2">{tdeeValue} kcal/day</p>
                  <p className="text-sm text-muted-foreground mb-2">This is your estimated daily calorie need based on your inputs. Use this as a guide for your calorie goal.</p>
                  <Button onClick={() => setShowTDEE(false)} className="w-full mt-2">Close</Button>
                </div>
              </div>
            )}
            <div>
              <Label>Daily Calorie Goal</Label>
              <Input type="number" value={calorieGoal} onChange={e => setCalorieGoal(e.target.value)} placeholder="Calorie goal" min={0} />
            </div>
            <div>
              <Label>Macro Distribution</Label>
              <div className="flex gap-2">
                <Input type="number" value={proteinPct} onChange={e => setProteinPct(e.target.value)} placeholder="Protein %" min={0} max={100} />
                <Input type="number" value={carbsPct} onChange={e => setCarbsPct(e.target.value)} placeholder="Carbs %" min={0} max={100} />
                <Input type="number" value={fatPct} onChange={e => setFatPct(e.target.value)} placeholder="Fat %" min={0} max={100} />
              </div>
              <p className="text-xs text-muted-foreground">Percentages must add up to 100%</p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 