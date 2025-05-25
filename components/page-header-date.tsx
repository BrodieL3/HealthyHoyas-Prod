"use client";

import { Calendar } from "lucide-react";
import { format } from "date-fns";

export function PageHeaderDate() {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <Calendar className="h-4 w-4" />
      <span>{format(new Date(), "MMM d, yyyy")}</span>
    </div>
  );
}
