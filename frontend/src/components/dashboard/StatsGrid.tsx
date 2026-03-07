"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import type { DashboardStats } from "@/lib/types";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface StatsGridProps {
  stats: DashboardStats;
}

function generateSparklineData(label: string) {
  // Generate mock trend data for sparkline visualization
  const baseValue = Math.random() * 50 + 50; // 50-100
  return Array.from({ length: 12 }, (_, i) => ({
    value: baseValue + Math.sin(i / 3) * 20 + Math.random() * 10,
  }));
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: "Total Audits",
      value: stats.total_audits,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg Match Rate",
      value: stats.average_match_rate,
      suffix: "%",
      decimals: 1,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "High Risk Flagged",
      value: stats.high_risk_count,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Auto-Approved",
      value: stats.auto_approved,
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
        >
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold">
                  <AnimatedCounter
                    value={item.value}
                    suffix={item.suffix || ""}
                    decimals={item.decimals || 0}
                  />
                </p>
                <div className="mt-1 h-8 w-full opacity-50">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={generateSparklineData(item.label)}>
      <Area
        type="monotone"
        dataKey="value"
        stroke={item.color.replace("text-", "#")}
        fill={item.color.replace("text-", "#")}
        fillOpacity={0.2}
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
