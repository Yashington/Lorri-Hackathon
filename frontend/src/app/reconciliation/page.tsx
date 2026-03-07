"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reconciliationApi } from "@/lib/api";
import { RISK_COLORS } from "@/lib/constants";
import type { ReconciliationResult } from "@/lib/types";
import {
  ArrowRight, ClipboardList, Search, ArrowUpDown, BarChart3,
  AlertTriangle, CheckCircle2, Filter, Plus,
} from "lucide-react";

type SortField = "date" | "match_rate" | "risk_score";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ReconciliationListPage() {
  const [results, setResults] = useState<ReconciliationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    reconciliationApi.list().then(setResults).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...results];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((r) => r.session_id.toLowerCase().includes(q) || (r.lorry_receipt.vendor_name || "").toLowerCase().includes(q));
    }
    if (riskFilter !== "all") list = list.filter((r) => r.risk_level === riskFilter);
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortField === "match_rate") cmp = a.overall_match_score - b.overall_match_score;
      else if (sortField === "risk_score") cmp = a.risk_score - b.risk_score;
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [results, searchTerm, riskFilter, statusFilter, sortField, sortAsc]);

  const totalAudits = results.length;
  const avgMatchRate = totalAudits > 0 ? (results.reduce((s, r) => s + r.overall_match_score, 0) / totalAudits).toFixed(1) : "0";
  const highRiskCount = results.filter((r) => r.risk_level === "high" || r.risk_level === "critical").length;

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (<div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />))}
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (<div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />))}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">Audit History</span></h1>
          <p className="mt-1 text-muted-foreground">All completed reconciliation sessions</p>
        </div>
        <Link href="/upload">
          <Button className="gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25">
            <Plus className="h-4 w-4" /> New Audit
          </Button>
        </Link>
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Audits", value: totalAudits, icon: BarChart3, gradient: "from-blue-500/10 to-indigo-500/10", color: "text-blue-500" },
          { label: "Avg Match Rate", value: `${avgMatchRate}%`, icon: CheckCircle2, gradient: "from-emerald-500/10 to-teal-500/10", color: "text-emerald-500" },
          { label: "High Risk", value: highRiskCount, icon: AlertTriangle, gradient: "from-red-500/10 to-orange-500/10", color: "text-red-500" },
        ].map((s) => (
          <Card key={s.label} className="border-border/50 shadow-md">
            <CardContent className="flex items-center gap-3 py-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-md">
          <CardContent className="flex flex-wrap items-center gap-3 py-4">
            <div className="group flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 transition-all focus-within:border-primary/50 focus-within:bg-background">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input type="text" placeholder="Search by vendor or session ID..." className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-sm outline-none" value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
            <select className="rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-sm outline-none" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option><option value="flagged">Flagged</option><option value="pending">Pending</option>
            </select>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sort Controls */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 text-xs text-muted-foreground">
        <Filter className="h-3 w-3" />
        <span>{filtered.length} results</span>
        <span className="mx-2">|</span>
        <span>Sort by:</span>
        {(["date", "match_rate", "risk_score"] as SortField[]).map((field) => (
          <motion.button
            key={field}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleSort(field)}
            className={`rounded-lg px-2 py-1 transition-colors ${sortField === field ? "bg-primary/10 font-medium text-primary" : "hover:bg-accent"}`}
          >
            {field === "date" ? "Date" : field === "match_rate" ? "Match Rate" : "Risk Score"}
            {sortField === field && <ArrowUpDown className="ml-1 inline h-3 w-3" />}
          </motion.button>
        ))}
      </motion.div>

      {/* Audit List */}
      {filtered.length === 0 ? (
        <motion.div variants={fadeUp}>
          <Card className="border-border/50 shadow-md">
            <CardContent className="flex flex-col items-center gap-4 py-12">
              <ClipboardList className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">{results.length === 0 ? "No audits yet." : "No audits match your filters."}</p>
              {results.length === 0 && <Link href="/upload" className="text-sm text-primary hover:underline">Run your first audit</Link>}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="overflow-hidden rounded-xl border border-border/50 shadow-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="w-1" />
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Session</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Vendor</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Match Rate</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Risk</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const colors = RISK_COLORS[r.risk_level];
                return (
                  <motion.tr
                    key={r.session_id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 transition-colors hover:bg-muted/20"
                  >
                    <td className="w-1 px-0" style={{ borderLeft: `4px solid ${colors.hex}` }} />
                    <td className="px-4 py-3 font-mono text-xs">{r.session_id.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-medium">{r.lorry_receipt.vendor_name || "Unknown"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold">{r.overall_match_score}%</span>
                        <div className="h-1.5 w-10 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500" style={{ width: `${r.overall_match_score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="secondary" className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                        {r.risk_level.toUpperCase()} ({r.risk_score})
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center"><Badge variant="outline" className="text-xs">{r.status}</Badge></td>
                    <td className="px-4 py-3">
                      <Link href={`/reconciliation/${r.session_id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
