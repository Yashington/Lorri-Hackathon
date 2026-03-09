import axios from "axios";
import type {
  ReconciliationResult,
  DashboardStats,
  UploadResponse,
  DocumentType,
  VendorProfile,
  FraudReport,
  AuditAction,
  AuditComment,
  BatchAudit,
  SearchFilters,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://reconai-backend.vercel.app",
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

// Vendor APIs
export const vendorApi = {
  getProfile: (vendorGstin: string) =>
    api.get<VendorProfile>(`/vendors/${vendorGstin}`).then((r) => r.data),
  list: () =>
    api.get<VendorProfile[]>("/vendors").then((r) => r.data),
  getRiskProfiles: () =>
    api.get<VendorProfile[]>("/vendors/risk-profiles").then((r) => r.data),
};

// Fraud Detection APIs
export const fraudApi = {
  getReport: () => api.get<FraudReport>("/fraud/report").then((r) => r.data),
  flagAudit: (sessionId: string, reason: string) =>
    api.post(`/fraud/flag/${sessionId}`, { reason }).then((r) => r.data),
  getSuspiciousAudits: () =>
    api.get<ReconciliationResult[]>("/fraud/suspicious").then((r) => r.data),
};

// Audit Trail APIs
export const auditTrailApi = {
  getActions: (auditId: string) =>
    api.get<AuditAction[]>(`/audits/${auditId}/actions`).then((r) => r.data),
  addComment: (auditId: string, comment: string, isInternal: boolean) =>
    api
      .post<AuditComment>(`/audits/${auditId}/comments`, { comment, isInternal })
      .then((r) => r.data),
  getComments: (auditId: string) =>
    api.get<AuditComment[]>(`/audits/${auditId}/comments`).then((r) => r.data),
  recordAction: (auditId: string, action: Partial<AuditAction>) =>
    api.post(`/audits/${auditId}/actions`, action).then((r) => r.data),
};

// Search & Filter APIs
export const searchApi = {
  search: (query: string, filters?: SearchFilters) =>
    api
      .get<ReconciliationResult[]>("/search", {
        params: { q: query, ...filters },
      })
      .then((r) => r.data),
  getFiltered: (filters: SearchFilters) =>
    api.get<ReconciliationResult[]>("/audits", { params: filters }).then((r) => r.data),
};

// Export APIs
export const exportApi = {
  exportPdf: (auditId: string) =>
    api.get(`/export/pdf/${auditId}`, { responseType: "blob" }).then((r) => r.data),
  exportCsv: (filters?: SearchFilters) =>
    api.get("/export/csv", { params: filters, responseType: "blob" }).then((r) => r.data),
  getShareableLink: (auditId: string) =>
    api.post<{ link: string }>(`/export/share/${auditId}`).then((r) => r.data),
};

// Batch Processing APIs
export const batchApi = {
  uploadBatch: (files: FormData) =>
    api.post<BatchAudit>("/batch/upload", files).then((r) => r.data),
  getBatchStatus: (batchId: string) =>
    api.get<BatchAudit>(`/batch/${batchId}`).then((r) => r.data),
  listBatches: () =>
    api.get<BatchAudit[]>("/batch").then((r) => r.data),
};

export default api;
