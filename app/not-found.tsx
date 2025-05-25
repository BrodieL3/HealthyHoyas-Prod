export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-lg">Page not found</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Not Found | HealthyHoyas",
  description: "The page you're looking for doesn't exist.",
};
