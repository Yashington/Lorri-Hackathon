"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileCheck, X } from "lucide-react";

interface FileDropZoneProps {
  label: string;
  shortLabel: string;
  onFileSelect: (file: File) => void;
  accepted?: string;
}

export default function FileDropZone({
  label,
  shortLabel,
  onFileSelect,
  accepted = ".pdf,.png,.jpg,.jpeg",
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) {
        setFile(dropped);
        onFileSelect(dropped);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) {
        setFile(selected);
        onFileSelect(selected);
      }
    },
    [onFileSelect]
  );

  const clearFile = () => setFile(null);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex-1"
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          file
            ? "border-emerald-300 bg-emerald-50"
            : isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-border hover:border-muted-foreground/50 hover:bg-accent/50"
        }`}
      >
        <div className="mb-2 rounded-lg bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {shortLabel}
        </div>

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileCheck className="h-10 w-10 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">{file.name}</p>
            <p className="text-xs text-emerald-700 font-medium">
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <button
              onClick={clearFile}
              className="mt-1 flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">
              Drag PDF here or click to browse
            </p>
            <input
              type="file"
              accept={accepted}
              onChange={handleFileInput}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
