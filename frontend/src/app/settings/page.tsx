"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { usePreferencesStore } from "@/lib/store";
import {
  Sun, Moon, Monitor, Wifi, WifiOff, Brain, Globe, Bell, BellOff,
  FileText, Download, Trash2, RefreshCw, Shield, Database,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [apiHealth, setApiHealth] = useState<"loading" | "ok" | "error">("loading");
  const [apiVersion, setApiVersion] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  const {
    defaultExportFormat, showOnboarding, notificationsEnabled, defaultTimeRange,
    updatePreference,
  } = usePreferencesStore();

  useEffect(() => {
    axios.get(`${apiUrl}/health`, { timeout: 5000 })
      .then((res) => { setApiHealth("ok"); setApiVersion(res.data.version || "1.0.0"); })
      .catch(() => setApiHealth("error"));
  }, [apiUrl]);

  const retryConnection = () => {
    setApiHealth("loading");
    axios.get(`${apiUrl}/health`, { timeout: 5000 })
      .then((res) => { setApiHealth("ok"); setApiVersion(res.data.version || "1.0.0"); toast.success("Connected successfully!"); })
      .catch(() => { setApiHealth("error"); toast.error("Connection failed"); });
  };

  const themes = [
    { value: "light", label: "Light", icon: Sun, desc: "Clean and bright" },
    { value: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes" },
    { value: "system", label: "System", icon: Monitor, desc: "Match your OS" },
  ];

  const exportFormats = [
    { value: "csv", label: "CSV" },
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" },
  ];

  const timeRanges = [
    { value: "week", label: "1 Week" },
    { value: "month", label: "1 Month" },
    { value: "quarter", label: "3 Months" },
    { value: "year", label: "1 Year" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-3xl space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">Settings</span></h1>
        <p className="mt-1 text-muted-foreground">Application configuration and preferences</p>
      </motion.div>

      {/* Theme */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="h-5 w-5 text-amber-500" /> Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <motion.button
                  key={t.value}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    theme === t.value
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-transparent bg-muted/30 hover:bg-muted/50"
                  }`}
                >
                  <t.icon className={`h-6 w-6 ${theme === t.value ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${theme === t.value ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
                  <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-indigo-500" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive alerts for high-risk audits and completed reviews</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  updatePreference("notificationsEnabled", !notificationsEnabled);
                  toast.success(notificationsEnabled ? "Notifications disabled" : "Notifications enabled");
                }}
                className={`relative h-7 w-12 rounded-full transition-colors ${notificationsEnabled ? "bg-primary" : "bg-muted"}`}
              >
                <motion.div
                  animate={{ x: notificationsEnabled ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="h-5 w-5 rounded-full bg-white shadow-md"
                />
              </motion.button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Welcome Screen</p>
                <p className="text-xs text-muted-foreground">Show the splash animation on app launch</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updatePreference("showOnboarding", !showOnboarding)}
                className={`relative h-7 w-12 rounded-full transition-colors ${showOnboarding ? "bg-primary" : "bg-muted"}`}
              >
                <motion.div
                  animate={{ x: showOnboarding ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="h-5 w-5 rounded-full bg-white shadow-md"
                />
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export & Data */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5 text-emerald-500" /> Export & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Default Export Format</p>
              <div className="flex gap-2">
                {exportFormats.map((f) => (
                  <motion.button
                    key={f.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updatePreference("defaultExportFormat", f.value as "csv" | "pdf" | "excel")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      defaultExportFormat === f.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {f.label}
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Default Time Range</p>
              <div className="flex gap-2">
                {timeRanges.map((r) => (
                  <motion.button
                    key={r.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updatePreference("defaultTimeRange", r.value as "week" | "month" | "quarter" | "year")}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      defaultTimeRange === r.value
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {r.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Status */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-blue-500" /> API Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {apiHealth === "ok" ? (
                  <div className="relative">
                    <Wifi className="h-5 w-5 text-emerald-500" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                ) : apiHealth === "error" ? (
                  <WifiOff className="h-5 w-5 text-red-500" />
                ) : (
                  <Wifi className="h-5 w-5 animate-pulse text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">Backend Status</p>
                  <p className="text-xs text-muted-foreground font-mono">{apiUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={
                  apiHealth === "ok" ? "bg-emerald-500/10 text-emerald-500" :
                  apiHealth === "error" ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"
                }>
                  {apiHealth === "ok" ? "Connected" : apiHealth === "error" ? "Disconnected" : "Checking..."}
                </Badge>
                {apiHealth === "error" && (
                  <Button size="sm" variant="outline" onClick={retryConnection} className="gap-1">
                    <RefreshCw className="h-3 w-3" /> Retry
                  </Button>
                )}
              </div>
            </div>
            {apiVersion && (
              <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-2">
                <span className="text-sm text-muted-foreground">API Version</span>
                <span className="font-mono text-sm font-semibold">{apiVersion}</span>
              </div>
            )}
            {apiHealth === "error" && (
              <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-3 text-sm text-red-500">
                Cannot connect to the backend. Make sure the FastAPI server is running at{" "}
                <code className="rounded bg-red-500/10 px-1.5 py-0.5 font-mono text-xs">{apiUrl}</code>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-orange-500" /> Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Data Retention</p>
                <p className="text-xs text-muted-foreground">Audit data is stored in-memory (demo mode)</p>
              </div>
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">Demo</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">Encryption</p>
                <p className="text-xs text-muted-foreground">All API calls use HTTPS in production</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">GSTIN Validation</p>
                <p className="text-xs text-muted-foreground">Automatic GSTIN format verification on documents</p>
              </div>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-500" /> About ReconAI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              ReconAI is an Agentic Document Intelligence platform for 3-way logistics
              matching. It automates the reconciliation between Lorry Receipts (LR),
              Proof of Delivery (POD), and Invoices using AI-powered document extraction,
              intelligent field comparison, and real-time risk scoring.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Frontend", value: "Next.js 16 + Tailwind CSS", icon: Globe },
                { label: "Backend", value: "FastAPI + Python", icon: Database },
                { label: "AI Engine", value: "Azure Doc Intelligence", icon: Brain },
                { label: "Risk Engine", value: "Custom scoring algo", icon: Shield },
              ].map((item) => (
                <motion.div key={item.label} whileHover={{ y: -1 }} className="rounded-xl bg-muted/30 border border-border/50 p-3">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                    <p className="font-medium">{item.label}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
