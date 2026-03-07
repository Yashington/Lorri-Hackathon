"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatsGrid from "@/components/dashboard/StatsGrid";
import MatchRateChart from "@/components/dashboard/MatchRateChart";
import StatusDistributionChart from "@/components/dashboard/StatusDistributionChart";
import RiskBreakdownChart from "@/components/dashboard/RiskBreakdownChart";
import VendorPerformanceChart from "@/components/dashboard/VendorPerformanceChart";
import RecentAuditsTable from "@/components/dashboard/RecentAuditsTable";
import EnhancedKPICard from "@/components/dashboard/EnhancedKPICard";
import { dashboardApi } from "@/lib/api";
import { RISK_COLORS } from "@/lib/constants";
import type { DashboardStats } from "@/lib/types";
import {
  Plus,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Zap,
  ArrowUpRight,
} from "lucide-react";

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
        <div className="flex animate-pulse items-center justify-between">
          <div>
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="mt-2 h-4 w-64 rounded bg-muted" />
          </div>
          <div className="h-10 w-32 rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-64 rounded-xl bg-muted" />
          <div className="h-64 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  // Prepare chart data
  const matchRateData = stats.recent_audits
    .slice(0, 7)
    .map((audit) => ({
      date: audit.created_at.split("T")[0],
      matchRate: audit.overall_match_score,
    }))
    .reverse();

  const statusData = [
    { name: "auto_approved", value: stats.auto_approved },
    { name: "needs_review", value: stats.needs_review },
    { name: "rejected", value: stats.rejected },
  ];

  const riskData = [
    {
      name: "Low",
      value: Math.floor(stats.total_audits * 0.4),
      color: "#10b981",
    },
    {
      name: "Medium",
      value: Math.floor(stats.total_audits * 0.35),
      color: "#f59e0b",
    },
    {
      name: "High",
      value: Math.floor(stats.total_audits * 0.2),
      color: "#ef4444",
    },
    {
      name: "Critical",
      value: stats.high_risk_count,
      color: "#7c3aed",
    },
  ];

  const vendorData = [
    {
      vendor_name: "FastFreight Ltd",
      avg_match_rate: 92,
      recent_audits: 14,
      risk_incidents: 1,
    },
    {
      vendor_name: "SwiftCargo Inc",
      avg_match_rate: 88,
      recent_audits: 12,
      risk_incidents: 2,
    },
    {
      vendor_name: "LogisticsPro",
      avg_match_rate: 95,
      recent_audits: 10,
      risk_incidents: 0,
    },
    {
      vendor_name: "TransportHub",
      avg_match_rate: 85,
      recent_audits: 8,
      risk_incidents: 3,
    },
    {
      vendor_name: "ExpressShip",
      avg_match_rate: 78,
      recent_audits: 6,
      risk_incidents: 2,
    },
    {
      vendor_name: "GlobalLogistics",
      avg_match_rate: 90,
      recent_audits: 9,
      risk_incidents: 1,
    },
    {
      vendor_name: "PrimeDelivery",
      avg_match_rate: 93,
      recent_audits: 11,
      risk_incidents: 0,
    },
    {
      vendor_name: "FlexTransit",
      avg_match_rate: 87,
      recent_audits: 7,
      risk_incidents: 1,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Real-time insights into your document reconciliation operations
          </p>
        </div>
        <Link href="/upload">
          <Button className="group gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            New Audit
          </Button>
        </Link>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EnhancedKPICard
          label="Total Audits"
          value={stats.total_audits}
          icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
          color="text-blue-600"
          bgColor="bg-blue-100"
          trend={{
            direction: "up",
            percentage: 12,
          }}
          tooltip="Total number of reconciliation audits processed"
          suffix=""
        />
        <EnhancedKPICard
          label="Avg Match Rate"
          value={stats.average_match_rate}
          icon={<ArrowUpRight className="h-6 w-6 text-emerald-600" />}
          color="text-emerald-600"
          bgColor="bg-emerald-100"
          trend={{
            direction: "up",
            percentage: 5,
          }}
          suffix="%"
          decimals={1}
          tooltip="Average match rate across all documents"
        />
        <EnhancedKPICard
          label="High Risk Flagged"
          value={stats.high_risk_count}
          icon={<AlertTriangle className="h-6 w-6 text-orange-600" />}
          color="text-orange-600"
          bgColor="bg-orange-100"
          trend={{
            direction: "down",
            percentage: 8,
          }}
          tooltip="Number of audits flagged as high risk"
        />
        <EnhancedKPICard
          label="Auto-Approved"
          value={stats.auto_approved}
          icon={<Zap className="h-6 w-6 text-purple-600" />}
          color="text-purple-600"
          bgColor="bg-purple-100"
          trend={{
            direction: "up",
            percentage: 15,
          }}
          tooltip="Audits approved automatically"
        />
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MatchRateChart data={matchRateData} />
        </div>
        <StatusDistributionChart data={statusData} />
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RiskBreakdownChart data={riskData} />
        <VendorPerformanceChart data={vendorData} />
      </div>

      {/* Recent Audits Table */}
      <RecentAuditsTable data={stats.recent_audits} />

      {/* Quick Actions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 bg-linear-to-r from-blue-50 to-purple-50 shadow-lg dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link href="/upload">
                <Button variant="outline" className="w-full">
                  New Audit
                </Button>
              </Link>
              <Link href="/reconciliation">
                <Button variant="outline" className="w-full">
                  View History
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                Export Report
              </Button>
              <Button variant="outline" className="w-full">
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}