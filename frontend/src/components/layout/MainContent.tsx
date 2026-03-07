"use client";

import { motion } from "framer-motion";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();

  return (
    <main
      className={cn(
        "min-h-[calc(100vh-3.5rem)] mesh-gradient transition-[margin] duration-300",
        "ml-0",
        sidebarOpen ? "md:ml-72" : "md:ml-[70px]"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 md:p-6"
      >
        {children}
      </motion.div>
    </main>
  );
}
