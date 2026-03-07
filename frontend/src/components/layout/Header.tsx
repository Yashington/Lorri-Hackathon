"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Moon, Sun, Bell, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/store";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useUIStore();
  const [notificationCount] = useState(3);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/80">
      <div className="ml-64 flex items-center justify-between px-8 py-4">
        {/* Search Bar */}
        <div className="flex flex-1 max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audits, vendors..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchOpen(true)}
          />
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            )}
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </motion.button>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Settings className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </motion.button>

          {/* User Menu */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-9 w-9 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md"
          >
            <User className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
