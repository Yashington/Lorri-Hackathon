"use client";

import { ReactNode, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import SplashScreen from "@/components/shared/SplashScreen";

export function Providers({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" onComplete={handleSplashComplete} />}
      </AnimatePresence>
      {!showSplash && children}
    </ThemeProvider>
  );
}
