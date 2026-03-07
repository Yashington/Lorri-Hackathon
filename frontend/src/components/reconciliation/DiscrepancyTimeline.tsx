"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import type { ReconciliationResult } from "@/lib/types";

interface DiscrepancyTimelineProps {
  discrepancies: string[];
  createdAt: string;
}

export default function DiscrepancyTimeline({
  discrepancies,
  createdAt,
}: DiscrepancyTimelineProps) {
  const timelineItems = discrepancies.map((disc, idx) => ({
    id: idx,
    message: disc,
    timestamp: new Date(
      new Date(createdAt).getTime() + idx * 1000
    ).toLocaleTimeString(),
    severity: disc.toLowerCase().includes("critical")
      ? "critical"
      : disc.toLowerCase().includes("mismatch")
        ? "high"
        : "info",
  }));

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800";
      case "high":
        return "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800";
    }
  };

  return (
    <Card className="border-0 bg-white shadow-lg dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-lg">Discrepancy Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {timelineItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">No discrepancies detected - all fields match!</span>
            </motion.div>
          ) : (
            timelineItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex gap-3 rounded-lg border p-3 ${getSeverityColor(item.severity)}`}
              >
                <div className="shrink-0 pt-0.5">
                  {getSeverityIcon(item.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {item.timestamp}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
