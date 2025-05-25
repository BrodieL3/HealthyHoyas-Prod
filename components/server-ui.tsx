// Server-rendered UI components to pass as props to client components
// This avoids client-side rendering of shadcn components

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Pre-rendered skeleton components for faster loading
export function ServerSkeletons() {
  return {
    cardSkeleton: (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
        </CardContent>
      </Card>
    ),
    listSkeleton: (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-12" />
          </div>
        ))}
      </div>
    ),
    statSkeleton: (
      <div className="text-center">
        <Skeleton className="h-8 w-24 mx-auto mb-2" />
        <Skeleton className="h-3 w-20 mx-auto" />
      </div>
    ),
  };
}

// Pre-rendered form components
export function ServerFormComponents() {
  return {
    submitButton: (text: string, isLoading: boolean, disabled: boolean) => (
      <Button
        type="submit"
        className="w-full h-12 text-lg"
        disabled={isLoading || disabled}
        size="lg"
      >
        {text}
      </Button>
    ),
    inputField: (id: string, placeholder: string, type: string = "text") => (
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-12"
        required
      />
    ),
    labelField: (htmlFor: string, text: string) => (
      <Label htmlFor={htmlFor} className="text-base font-medium">
        {text}
      </Label>
    ),
  };
}

// Pre-rendered stat components
export function ServerStatComponents() {
  return {
    statCard: (
      title: string,
      value: string,
      subtitle: string,
      variant: "default" | "destructive" = "default"
    ) => (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">{value}</div>
            <div className="text-sm text-gray-500">{subtitle}</div>
          </div>
        </CardContent>
      </Card>
    ),
    progressBar: (value: number, className?: string) => (
      <Progress value={value} className={cn("h-2", className)} />
    ),
    badge: (
      text: string,
      variant: "default" | "destructive" | "secondary" = "secondary"
    ) => (
      <Badge variant={variant} className="px-3 py-1">
        {text}
      </Badge>
    ),
  };
}

// Server-rendered list components
export function ServerListComponents() {
  return {
    entryCard: (
      date: string,
      value: string,
      subtitle?: string,
      change?: number
    ) => (
      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <div>
          <div className="font-medium text-sm">{date}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          {change !== undefined && change !== 0 && (
            <div
              className={`text-xs ${
                change > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="font-semibold text-blue-500">{value}</div>
        </div>
      </div>
    ),
    emptyState: (icon: React.ReactNode, title: string, subtitle: string) => (
      <div className="text-center py-8">
        {icon}
        <p className="text-gray-500 font-medium">{title}</p>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
      </div>
    ),
  };
}
