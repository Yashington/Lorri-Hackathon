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
import { generateAuditCSV, downloadCSV } from "@/lib/computed";
import type { ReconciliationResult } from "@/lib/types";
import {
  ArrowLeft, FileText, Clock, Download, Share2, Printer,
  GitCompare, Package, Code2, LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type Tab = "overview" | "comparison" | "lineitems" | "rawdata";

const fadeUp = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ReconciliationDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [result, setResult] = useState<ReconciliationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!sessionId) return;
    reconciliationApi.get(sessionId).then(setResult).catch(() => setError("Failed to load reconciliation result.")).finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-muted" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (<div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />))}
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <p className="text-red-500">{error || "Result not found."}</p>
        <Link href="/dashboard"><Button className="mt-4 gap-2"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Button></Link>
      </motion.div>
    );
  }

  const riskColors = RISK_COLORS[result.risk_level];

  const handleExportCSV = () => { const csv = generateAuditCSV(result); downloadCSV(csv, `audit-${result.session_id}.csv`); toast.success("CSV exported!"); };
  const handlePrint = () => window.print();

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "comparison", label: "Field Comparison", icon: GitCompare },
    { id: "lineitems", label: "Line Items", icon: Package },
    { id: "rawdata", label: "Raw Data", icon: Code2 },
  ];

  return (
    <motion.div initial="hidden" animate="show" className="space-y-6 print:space-y-4">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/reconciliation" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground print:hidden">
            <ArrowLeft className="h-3 w-3" /> Back to Audit History
          </Link>
          <h1 className="text-2xl font-bold md:text-3xl"><span className="gradient-text">Audit Report</span></h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(result.created_at).toLocaleString()}</span>
            <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{result.lorry_receipt.vendor_name || "Unknown Vendor"}</span>
            <Badge variant="outline">{result.status.toUpperCase()}</Badge>
            <code className="rounded-lg bg-muted px-2 py-1 text-xs font-mono">{result.session_id.slice(0, 12)}</code>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={handleExportCSV}><Download className="h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={handlePrint}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex gap-1 overflow-x-auto rounded-xl border border-border/50 bg-muted/30 p-1 print:hidden">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="tab-active" className="absolute inset-0 rounded-lg bg-background shadow-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center gap-2"><tab.icon className="h-4 w-4" />{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Overview Tab */}
      {(activeTab === "overview" || typeof window === "undefined") && (
        <>
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="border-border/50 shadow-lg">
              <CardContent className="flex items-center justify-center p-6"><RiskGauge score={result.risk_score} /></CardContent>
            </Card>
            <Card className="border-border/50 shadow-lg">
              <CardContent className="flex items-center justify-center p-6"><MatchRateProgressCircle matchRate={result.overall_match_score} /></CardContent>
            </Card>
            <Card className="border-border/50 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 shadow-lg">
              <CardContent className="space-y-3 p-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Fields Analyzed</p>
                  <p className="text-3xl font-bold">{result.total_fields_compared}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-emerald-500">Matched:</span><span className="font-medium">{result.fields_matched}</span></div>
                  <div className="flex justify-between"><span className="text-red-500">Mismatched:</span><span className="font-medium">{result.fields_mismatched}</span></div>
                  {result.fields_missing > 0 && <div className="flex justify-between"><span className="text-amber-500">Missing:</span><span className="font-medium">{result.fields_missing}</span></div>}
                </div>
              </CardContent>
            </Card>
            <Card className={`border-border/50 shadow-lg ${riskColors.bg}`}>
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Recommendation</p>
                  <p className={`text-sm font-medium leading-relaxed ${riskColors.text}`}>{result.recommendation}</p>
                </div>
                <div className="mt-4"><Badge className={`${riskColors.bg} ${riskColors.text} border-0`}>{result.risk_level.toUpperCase()}</Badge></div>
              </CardContent>
            </Card>
          </motion.div>

          <DiscrepancyTimeline discrepancies={result.discrepancy_summary} createdAt={result.created_at} />

          <Card className="border-border/50 shadow-lg">
            <CardHeader><CardTitle className="text-lg">Document Extraction Confidence</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  { doc: result.lorry_receipt, label: "Lorry Receipt", gradient: "from-blue-500 to-indigo-500" },
                  { doc: result.proof_of_delivery, label: "Proof of Delivery", gradient: "from-purple-500 to-pink-500" },
                  { doc: result.invoice, label: "Invoice", gradient: "from-emerald-500 to-teal-500" },
                ].map(({ doc, label, gradient }) => (
                  <div key={label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="font-semibold">{Math.round(doc.confidence_score * 100)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${doc.confidence_score * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { doc: result.lorry_receipt, label: "Lorry Receipt" },
              { doc: result.proof_of_delivery, label: "Proof of Delivery" },
              { doc: result.invoice, label: "Invoice" },
            ].map(({ doc, label }) => (
              <motion.div key={label} whileHover={{ y: -2 }}>
                <Card className="h-full border-border/50 shadow-md transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm"><FileText className="h-4 w-4 text-primary" />{label}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs text-muted-foreground">
                    <div className="grid grid-cols-2 gap-2">
                      {doc.document_number && <div><p className="font-semibold text-foreground">Doc #</p><p className="truncate">{doc.document_number}</p></div>}
                      {doc.date && <div><p className="font-semibold text-foreground">Date</p><p>{doc.date}</p></div>}
                      {doc.total_amount !== undefined && <div><p className="font-semibold text-foreground">Amount</p><p>{typeof doc.total_amount === "number" ? `Rs ${doc.total_amount.toFixed(2)}` : doc.total_amount}</p></div>}
                      {doc.total_weight !== undefined && <div><p className="font-semibold text-foreground">Weight</p><p>{doc.total_weight} kg</p></div>}
                    </div>
                    {doc.vehicle_number && (
                      <div className="border-t border-border/50 pt-2">
                        <p className="font-semibold text-foreground">Vehicle</p><p className="font-mono">{doc.vehicle_number}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Field Comparison Tab */}
      {activeTab === "comparison" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Enhanced3WayCompare fieldComparisons={result.field_comparisons} />
        </motion.div>
      )}

      {/* Line Items Tab */}
      {activeTab === "lineitems" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/50 shadow-lg">
            <CardHeader><CardTitle className="text-lg">Line Items Comparison</CardTitle></CardHeader>
            <CardContent>
              {result.line_item_matches.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No line items to compare</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">LR Qty</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">POD Qty</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">Invoice Qty</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">LR Amt</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">POD Amt</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">Invoice Amt</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">Qty</th>
                        <th className="px-4 py-3 text-center font-medium text-muted-foreground">Amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.line_item_matches.map((item, idx) => (
                        <motion.tr key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-medium">{item.lr_item?.description || "—"}</td>
                          <td className="px-4 py-3 text-center font-mono">{item.lr_item?.quantity ?? "—"}</td>
                          <td className="px-4 py-3 text-center font-mono">{item.pod_item?.quantity ?? "—"}</td>
                          <td className="px-4 py-3 text-center font-mono">{item.invoice_item?.quantity ?? "—"}</td>
                          <td className="px-4 py-3 text-center font-mono">{item.lr_item?.amount != null ? `₹${item.lr_item.amount.toLocaleString()}` : "—"}</td>
                          <td className="px-4 py-3 text-center font-mono">{item.pod_item?.amount != null ? `₹${item.pod_item.amount.toLocaleString()}` : "—"}</td>
                          <td className="px-4 py-3 text-center font-mono">{item.invoice_item?.amount != null ? `₹${item.invoice_item.amount.toLocaleString()}` : "—"}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className={item.quantity_match ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-red-500/30 bg-red-500/10 text-red-500"}>
                              {item.quantity_match ? "✓" : "✗"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className={item.amount_match ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-red-500/30 bg-red-500/10 text-red-500"}>
                              {item.amount_match ? "✓" : "✗"}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Raw Data Tab */}
      {activeTab === "rawdata" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {[
            { label: "Lorry Receipt", doc: result.lorry_receipt },
            { label: "Proof of Delivery", doc: result.proof_of_delivery },
            { label: "Invoice", doc: result.invoice },
          ].map(({ label, doc }) => (
            <Card key={label} className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Code2 className="h-4 w-4" /> {label} - Extracted Text
                  <Badge variant="secondary" className="ml-auto">Confidence: {Math.round(doc.confidence_score * 100)}%</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {doc.raw_text ? (
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-muted/50 p-4 font-mono text-xs leading-relaxed">{doc.raw_text}</pre>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">No raw text available for this document</p>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
