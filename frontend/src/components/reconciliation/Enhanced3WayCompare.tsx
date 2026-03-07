"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import type { FieldComparison } from "@/lib/types";

interface Enhanced3WayCompareProps {
  fieldComparisons: FieldComparison[];
}

export default function Enhanced3WayCompare({
  fieldComparisons,
}: Enhanced3WayCompareProps) {
  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case "matched":
        return "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20";
      case "mismatched":
        return "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20";
      case "partial":
        return "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20";
      case "missing":
        return "border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/20";
      default:
        return "";
    }
  };

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case "matched":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "mismatched":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "missing":
        return <AlertCircle className="h-4 w-4 text-slate-600" />;
      default:
        return null;
    }
  };

  const getFieldValueDisplay = (value: any) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value).substring(0, 50);
  };

  return (
    <Card className="border-0 bg-white shadow-lg dark:bg-slate-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">3-Way Comparison</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/30">
              Lorry Receipt
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950/30">
              Proof of Delivery
            </Badge>
            <Badge variant="outline" className="bg-pink-50 text-pink-700 dark:bg-pink-950/30">
              Invoice
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {fieldComparisons.map((comparison, idx) => (
            <motion.div
              key={comparison.field_name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`space-y-2 rounded-lg border-2 p-3 transition-all ${getMatchStatusColor(comparison.match_status)}`}
            >
              {/* Field header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getMatchStatusIcon(comparison.match_status)}
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {comparison.display_name}
                  </span>
                  {comparison.deviation_percent && (
                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                      <HelpCircle className="h-3 w-3" />
                      {comparison.deviation_percent}% deviation
                    </div>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={
                    comparison.match_status === "matched"
                      ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                      : comparison.match_status === "mismatched"
                        ? "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300"
                  }
                >
                  {comparison.match_status.toUpperCase()}
                </Badge>
              </div>

              {/* Field values grid */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Lorry Receipt
                  </div>
                  <div className="rounded bg-blue-100/50 p-2 font-mono text-xs text-slate-900 dark:bg-blue-950/30 dark:text-slate-200">
                    {getFieldValueDisplay(comparison.lr_value)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Proof of Delivery
                  </div>
                  <div className="rounded bg-purple-100/50 p-2 font-mono text-xs text-slate-900 dark:bg-purple-950/30 dark:text-slate-200">
                    {getFieldValueDisplay(comparison.pod_value)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Invoice
                  </div>
                  <div className="rounded bg-pink-100/50 p-2 font-mono text-xs text-slate-900 dark:bg-pink-950/30 dark:text-slate-200">
                    {getFieldValueDisplay(comparison.invoice_value)}
                  </div>
                </div>
              </div>

              {/* Risk contribution */}
              {comparison.risk_contribution > 0 && (
                <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                  <AlertCircle className="h-3 w-3" />
                  Risk contribution: +{comparison.risk_contribution}%
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
