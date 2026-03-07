"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { reconciliationApi } from "@/lib/api";
import type { ReconciliationResult } from "@/lib/types";
import {
  computeRiskDistribution,
  computeVendorStats,
  computeMatchRateTrend,
  computeAuditVolume,
  computeDiscrepancyBreakdown,
} from "@/lib/computed";
import { BarChart3, TrendingUp, AlertTriangle, Users, FileWarning } from "lucide-react";
import { format, parseISO } from "date-fns";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AnalyticsPage() {
  const [audits, setAudits] = useState<ReconciliationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reconciliationApi.list().then(setAudits).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (<div key={i} className="h-72 animate-pulse rounded-2xl bg-muted" />))}
        </div>
      </div>
    );
  }

  const matchTrend = computeMatchRateTrend(audits);
  const riskDist = computeRiskDistribution(audits);
  const vendorStats = computeVendorStats(audits);
  const auditVolume = computeAuditVolume(audits);
  const discrepancies = computeDiscrepancyBreakdown(audits);

  const totalAudits = audits.length;
  const avgMatch = totalAudits > 0 ? (audits.reduce((s, a) => s + a.overall_match_score, 0) / totalAudits).toFixed(1) : "0";
  const highRisk = audits.filter((a) => a.risk_level === "high" || a.risk_level === "critical").length;
  const uniqueVendors = vendorStats.length;

  const tooltipStyle = { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--card-foreground)" };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">Analytics</span></h1>
        <p className="mt-1 text-muted-foreground">Comprehensive insights from all reconciliation audits</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Audits", value: totalAudits, icon: BarChart3, gradient: "from-blue-500/10 to-indigo-500/10", color: "text-blue-500" },
          { label: "Avg Match Rate", value: `${avgMatch}%`, icon: TrendingUp, gradient: "from-emerald-500/10 to-teal-500/10", color: "text-emerald-500" },
          { label: "High Risk Audits", value: highRisk, icon: AlertTriangle, gradient: "from-red-500/10 to-orange-500/10", color: "text-red-500" },
          { label: "Unique Vendors", value: uniqueVendors, icon: Users, gradient: "from-purple-500/10 to-pink-500/10", color: "text-purple-500" },
        ].map((m) => (
          <motion.div key={m.label} variants={fadeUp} whileHover={{ y: -2 }}>
            <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-3 py-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${m.gradient}`}>
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{m.value}</p>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Match Rate Trend</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matchTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tickFormatter={(d) => { try { return format(parseISO(d), "MMM d"); } catch { return d; } }} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="matchRate" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366f1" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Risk Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskDist} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {riskDist.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Audit Volume by Date</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={auditVolume} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tickFormatter={(d) => { try { return format(parseISO(d), "MMM d"); } catch { return d; } }} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileWarning className="h-4 w-4" /> Top Discrepancy Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {discrepancies.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No discrepancies found</p>
            ) : (
              <div className="space-y-3">
                {discrepancies.map((d, i) => (
                  <motion.div key={d.type} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                    <span className="w-6 text-right text-xs font-bold text-muted-foreground">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{d.type}</span>
                        <Badge variant="secondary" className="text-xs">{d.count}</Badge>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(d.count / Math.max(...discrepancies.map((x) => x.count))) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Vendor Reliability Table */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" /> Vendor Reliability
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vendorStats.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No vendor data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vendor</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Total Audits</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Avg Match Rate</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Risk Incidents</th>
                      <th className="px-4 py-3 text-center font-medium text-muted-foreground">Reliability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendorStats.map((v, i) => {
                      const rel = v.risk_incidents === 0 ? "Excellent" : v.risk_incidents <= 1 ? "Good" : "At Risk";
                      const relColor = rel === "Excellent" ? "bg-emerald-500/10 text-emerald-500" : rel === "Good" ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500";
                      return (
                        <motion.tr key={v.vendor_name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium">{v.vendor_name}</td>
                          <td className="px-4 py-3 text-center">{v.recent_audits}</td>
                          <td className="px-4 py-3 text-center font-semibold">{v.avg_match_rate}%</td>
                          <td className="px-4 py-3 text-center">{v.risk_incidents}</td>
                          <td className="px-4 py-3 text-center"><Badge variant="secondary" className={relColor}>{rel}</Badge></td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
