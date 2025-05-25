import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";

// Animated wrapper components
export const FadeInUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <div
    className={cn("animate-fade-in-up", className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

export const FadeInDown = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <div
    className={cn("animate-fade-in-down", className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

export const BounceIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <div
    className={cn("animate-bounce-in", className)}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

export const Shake = ({
  children,
  trigger,
  className = "",
}: {
  children: React.ReactNode;
  trigger: boolean;
  className?: string;
}) => (
  <div className={cn(trigger && "animate-shake", className)}>{children}</div>
);

// Success state component
export const SuccessState = ({
  title,
  description,
  icon: Icon = CheckCircle2,
  className = "",
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<any>;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-12 animate-bounce-in",
      className
    )}
  >
    <Icon className="h-16 w-16 text-green-500 mb-4 animate-pulse-success" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in-up">
      {title}
    </h3>
    {description && (
      <p className="text-gray-600 text-center animate-fade-in-up">
        {description}
      </p>
    )}
  </div>
);

// Error state component
export const ErrorState = ({
  title,
  description,
  icon: Icon = AlertCircle,
  className = "",
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<any>;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-12 animate-shake",
      className
    )}
  >
    <Icon className="h-16 w-16 text-red-500 mb-4 animate-pulse-error" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-600 text-center">{description}</p>}
  </div>
);

// Loading state component
export const LoadingState = ({
  title = "Loading...",
  description,
  className = "",
}: {
  title?: string;
  description?: string;
  className?: string;
}) => (
  <div
    className={cn("flex flex-col items-center justify-center py-12", className)}
  >
    <Loader2 className="h-16 w-16 text-blue-500 mb-4 animate-spin" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
    {description && <p className="text-gray-600 text-center">{description}</p>}
  </div>
);

// Empty state component
export const EmptyState = ({
  title,
  description,
  icon: Icon,
  action,
  className = "",
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<any>;
  action?: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("text-center py-8 animate-fade-in-up", className)}>
    {Icon && (
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-wiggle" />
    )}
    <p className="text-gray-500 font-medium">{title}</p>
    {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

// Staggered list animation
export const StaggeredList = ({
  children,
  staggerDelay = 100,
  className = "",
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Hover lift wrapper
export const HoverLift = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn("hover-lift", className)}>{children}</div>;

// Pulse animation wrapper
export const Pulse = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "error";
  className?: string;
}) => {
  const pulseClass = {
    default: "animate-pulse",
    success: "animate-pulse-success",
    error: "animate-pulse-error",
  }[variant];

  return <div className={cn(pulseClass, className)}>{children}</div>;
};

// Wiggle animation wrapper
export const Wiggle = ({
  children,
  trigger = true,
  className = "",
}: {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}) => (
  <div className={cn(trigger && "animate-wiggle", className)}>{children}</div>
);

// Scale on hover wrapper
export const ScaleOnHover = ({
  children,
  scale = "110",
  className = "",
}: {
  children: React.ReactNode;
  scale?: string;
  className?: string;
}) => (
  <div
    className={cn(
      `hover:scale-${scale} transition-transform duration-200`,
      className
    )}
  >
    {children}
  </div>
);

// Shimmer loading effect
export const Shimmer = ({
  className = "",
  width = "100%",
  height = "20px",
}: {
  className?: string;
  width?: string;
  height?: string;
}) => (
  <div
    className={cn("animate-shimmer rounded", className)}
    style={{ width, height }}
  />
);

// Progress bar with animation
export const AnimatedProgress = ({
  value,
  max = 100,
  className = "",
  showValue = false,
}: {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
}) => {
  const percentage = (value / max) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="text-sm text-gray-600 mt-1 text-center">
          {value} / {max}
        </div>
      )}
    </div>
  );
};

// Notification badge with animation
export const NotificationBadge = ({
  count,
  className = "",
  maxCount = 99,
}: {
  count: number;
  className?: string;
  maxCount?: number;
}) => {
  if (count === 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-bounce-in",
        className
      )}
    >
      {displayCount}
    </span>
  );
};

export default {
  FadeInUp,
  FadeInDown,
  BounceIn,
  Shake,
  SuccessState,
  ErrorState,
  LoadingState,
  EmptyState,
  StaggeredList,
  HoverLift,
  Pulse,
  Wiggle,
  ScaleOnHover,
  Shimmer,
  AnimatedProgress,
  NotificationBadge,
};
