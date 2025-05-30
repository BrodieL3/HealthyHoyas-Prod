"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

// export async function login(formData: FormData) {
//   const supabase = await createClient();
//
//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };
//
//   const { data: authData, error } = await supabase.auth.signInWithPassword(data);
//
//   if (error) {
//     redirect("/error");
//   }
//
//   // Check if profile exists and create if it doesn't
//   if (authData.user) {
//     const { data: profile, error: profileError } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("user_id", authData.user.id)
//       .single();
//
//     if (profileError && profileError.code === "PGRST116") {
//       // Profile doesn't exist, create one with all possible fields from formData
//       const full_name = formData.get("name") || authData.user.email?.split("@") [0] || "User";
//       const age = formData.get("age") ? parseInt(formData.get("age") as string) : null;
//       const height = formData.get("height") ? parseFloat(formData.get("height") as string) : null;
//       const weight = formData.get("weight") ? parseFloat(formData.get("weight") as string) : null;
//       const sex = formData.get("sex") || null;
//       const activity_level = formData.get("activityLevel") || null;
//       const calorie_goal = formData.get("calorieGoal") ? parseInt(formData.get("calorieGoal") as string) : null;
//       const protein_pct = formData.get("proteinPct") ? parseInt(formData.get("proteinPct") as string) : 25;
//       const carbs_pct = formData.get("carbsPct") ? parseInt(formData.get("carbsPct") as string) : 50;
//       const fat_pct = formData.get("fatPct") ? parseInt(formData.get("fatPct") as string) : 25;
//
//       const { error: insertError } = await supabase
//         .from("profiles")
//         .insert({
//           user_id: authData.user.id,
//           email: authData.user.email,
//           full_name,
//           age,
//           height,
//           weight,
//           sex,
//           activity_level,
//           calorie_goal,
//           macro_settings: {
//             protein_pct,
//             carbs_pct,
//             fat_pct,
//           },
//         });
//
//       if (insertError) {
//         console.error("Error creating user profile:", insertError);
//       }
//     }
//   }
//
//   revalidatePath("/", "layout");
//   redirect("/");
// }

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error: signUpError } = await supabase.auth.signUp(data);

  if (signUpError) {
    redirect("/error");
  }

  // Do NOT create profile here; it will be created after login

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  
  // Sign out from Supabase
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return;
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
