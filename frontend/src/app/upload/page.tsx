"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FileDropZone from "@/components/upload/FileDropZone";
import ProcessingAnimation from "@/components/upload/ProcessingAnimation";
import { reconciliationApi, documentApi } from "@/lib/api";
import type { DocumentType } from "@/lib/types";
import { Sparkles, Upload, FileText, CheckCircle2 } from "lucide-react";

type UploadedFiles = {
  lorry_receipt: File | null;
  proof_of_delivery: File | null;
  invoice: File | null;
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<UploadedFiles>({
    lorry_receipt: null,
    proof_of_delivery: null,
    invoice: null,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (docType: DocumentType, file: File) => {
    setFiles((prev) => ({ ...prev, [docType]: file }));
    setError(null);
  };

  const handleDemoRun = async () => {
    setProcessing(true);
    setError(null);
    try {
      const result = await reconciliationApi.demo();
      await new Promise((r) => setTimeout(r, 3000));
      router.push(`/reconciliation/${result.session_id}`);
    } catch (err) {
      setError("Failed to run demo. Is the backend running?");
      setProcessing(false);
    }
  };

  const handleUploadAndReconcile = async () => {
    if (!files.lorry_receipt || !files.proof_of_delivery || !files.invoice) {
      setError("Please upload all three documents.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const [lr, pod, inv] = await Promise.all([
        documentApi.upload(files.lorry_receipt, "lorry_receipt"),
        documentApi.upload(files.proof_of_delivery, "proof_of_delivery"),
        documentApi.upload(files.invoice, "invoice"),
      ]);
      const result = await reconciliationApi.run(lr.document_id, pod.document_id, inv.document_id);
      router.push(`/reconciliation/${result.session_id}`);
    } catch (err) {
      setError("Upload or reconciliation failed. Check the backend.");
      setProcessing(false);
    }
  };

  if (processing) {
    return (
      <div className="mx-auto max-w-2xl">
        <ProcessingAnimation />
      </div>
    );
  }

  const allFilesUploaded = files.lorry_receipt && files.proof_of_delivery && files.invoice;
  const uploadedCount = [files.lorry_receipt, files.proof_of_delivery, files.invoice].filter(Boolean).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-5xl space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight"><span className="gradient-text">New 3-Way Audit</span></h1>
        <p className="mt-1 text-muted-foreground">Upload Lorry Receipt, Proof of Delivery, and Invoice for automated reconciliation</p>
      </motion.div>

      {/* Step indicator */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 text-sm">
        {[
          { num: 1, label: "Upload Documents", done: uploadedCount === 3 },
          { num: 2, label: "AI Extraction", done: false },
          { num: 3, label: "Results", done: false },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center gap-2">
            {i > 0 && <div className="h-px w-8 bg-border" />}
            <motion.div
              animate={s.done ? { scale: [1, 1.1, 1] } : {}}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                s.done
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                  : s.num === 1
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s.done ? <CheckCircle2 className="h-4 w-4" /> : s.num}
            </motion.div>
            <span className={s.num === 1 || s.done ? "font-medium" : "text-muted-foreground"}>{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Upload slots */}
      <motion.div variants={fadeUp}>
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Upload Documents
              {uploadedCount > 0 && (
                <Badge className="ml-2 bg-primary/10 text-primary border-0">{uploadedCount}/3 uploaded</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <FileDropZone label="Lorry Receipt" shortLabel="LR" onFileSelect={(f) => handleFileSelect("lorry_receipt", f)} />
              <FileDropZone label="Proof of Delivery" shortLabel="POD" onFileSelect={(f) => handleFileSelect("proof_of_delivery", f)} />
              <FileDropZone label="Invoice" shortLabel="INV" onFileSelect={(f) => handleFileSelect("invoice", f)} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-500">
          {error}
        </motion.div>
      )}

      {/* Actions */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <Button variant="outline" onClick={handleDemoRun} className="gap-2 rounded-xl">
          <Sparkles className="h-4 w-4" />
          Use Sample Documents (Demo)
        </Button>
        <Button
          onClick={handleUploadAndReconcile}
          disabled={!allFilesUploaded}
          className="gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:shadow-none"
        >
          <Upload className="h-4 w-4" />
          Start Reconciliation
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Badge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`} {...props}>{children}</span>;
}
