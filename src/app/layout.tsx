import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ReduxProvider from "@/redux/provider";
import LoadingSpinner from "@/components/LoadingSpinner";

const inter = Inter({ subsets: ["latin"] });

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  loading: () => <LoadingSpinner />,
});

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Comprehensive Dashboard Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <ReduxProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="w-full min-h-screen flex">
              <Sidebar />
              <div className="w-full">{children}</div>
            </div>
          </Suspense>
        </ReduxProvider>
      </body>
    </html>
  );
}
