"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RiskScoreCard from "@/components/reconciliation/RiskScoreCard";
import ThreeWayCompare from "@/components/reconciliation/ThreeWayCompare";
import { reconciliationApi } from "@/lib/api";
import { RISK_COLORS } from "@/lib/constants";
import type { ReconciliationResult } from "@/lib/types";
import {
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  FileText,
  Clock,
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
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const riskColors = RISK_COLORS[result.risk_level];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/dashboard"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Audit Report: {result.session_id}
          </motion.h1>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(result.created_at).toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {result.lorry_receipt.vendor_name}
            </span>
            <Badge variant="outline">{result.status.toUpperCase()}</Badge>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RiskScoreCard score={result.risk_score} level={result.risk_level} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
              <p className="mb-2 text-sm text-muted-foreground">Match Rate</p>
              <p className="text-4xl font-bold">
                {result.overall_match_score}%
              </p>
              <div className="mt-3 flex gap-3 text-xs">
                <span className="text-emerald-600">
                  {result.fields_matched} matched
                </span>
                <span className="text-red-600">
                  {result.fields_mismatched} mismatched
                </span>
                {result.fields_missing > 0 && (
                  <span className="text-gray-500">
                    {result.fields_missing} missing
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            className={`h-full border ${riskColors.border} ${riskColors.bg}`}
          >
            <CardContent className="flex h-full flex-col justify-center p-6">
              <p className="mb-2 text-sm text-muted-foreground">
                Recommendation
              </p>
              <p className={`text-sm font-medium ${riskColors.text}`}>
                {result.recommendation}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Discrepancy Summary */}
      {result.discrepancy_summary.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                Discrepancies Found ({result.discrepancy_summary.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.discrepancy_summary.map((d, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-2 text-sm text-amber-900"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {d}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* 3-Way Comparison */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <ThreeWayCompare
          comparisons={result.field_comparisons}
          lineItems={result.line_item_matches}
        />
      </motion.div>

      {/* Document Info */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { doc: result.lorry_receipt, label: "Lorry Receipt", color: "blue" },
          {
            doc: result.proof_of_delivery,
            label: "Proof of Delivery",
            color: "violet",
          },
          { doc: result.invoice, label: "Invoice", color: "amber" },
        ].map(({ doc, label, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm text-${color}-600`}>
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium">Doc #:</span>{" "}
                  {doc.document_number}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {doc.date}
                </p>
                <p>
                  <span className="font-medium">Vendor:</span>{" "}
                  {doc.vendor_name}
                </p>
                <p>
                  <span className="font-medium">Confidence:</span>{" "}
                  {(doc.confidence_score * 100).toFixed(0)}%
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
