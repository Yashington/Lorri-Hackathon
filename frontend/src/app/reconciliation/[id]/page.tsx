"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RiskGauge from "@/components/reconciliation/RiskGauge";
import MatchRateProgressCircle from "@/components/reconciliation/MatchRateProgressCircle";
import Enhanced3WayCompare from "@/components/reconciliation/Enhanced3WayCompare";
import DiscrepancyTimeline from "@/components/reconciliation/DiscrepancyTimeline";
import { reconciliationApi } from "@/lib/api";
import { RISK_COLORS } from "@/lib/constants";
import type { ReconciliationResult } from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  FileText,
  Clock,
  Download,
  Share2,
  Bookmark,
} from "lucide-react";
import Link from "next/link";

export default function ReconciliationDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [result, setResult] = useState<ReconciliationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    reconciliationApi
      .get(sessionId)
      .then(setResult)
      .catch(() => setError("Failed to load reconciliation result."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-700">{error || "Result not found."}</p>
        <Link href="/dashboard">
          <Button className="mt-4 gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const riskColors = RISK_COLORS[result.risk_level];

  return (
    <div className="space-y-8">
      {/* Header with breadcrumbs */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <Link
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            Audit Report
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(result.created_at).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {result.lorry_receipt.vendor_name || "Unknown Vendor"}
            </span>
            <Badge variant="outline" className="bg-slate-100">
              {result.status.toUpperCase()}
            </Badge>
            <code className="rounded bg-slate-100 px-2 py-1 text-xs font-mono dark:bg-slate-800">
              {result.session_id.slice(0, 12)}...
            </code>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Bookmark className="h-4 w-4" /> Save
          </Button>
        </div>
      </motion.div>

      {/* Visual Summary Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-4"
      >
        {/* Risk Gauge */}
        <Card className="border-0 bg-white shadow-lg dark:bg-slate-900">
          <CardContent className="p-6 flex items-center justify-center">
            <RiskGauge score={result.risk_score} />
          </CardContent>
        </Card>

        {/* Match Rate */}
        <Card className="border-0 bg-white shadow-lg dark:bg-slate-900">
          <CardContent className="p-6 flex items-center justify-center">
            <MatchRateProgressCircle matchRate={result.overall_match_score} />
          </CardContent>
        </Card>

        {/* Field Statistics */}
        <Card className="border-0 bg-linear-to-br from-blue-50 to-blue-100 shadow-lg dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-6 space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Fields Analyzed
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {result.total_fields_compared}
              </p>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-600 dark:text-emerald-400">Matched:</span>
                <span className="font-medium">{result.fields_matched}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 dark:text-red-400">Mismatched:</span>
                <span className="font-medium">{result.fields_mismatched}</span>
              </div>
              {result.fields_missing > 0 && (
                <div className="flex justify-between">
                  <span className="text-amber-600 dark:text-amber-400">Missing:</span>
                  <span className="font-medium">{result.fields_missing}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendation */}
        <Card className={`border-0 shadow-lg dark:bg-slate-900 ${riskColors.bg}`}>
          <CardContent className="p-6 flex h-full flex-col justify-between">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                Recommendation
              </p>
              <p className={`text-sm font-medium leading-relaxed ${riskColors.text}`}>
                {result.recommendation}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Badge className={`${riskColors.bg} ${riskColors.text} border-0`}>
                {result.risk_level.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Discrepancy Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <DiscrepancyTimeline
          discrepancies={result.discrepancy_summary}
          createdAt={result.created_at}
        />
      </motion.div>

      {/* Enhanced 3-Way Comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Enhanced3WayCompare fieldComparisons={result.field_comparisons} />
      </motion.div>

      {/* Document Information Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            doc: result.lorry_receipt,
            label: "Lorry Receipt",
            icon: FileText,
            color: "blue",
          },
          {
            doc: result.proof_of_delivery,
            label: "Proof of Delivery",
            icon: FileText,
            color: "purple",
          },
          { doc: result.invoice, label: "Invoice", icon: FileText, color: "pink" },
        ].map(({ doc, label, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Card className="border-0 bg-white shadow-lg dark:bg-slate-900 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Icon className={`h-4 w-4 text-${color}-600`} />
                    {label}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {Math.round(doc.confidence_score * 100)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="grid grid-cols-2 gap-2">
                  {doc.document_number && (
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Doc #
                      </p>
                      <p className="truncate">{doc.document_number}</p>
                    </div>
                  )}
                  {doc.date && (
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Date
                      </p>
                      <p>{doc.date}</p>
                    </div>
                  )}
                  {doc.total_amount !== undefined && (
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Amount
                      </p>
                      <p>
                        {typeof doc.total_amount === "number"
                          ? `₹${doc.total_amount.toFixed(2)}`
                          : doc.total_amount}
                      </p>
                    </div>
                  )}
                  {doc.total_weight !== undefined && (
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        Weight
                      </p>
                      <p>{doc.total_weight} kg</p>
                    </div>
                  )}
                </div>
                {doc.vehicle_number && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      Vehicle
                    </p>
                    <p className="font-mono">{doc.vehicle_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Line Items Summary */}
      {result.line_item_matches.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-0 bg-white shadow-lg dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg">Line Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50 dark:bg-slate-800/50">
                      <th className="px-4 py-3 text-left font-medium">Description</th>
                      <th className="px-4 py-3 text-center font-medium">LR Qty</th>
                      <th className="px-4 py-3 text-center font-medium">POD Qty</th>
                      <th className="px-4 py-3 text-center font-medium">Invoice Qty</th>
                      <th className="px-4 py-3 text-center font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.line_item_matches.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-3">
                          {item.lr_item?.description || "—"}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          {item.lr_item?.quantity || "—"}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          {item.pod_item?.quantity || "—"}
                        </td>
                        <td className="px-4 py-3 text-center font-mono">
                          {item.invoice_item?.quantity || "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            variant="outline"
                            className={
                              item.quantity_match
                                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30"
                                : "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/30"
                            }
                          >
                            {item.quantity_match ? "✓ Match" : "✗ Mismatch"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
