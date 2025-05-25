"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CalorieRadialChartProps {
  consumed: number;
  goal: number;
  loading?: boolean;
  className?: string;
}

export function CalorieRadialChart({
  consumed,
  goal,
  loading = false,
  className,
}: CalorieRadialChartProps) {
  const percentage = Math.min(100, Math.round((consumed / goal) * 100));
  const remaining = goal - consumed > 0 ? goal - consumed : 0;

  const data = [
    { name: "Consumed", value: consumed, color: "#ef4444" },
    { name: "Remaining", value: remaining, color: "#e5e7eb" },
  ];

  if (loading) {
    return (
      <Card
        className={cn(
          "shadow-lg bg-white/80 backdrop-blur-sm border-0 col-span-full hover-lift",
          className
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-52 flex items-center justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "shadow-lg bg-white/80 backdrop-blur-sm border-0 col-span-full hover-lift",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Calories</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <div className="flex items-center justify-between">
          <div className="w-1/2">
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                  >
                    {consumed}
                  </text>
                  <text
                    x="50%"
                    y="60%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm text-muted-foreground"
                  >
                    {percentage}%
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="w-1/2 grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-red-500">{consumed}</div>
              <div className="text-sm text-muted-foreground">Consumed</div>
            </div>
            <div>
              <div className="text-xl font-bold">{remaining}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
            <div className="col-span-2 mt-2">
              <div className="text-sm font-medium mb-1">
                {consumed} of {goal} kcal
              </div>
              <div className="h-3 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
