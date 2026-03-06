"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsGrid from "@/components/dashboard/StatsGrid";
import { dashboardApi } from "@/lib/api";
import { RISK_COLORS } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";
import { ArrowRight, Plus } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .stats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Loading audit data...</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            Dashboard
          </motion.h1>
          <p className="text-muted-foreground">
            3-Way document reconciliation overview
          </p>
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Audit
        </Link>
      </div>

      <StatsGrid stats={stats} />

      {/* Reconciliation Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {stats.auto_approved}
            </p>
            <p className="text-sm text-muted-foreground">Auto-Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-amber-600">
              {stats.needs_review}
            </p>
            <p className="text-sm text-muted-foreground">Needs Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-red-600">
              {stats.rejected}
            </p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audits Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Audits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Session</th>
                  <th className="px-4 py-3 text-left font-medium">Vendor</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Match Rate
                  </th>
                  <th className="px-4 py-3 text-center font-medium">Risk</th>
                  <th className="px-4 py-3 text-center font-medium">Status</th>
                  <th className="px-4 py-3 text-center font-medium" />
                </tr>
              </thead>
              <tbody>
                {stats.recent_audits.map((audit, i) => {
                  const riskColors = RISK_COLORS[audit.risk_level];
                  return (
                    <motion.tr
                      key={audit.session_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {audit.session_id}
                      </td>
                      <td className="px-4 py-3">
                        {audit.lorry_receipt.vendor_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(audit.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-medium">
                          {audit.overall_match_score}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant="secondary"
                          className={`${riskColors.bg} ${riskColors.text} border ${riskColors.border}`}
                        >
                          {audit.risk_level.toUpperCase()}{" "}
                          ({audit.risk_score})
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="text-xs">
                          {audit.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/reconciliation/${audit.session_id}`}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          View <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
