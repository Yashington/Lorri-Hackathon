"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MatchRateChart from "@/components/dashboard/MatchRateChart";
import StatusDistributionChart from "@/components/dashboard/StatusDistributionChart";
import RiskBreakdownChart from "@/components/dashboard/RiskBreakdownChart";
import VendorPerformanceChart from "@/components/dashboard/VendorPerformanceChart";
import RecentAuditsTable from "@/components/dashboard/RecentAuditsTable";
import EnhancedKPICard from "@/components/dashboard/EnhancedKPICard";
import { dashboardApi } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";
import {
  computeRiskDistribution,
  computeVendorStats,
  computeMatchRateTrend,
  generateAllAuditsCSV,
  downloadCSV,
} from "@/lib/computed";
import {
  Plus,
  AlertTriangle,
  BarChart3,
  Zap,
  ArrowUpRight,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = () => {
    setLoading(true);
    setError(null);
    dashboardApi
      .stats()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard data. Is the backend running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl border border-red-200/50 bg-red-50/50 p-8 text-center backdrop-blur-sm dark:border-red-800/50 dark:bg-red-950/20"
        >
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-500" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <Button onClick={loadStats} variant="outline" className="mt-4 gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </motion.div>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex animate-pulse items-center justify-between">
          <div>
            <div className="h-8 w-48 rounded-xl bg-muted" />
            <div className="mt-2 h-4 w-64 rounded-lg bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  const matchRateData = computeMatchRateTrend(stats.recent_audits).slice(-7);
  const statusData = [
    { name: "auto_approved", value: stats.auto_approved },
    { name: "needs_review", value: stats.needs_review },
    { name: "rejected", value: stats.rejected },
  ];
  const riskData = computeRiskDistribution(stats.recent_audits);
  const vendorData = computeVendorStats(stats.recent_audits);

  const handleExportCSV = () => {
    const csv = generateAllAuditsCSV(stats.recent_audits);
    downloadCSV(csv, `reconai-audits-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("CSV exported successfully!");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeUp}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time insights into your document reconciliation operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Link href="/upload">
            <Button className="group gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40">
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              New Audit
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <EnhancedKPICard
          label="Total Audits" value={stats.total_audits}
          icon={<BarChart3 className="h-6 w-6 text-blue-500" />}
          color="text-blue-500" bgColor="bg-blue-500/10"
          trend={{ direction: "up", percentage: 12 }}
          tooltip="Total reconciliation audits processed" suffix=""
        />
        <EnhancedKPICard
          label="Audits Today" value={stats.audits_today}
          icon={<Calendar className="h-6 w-6 text-indigo-500" />}
          color="text-indigo-500" bgColor="bg-indigo-500/10"
          trend={{ direction: "up", percentage: 0 }}
          tooltip="Audits processed today" suffix=""
        />
        <EnhancedKPICard
          label="Avg Match Rate" value={stats.average_match_rate}
          icon={<ArrowUpRight className="h-6 w-6 text-emerald-500" />}
          color="text-emerald-500" bgColor="bg-emerald-500/10"
          trend={{ direction: "up", percentage: 5 }}
          suffix="%" decimals={1} tooltip="Average match rate across all documents"
        />
        <EnhancedKPICard
          label="High Risk" value={stats.high_risk_count}
          icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
          color="text-orange-500" bgColor="bg-orange-500/10"
          trend={{ direction: "down", percentage: 8 }}
          tooltip="Audits flagged as high risk or critical"
        />
        <EnhancedKPICard
          label="Auto-Approved" value={stats.auto_approved}
          icon={<Zap className="h-6 w-6 text-purple-500" />}
          color="text-purple-500" bgColor="bg-purple-500/10"
          trend={{ direction: "up", percentage: 15 }}
          tooltip="Audits approved automatically (low risk)"
        />
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MatchRateChart data={matchRateData} />
        </div>
        <StatusDistributionChart data={statusData} />
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RiskBreakdownChart data={riskData} />
        <VendorPerformanceChart data={vendorData} />
      </motion.div>

      {/* Recent Audits */}
      <motion.div variants={fadeUp}>
        <RecentAuditsTable data={stats.recent_audits} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Link href="/upload"><Button variant="outline" className="w-full rounded-xl">New Audit</Button></Link>
              <Link href="/reconciliation"><Button variant="outline" className="w-full rounded-xl">View History</Button></Link>
              <Link href="/analytics"><Button variant="outline" className="w-full rounded-xl">Analytics</Button></Link>
              <Button variant="outline" className="w-full rounded-xl" onClick={handleExportCSV}>Export CSV</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
