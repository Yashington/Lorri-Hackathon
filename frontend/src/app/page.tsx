"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  FileSearch,
  GitCompare,
  ShieldCheck,
  Upload,
  Cpu,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

const features = [
  {
    icon: FileSearch,
    title: "AI Document Extraction",
    description:
      "Powered by Azure Document Intelligence to extract structured data from Lorry Receipts, Proof of Delivery, and Invoices with high confidence.",
    gradient: "from-blue-500 to-cyan-500",
    glow: "group-hover:shadow-blue-500/25",
  },
  {
    icon: GitCompare,
    title: "3-Way Reconciliation",
    description:
      "Automated field-by-field and line-item comparison across all three documents with deviation tracking and tolerance thresholds.",
    gradient: "from-purple-500 to-pink-500",
    glow: "group-hover:shadow-purple-500/25",
  },
  {
    icon: ShieldCheck,
    title: "Risk & Fraud Detection",
    description:
      "Intelligent risk scoring engine that flags discrepancies, detects GSTIN mismatches, and provides actionable recommendations.",
    gradient: "from-emerald-500 to-teal-500",
    glow: "group-hover:shadow-emerald-500/25",
  },
];

const steps = [
  { step: 1, icon: Upload, title: "Upload Documents", description: "Upload your Lorry Receipt, Proof of Delivery, and Invoice (PDF/image)", color: "from-blue-500 to-indigo-500" },
  { step: 2, icon: Cpu, title: "AI Processes", description: "Our AI extracts data, reconciles fields, and calculates risk scores", color: "from-purple-500 to-pink-500" },
  { step: 3, icon: BarChart3, title: "Get Results", description: "View detailed comparison, risk assessment, and export audit reports", color: "from-emerald-500 to-teal-500" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  const [stats, setStats] = useState<{
    total_audits: number;
    average_match_rate: number;
    auto_approved: number;
  } | null>(null);

  useEffect(() => {
    dashboardApi.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-16 pb-12"
    >
      {/* Hero Section */}
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl px-8 py-16 text-center md:px-16 md:py-20"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #581c87 100%)",
        }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 shadow-2xl shadow-indigo-500/30"
          >
            <Brain className="h-8 w-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-3 text-4xl font-extrabold tracking-tight text-white md:text-6xl"
          >
            Recon<span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-lg font-medium text-indigo-200 md:text-xl"
          >
            Agentic Document Intelligence for 3-Way Logistics Matching
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mb-8 max-w-xl text-sm text-indigo-300/70"
          >
            Automate reconciliation between Lorry Receipts, Proof of Delivery, and Invoices using AI-powered extraction, intelligent matching, and real-time risk scoring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/upload">
              <Button
                size="lg"
                className="gap-2 rounded-xl bg-white px-8 font-semibold text-indigo-700 shadow-xl shadow-white/10 hover:bg-indigo-50 hover:shadow-white/20"
              >
                <Upload className="h-4 w-4" />
                Start New Audit
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 rounded-xl border-white/20 px-8 text-white hover:bg-white/10"
              >
                View Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Live Stats */}
      {stats && stats.total_audits > 0 && (
        <motion.section variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Audits Processed", value: stats.total_audits, suffix: "", icon: Zap, gradient: "from-blue-500/10 to-indigo-500/10" },
            { label: "Avg Match Rate", value: stats.average_match_rate, suffix: "%", decimals: 1, icon: BarChart3, gradient: "from-emerald-500/10 to-teal-500/10" },
            { label: "Auto-Approved", value: stats.auto_approved, suffix: "", icon: CheckCircle2, gradient: "from-purple-500/10 to-pink-500/10" },
          ].map((stat) => (
            <motion.div key={stat.label} whileHover={{ y: -2 }}>
              <Card className="border-border/50 bg-gradient-to-br shadow-lg transition-shadow hover:shadow-xl">
                <CardContent className="flex items-center gap-4 py-5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient}`}>
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      )}

      {/* Features */}
      <motion.section variants={fadeUp}>
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Intelligent Document Reconciliation
          </h2>
          <p className="mt-2 text-muted-foreground">
            End-to-end automation for logistics document matching and audit
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className={`group h-full border-border/50 shadow-lg transition-all hover:shadow-xl ${feature.glow}`}>
                <CardContent className="p-6">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section variants={fadeUp}>
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How It Works</h2>
          <p className="mt-2 text-muted-foreground">Three simple steps to automated document reconciliation</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              whileHover={{ y: -4 }}
              className="relative text-center"
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg`}>
                <s.icon className="h-7 w-7 text-white" />
              </div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                Step {s.step}
              </div>
              <h3 className="mb-1 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.description}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-8 hidden h-5 w-5 text-muted-foreground/30 md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section variants={fadeUp} className="text-center">
        <Card className="border-border/50 shadow-lg">
          <CardContent className="py-8">
            <h3 className="mb-4 text-lg font-semibold">Built With</h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                "Azure Document Intelligence",
                "FastAPI",
                "Next.js",
                "AI-Powered Risk Engine",
                "Real-time Analytics",
              ].map((tech) => (
                <motion.span
                  key={tech}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {tech}
                </motion.span>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.div>
  );
}
