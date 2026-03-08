"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Upload,
  ClipboardList,
  Brain,
  ChevronLeft,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-blue-500 to-indigo-500" },
  { href: "/upload", label: "New Audit", icon: Upload, color: "from-emerald-500 to-teal-500" },
  { href: "/reconciliation", label: "Audit History", icon: ClipboardList, color: "from-purple-500 to-violet-500" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, color: "from-orange-500 to-amber-500" },
  { href: "/settings", label: "Settings", icon: Settings, color: "from-slate-500 to-gray-500" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isExpanded = sidebarOpen;
  const showLabels = isMobile || isExpanded;

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl transition-all duration-300",
          isMobile
            ? cn("w-72", sidebarOpen ? "translate-x-0" : "-translate-x-full")
            : cn(isExpanded ? "w-72" : "w-[70px]")
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border/50",
            showLabels ? "gap-3 px-5" : "justify-center px-2"
          )}
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/25"
          >
            <Brain className="h-5 w-5 text-white" />
          </motion.div>
          <AnimatePresence>
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-bold tracking-tight">
                  Recon<span className="gradient-text">AI</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Document Intelligence
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (isMobile && sidebarOpen) toggleSidebar();
                }}
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
                title={!showLabels ? item.label : undefined}
                className={cn(
                  "group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                  showLabels ? "gap-3 px-3 py-2.5" : "justify-center px-2 py-2.5",
                  isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className={cn("absolute inset-0 rounded-xl bg-gradient-to-r shadow-lg", item.color)}
                    style={{ boxShadow: "0 4px 15px rgba(99,102,241,0.3)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Hover background */}
                {!isActive && hoveredItem === item.href && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-xl bg-accent"
                  />
                )}

                <span className="relative z-10 flex items-center gap-3">
                  <item.icon className={cn("h-[18px] w-[18px] shrink-0 transition-transform", isActive && "drop-shadow-sm")} />
                  <AnimatePresence>
                    {showLabels && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/50 p-3">
          <AnimatePresence>
            {showLabels && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  <p className="text-xs font-semibold text-foreground">Powered by AI</p>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Azure Document Intelligence
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse toggle - desktop only */}
          {!isMobile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="flex w-full items-center justify-center rounded-xl p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  !isExpanded && "rotate-180"
                )}
              />
            </motion.button>
          )}
        </div>
      </aside>
    </>
  );
}
