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
}

export default function EnhancedKPICard({
  label,
  value,
  icon,
  bgColor,
  trend,
  tooltip,
  suffix,
  decimals,
}: EnhancedKPICardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTrendColor = () => {
    if (!trend) return "text-muted-foreground";
    return trend.direction === "up"
      ? "text-emerald-500"
      : trend.direction === "down"
        ? "text-red-500"
        : "text-muted-foreground";
  };

  const getTrendArrow = () => {
    if (!trend) return null;
    return trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="relative overflow-hidden border-border/50 shadow-md transition-shadow hover:shadow-lg">
        <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${bgColor} opacity-50 blur-2xl`} />
        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                {tooltip && (
                  <div className="relative">
                    <button
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      className="text-muted-foreground/50 hover:text-muted-foreground"
                    >
                      <HelpCircle className="h-3 w-3" />
                    </button>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -left-2 top-6 z-50 w-40 rounded-lg bg-popover p-2 text-xs text-popover-foreground shadow-lg border border-border"
                      >
                        {tooltip}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold">
                  <AnimatedCounter value={value} suffix={suffix || ""} decimals={decimals || 0} />
                </p>
                {trend && trend.percentage > 0 && (
                  <span className={`text-xs font-medium ${getTrendColor()}`}>
                    {getTrendArrow()} {trend.percentage}%
                  </span>
                )}
              </div>
            </div>
            <div className={`rounded-xl ${bgColor} p-2.5`}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
