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
import { Sparkles, Upload, FileText } from "lucide-react";

type UploadedFiles = {
  lorry_receipt: File | null;
  proof_of_delivery: File | null;
  invoice: File | null;
};

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
      // Artificial delay for animation impact
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
      const result = await reconciliationApi.run(
        lr.document_id,
        pod.document_id,
        inv.document_id
      );
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

  const allFilesUploaded =
    files.lorry_receipt && files.proof_of_delivery && files.invoice;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold">New 3-Way Audit</h1>
        <p className="text-muted-foreground">
          Upload Lorry Receipt, Proof of Delivery, and Invoice for automated
          reconciliation
        </p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            1
          </div>
          <span className="font-medium">Upload Documents</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            2
          </div>
          <span className="text-muted-foreground">AI Extraction</span>
        </div>
        <div className="h-px w-12 bg-border" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
            3
          </div>
          <span className="text-muted-foreground">Results</span>
        </div>
      </div>

      {/* Upload slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <FileDropZone
              label="Lorry Receipt"
              shortLabel="LR"
              onFileSelect={(f) => handleFileSelect("lorry_receipt", f)}
            />
            <FileDropZone
              label="Proof of Delivery"
              shortLabel="POD"
              onFileSelect={(f) => handleFileSelect("proof_of_delivery", f)}
            />
            <FileDropZone
              label="Invoice"
              shortLabel="INV"
              onFileSelect={(f) => handleFileSelect("invoice", f)}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleDemoRun}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Use Sample Documents (Demo)
        </Button>

        <Button
          onClick={handleUploadAndReconcile}
          disabled={!allFilesUploaded}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Start Reconciliation
        </Button>
      </div>
    </div>
  );
}
