# HealthyHoyas Design System

## Overview

This document outlines the design patterns and components used throughout the HealthyHoyas application to ensure consistency and polish across all pages.

## Layout Patterns

### 1. Full-Screen Layout Structure

```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="max-w-7xl mx-auto">{/* Header content */}</div>
  </div>

  {/* Main content */}
  <div className="max-w-7xl mx-auto px-6 py-6">{/* Page content */}</div>
</div>
```

### 2. Responsive Grid System

- **Desktop**: 3-column layout (`lg:grid-cols-3`)
  - Left: 2 columns (`lg:col-span-2`) - Main content
  - Right: 1 column - Statistics/sidebar
- **Mobile**: Single column (`grid-cols-1`)

## Header Design Pattern

### Structure

```tsx
<div className="bg-white border-b border-gray-200 px-6 py-4">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">[Page Title]</h1>
        <p className="text-gray-600 mt-1">[Descriptive subtitle]</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(), "MMM d, yyyy")}</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Key Elements

- White background with bottom border
- Max width container (`max-w-7xl`)
- Title + subtitle on left
- Date/context info on right
- Consistent padding (`px-6 py-4`)

## Card Design Patterns

### 1. Primary Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-xl flex items-center">
      <Icon className="h-5 w-5 mr-2 text-[color]" />
      [Title]
    </CardTitle>
    <CardDescription>[Description text]</CardDescription>
  </CardHeader>
  <CardContent>{/* Card content */}</CardContent>
</Card>
```

### 2. Statistics Cards

```tsx
<Card>
  <CardHeader className="pb-3">
    <CardTitle className="text-lg flex items-center">
      <Icon className="h-5 w-5 mr-2 text-[color]" />
      [Title]
    </CardTitle>
  </CardHeader>
  <CardContent>{/* Statistics content */}</CardContent>
</Card>
```

## Icon Usage Guidelines

### Color Coding

- **Blue** (`text-blue-500`): Primary actions, data display
- **Green** (`text-green-500`): Success, positive metrics, health
- **Purple** (`text-purple-500`): Goals, targets
- **Orange** (`text-orange-500`): Analytics, charts
- **Yellow** (`text-yellow-500`): Achievements, progress
- **Red** (`text-red-500`): Calories, warnings

### Icon Sizes

- **Header icons**: `h-4 w-4`
- **Card title icons**: `h-5 w-5`
- **Large display icons**: `h-12 w-12` or `h-16 w-16`
- **Button icons**: `h-5 w-5`

## Form Design Patterns

### 1. Input Fields with Icons

```tsx
<div className="space-y-2">
  <Label htmlFor="field" className="text-base font-medium">
    [Label]
  </Label>
  <div className="relative">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    <Input
      id="field"
      className="pl-10 h-12"
      // other props
    />
  </div>
  <p className="text-xs text-gray-500">[Helper text]</p>
</div>
```

### 2. Quality Sliders

```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <Label className="text-base font-medium">[Label]</Label>
    <Badge variant="secondary" className="px-3 py-1">
      {value}/10
    </Badge>
  </div>
  <Slider
    min={1}
    max={10}
    step={1}
    value={[value]}
    onValueChange={(value) => setValue(value[0])}
    className="w-full"
  />
  <div className="flex justify-between text-xs text-muted-foreground pt-1">
    <span>Low (1)</span>
    <span>Medium (5)</span>
    <span>High (10)</span>
  </div>
</div>
```

### 3. Submit Buttons

```tsx
<Button
  type="submit"
  className="w-full h-12 text-lg"
  disabled={loading || !isValid}
  size="lg"
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      [Loading text]...
    </>
  ) : (
    <>
      <Icon className="mr-2 h-5 w-5" />
      [Action text]
    </>
  )}
</Button>
```

## Statistics Display Patterns

### 1. Large Metric Display

```tsx
<div className="text-center">
  <div className="text-3xl font-bold text-[color]">{value}</div>
  <div className="text-sm text-gray-500">[unit/description]</div>
</div>
```

### 2. Progress Indicators

```tsx
<div className="space-y-3">
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">[Label]:</span>
    <span className="font-semibold text-[color]">{value}</span>
  </div>
  <Progress value={(value / goal) * 100} className="h-2" />
</div>
```

### 3. Recent Entries List

```tsx
<div className="space-y-3">
  {entries.map((entry, index) => (
    <div
      key={index}
      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
    >
      <div>
        <div className="font-medium text-sm">
          {format(new Date(entry.date), "MMM d")}
        </div>
        <div className="text-xs text-gray-500">[Additional info]</div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-[color]">{entry.value}</div>
      </div>
    </div>
  ))}
</div>
```

## Empty State Patterns

```tsx
<div className="text-center py-8">
  <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
  <p className="text-gray-500 font-medium">[Primary message]</p>
  <p className="text-gray-400 text-sm mt-1">
    [Secondary message/call to action]
  </p>
</div>
```

## Loading States

### Page Loading

```tsx
<div className="flex justify-center items-center min-h-screen">
  <Loader2 className="h-8 w-8 animate-spin text-primary" />
</div>
```

### Button Loading

```tsx
<Loader2 className="mr-2 h-5 w-5 animate-spin" />
```

## Error Handling

```tsx
<div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
  <AlertCircle className="h-5 w-5 flex-shrink-0" />
  <p>{error}</p>
</div>
```

## Typography Scale

- **Page titles**: `text-2xl font-bold text-gray-900`
- **Card titles**: `text-xl` or `text-lg`
- **Section labels**: `text-base font-medium`
- **Body text**: `text-sm`
- **Helper text**: `text-xs text-gray-500`
- **Muted text**: `text-muted-foreground`

## Spacing System

- **Page padding**: `px-6 py-6`
- **Card spacing**: `space-y-6` between cards
- **Form spacing**: `space-y-6` for sections, `space-y-2` for fields
- **Grid gaps**: `gap-6`

## Color Palette

### Semantic Colors

- **Success/Health**: `text-green-500`
- **Primary Data**: `text-blue-500`
- **Goals/Targets**: `text-purple-500`
- **Analytics**: `text-orange-500`
- **Achievements**: `text-yellow-500`
- **Calories/Warnings**: `text-red-500`

### Neutral Colors

- **Primary text**: `text-gray-900`
- **Secondary text**: `text-gray-600`
- **Muted text**: `text-gray-500`
- **Helper text**: `text-gray-400`

## Responsive Design

### Breakpoints

- **Mobile**: Default (< 1024px)
- **Desktop**: `lg:` prefix (≥ 1024px)

### Layout Adjustments

- Mobile: Single column, full-width cards
- Desktop: Multi-column grids, sidebar layouts

## Component Consistency Checklist

When creating new pages, ensure:

- [ ] Full-screen layout with proper header
- [ ] Consistent icon usage and colors
- [ ] Proper card structure with titles and descriptions
- [ ] Loading and error states implemented
- [ ] Responsive design for mobile and desktop
- [ ] Empty states with helpful messaging
- [ ] Consistent typography and spacing
- [ ] Progress indicators where appropriate
- [ ] Recent entries lists for historical data
