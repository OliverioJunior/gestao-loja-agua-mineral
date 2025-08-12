"use client";

import { ThemeProvider } from "next-themes";
import { Header } from "./Header";
import { SideBar } from "./side-bar";
import { Toaster } from "@/shared/components/ui/sonner";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface IAplication {
  children: React.ReactNode;
}
export const Aplication: React.FC<IAplication> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  if (pathname === "/login") {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex">
          <SideBar
            sidebarOpen={sidebarOpen}
            closeSidebar={() => setSidebarOpen(false)}
          />
          <div className="flex-1 lg:ml-0">
            <Header onClick={() => setSidebarOpen(!sidebarOpen)} />
            {children}
          </div>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
};
