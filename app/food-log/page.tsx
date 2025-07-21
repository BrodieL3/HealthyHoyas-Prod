"use client";

import { LogFood } from "@/components/log-food";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { PageHeaderDate } from "@/components/page-header-date";

export default function FoodLogPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserId() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setUserId(data.user?.id || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUserId();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <div className="bg-transparent backdrop-blur-md pr-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Food Log</h1>
                <p className="text-gray-600 mt-1 hidden md:block">
                  Log your meals and track nutrition
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <PageHeaderDate />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <div className="bg-transparent backdrop-blur-md pr-6 py-4 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Food Log</h1>
                <p className="text-gray-600 mt-1 hidden md:block">
                  Log your meals and track nutrition
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <PageHeaderDate />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-muted-foreground">Please sign in to log food</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="bg-transparent backdrop-blur-md pr-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Food Log</h1>
              <p className="text-gray-600 mt-1 hidden md:block">
                Log your meals and track nutrition
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <PageHeaderDate />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <LogFood userId={userId} />
      </div>
    </div>
  );
}
