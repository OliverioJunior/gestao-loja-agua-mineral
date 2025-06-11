"use client";

import { ThemeProvider } from "next-themes";
import { Header } from "./Header";
import { SideBar } from "./side-bar";
import { useState } from "react";
interface IAplication {
  children: React.ReactNode;
}
export const Aplication: React.FC<IAplication> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    </ThemeProvider>
  );
};
