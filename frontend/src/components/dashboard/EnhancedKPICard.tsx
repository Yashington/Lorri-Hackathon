"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

interface EnhancedKPICardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    percentage: number;
  };
  tooltip?: string;
  suffix?: string;
  decimals?: number;
  sparklineData?: { value: number }[];
}

export default function EnhancedKPICard({
  label,
  value,
  icon,
  color,
  bgColor,
  trend,
  tooltip,
  suffix,
  decimals,
}: EnhancedKPICardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTrendColor = () => {
    if (!trend) return "text-slate-600";
    return trend.direction === "up"
      ? "text-emerald-600"
      : trend.direction === "down"
        ? "text-red-600"
        : "text-slate-600";
  };

  const getTrendArrow = () => {
    if (!trend) return null;
    return trend.direction === "up"
      ? "↑"
      : trend.direction === "down"
        ? "↓"
        : "→";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <Card className="relative overflow-hidden border-0 bg-linear-to-br from-white to-slate-50 shadow-lg transition-all hover:shadow-xl dark:from-slate-800 dark:to-slate-900">
        {/* Subtle background gradient */}
        <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${bgColor} opacity-10 blur-3xl`} />

        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {label}
                </p>
                {tooltip && (
                  <div className="relative">
                    <motion.button
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                    </motion.button>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute -left-2 top-8 z-50 w-40 rounded-lg bg-slate-900 p-2 text-xs text-white shadow-lg dark:bg-white dark:text-slate-900"
                      >
                        {tooltip}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter
                    value={value}
                    suffix={suffix || ""}
                    decimals={decimals || 0}
                  />
                </p>
                {trend && (
                  <span className={`text-sm font-medium ${getTrendColor()}`}>
                    {getTrendArrow()} {trend.percentage}%
                  </span>
                )}
              </div>
            </div>
            <div className={`rounded-xl ${bgColor} p-3`}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
