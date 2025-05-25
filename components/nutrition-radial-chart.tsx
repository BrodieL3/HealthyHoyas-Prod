"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NutritionChartProps {
  title: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
  loading?: boolean;
  className?: string;
}

export function NutritionRadialChart({
  title,
  value,
  max,
  color,
  unit = "g",
  loading = false,
  className,
}: NutritionChartProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const remaining = max - value > 0 ? max - value : 0;

  const data = [
    { name: "Consumed", value: value, color: color },
    { name: "Remaining", value: remaining, color: "#e5e7eb" },
  ];

  if (loading) {
    return (
      <Card
        className={cn(
          "shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift",
          className
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent className="h-32 flex items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "shadow-lg bg-white/80 backdrop-blur-sm border-0 hover-lift",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={55}
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
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-lg font-bold"
              >
                {percentage}%
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2 text-sm text-muted-foreground">
          {value} {unit} / {max} {unit}
        </div>
      </CardContent>
    </Card>
  );
}

export function NutritionRadialCharts({
  data,
  loading = false,
  className,
}: {
  data: Array<{
    name: string;
    value: number;
    goal: number;
    color: string;
    unit?: string;
  }>;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {data.map((item) => (
        <NutritionRadialChart
          key={item.name}
          title={item.name}
          value={item.value}
          max={item.goal}
          color={item.color}
          unit={item.unit}
          loading={loading}
        />
      ))}
    </div>
  );
}
