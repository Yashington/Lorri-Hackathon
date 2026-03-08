"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Search, Moon, Sun, User, Menu, Bell } from "lucide-react";
import { useUIStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery, sidebarOpen, toggleSidebar } =
    useUIStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300",
        "ml-0",
        sidebarOpen ? "md:ml-72" : "md:ml-[70px]"
      )}
    >
      <div className="flex h-14 items-center gap-4 px-4 md:px-6">
        {/* Mobile hamburger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg p-2 hover:bg-accent md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </motion.button>

        {/* Search Bar */}
        <div className="group flex max-w-md flex-1 items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-4 py-2 transition-all focus-within:border-primary/50 focus-within:bg-background focus-within:shadow-sm focus-within:shadow-primary/5">
          <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            type="text"
            placeholder="Search audits, vendors..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Notification */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-xl p-2 hover:bg-accent"
          >
            <Bell className="h-[18px] w-[18px] text-muted-foreground" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          </motion.button>

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl p-2 hover:bg-accent"
          >
            <AnimatedThemeIcon theme={theme} />
          </motion.button>

          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20"
          >
            <User className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}

function AnimatedThemeIcon({ theme }: { theme: string | undefined }) {
  return (
    <motion.div
      key={theme}
      initial={{ rotate: -90, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] text-amber-400" />
      ) : (
        <Moon className="h-[18px] w-[18px] text-indigo-500" />
      )}
    </motion.div>
  );
}
