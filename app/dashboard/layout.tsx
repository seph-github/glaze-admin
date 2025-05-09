import DashboardFooter from "@/components/Dashboard/Footer";
import DashboardHeader from "@/components/Dashboard/Header";
import { DashboardSidebar } from "@/components/Dashboard/Sidebar";
import TopLoadingBar from "@/components/ui/TopLoadingBar";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <TopLoadingBar />
        <div className="flex">
          <DashboardSidebar />
          <div className="ml-64 w-full min-h-screen flex flex-col bg-background">
            <DashboardHeader />
            <main className="flex-1 p-6">{children}</main>
            <DashboardFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
