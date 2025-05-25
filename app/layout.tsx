import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";
import { UserProvider } from "@/providers/user-provider";
import { getUserPromise } from "@/lib/auth-server";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create user promise on server (don't await it!)
  const userPromise = getUserPromise();

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider userPromise={userPromise}>
          <ClientLayout>{children}</ClientLayout>
        </UserProvider>
      </body>
    </html>
  );
}
