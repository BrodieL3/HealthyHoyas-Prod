// Centralized icon exports to avoid barrel file imports
// Import all icons once here, then import from this file throughout the app

import {
  // Navigation & UI
  Calendar,
  CalendarIcon,
  Clock,
  Moon,
  Footprints,
  Weight,
  Scale,
  Target,
  TrendingUp,
  BarChart3,
  Trophy,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,

  // Charts & Analytics
  BarChart,
  LineChart,
  PieChart,
  Activity,

  // Status & Feedback
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  X,
  Plus,
  Trash2,
  Save,
  Edit,

  // Food & Dining
  UtensilsCrossed,
  PlusCircle,

  // Interactive
  Search,
  Circle,
  Dot,
  GripVertical,
} from "lucide-react";

// Re-export all icons
export {
  Calendar,
  CalendarIcon,
  Clock,
  Moon,
  Footprints,
  Weight,
  Scale,
  Target,
  TrendingUp,
  BarChart3,
  Trophy,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  BarChart,
  LineChart,
  PieChart,
  Activity,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  X,
  Plus,
  Trash2,
  Save,
  Edit,
  UtensilsCrossed,
  PlusCircle,
  Search,
  Circle,
  Dot,
  GripVertical,
};

// Common icon sets for specific features
export const NavigationIcons = {
  Calendar,
  Clock,
  Moon,
  Footprints,
  Weight,
  BarChart3,
} as const;

export const ChartIcons = {
  BarChart,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  TrendingUp,
} as const;

export const FormIcons = {
  Calendar: CalendarIcon,
  Clock,
  Search,
  Check,
  X,
  Plus,
  Trash2,
  Save,
  Edit,
} as const;

export const StatusIcons = {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Target,
  TrendingUp,
  Trophy,
} as const;
