import axios from "axios";
import type {
  ReconciliationResult,
  DashboardStats,
  UploadResponse,
  DocumentType,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  timeout: 30000,
});

export const reconciliationApi = {
  demo: () => api.post<ReconciliationResult>("/demo/run").then((r) => r.data),
  run: (lrId: string, podId: string, invoiceId: string) =>
    api
      .post<ReconciliationResult>("/reconcile", {
        lr_id: lrId,
        pod_id: podId,
        invoice_id: invoiceId,
      })
      .then((r) => r.data),
  get: (sessionId: string) =>
    api.get<ReconciliationResult>(`/reconcile/${sessionId}`).then((r) => r.data),
  list: () => api.get<ReconciliationResult[]>("/reconcile").then((r) => r.data),
};

export const dashboardApi = {
  stats: () => api.get<DashboardStats>("/dashboard/stats").then((r) => r.data),
};

export const documentApi = {
  upload: (file: File, docType: DocumentType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_type", docType);
    return api
      .post<UploadResponse>("/documents/upload", formData)
      .then((r) => r.data);
  },
};

export default api;
