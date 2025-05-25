import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WeightTrackingSkeletons() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>

            {/* Chart Skeleton */}
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Skeleton className="h-8 w-24 mx-auto mb-2" />
                    <Skeleton className="h-3 w-20 mx-auto" />
                  </div>
                  <Skeleton className="h-6 w-16 mx-auto" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SleepTrackingSkeletons() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-44 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepsTrackingSkeletons() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Skeleton */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats Skeleton */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Skeleton className="h-8 w-32 mx-auto mb-2" />
                    <Skeleton className="h-3 w-20 mx-auto" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
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
                      <div className="text-right">
                        <Skeleton className="h-5 w-16 mb-1" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FoodLogSkeletons() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar Skeleton */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-48 px-4 py-2 space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-3 h-3 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-36" />
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Skeleton className="h-6 w-8 mx-auto mb-2" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="col-span-6">
            <Card className="h-full">
              <CardHeader>
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-80" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="h-80 border rounded-lg p-4">
                  <Skeleton className="h-8 w-24 mx-auto mb-4" />
                  <Skeleton className="h-4 w-48 mx-auto mb-2" />
                  <Skeleton className="h-3 w-36 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-28" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-3 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-12 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
