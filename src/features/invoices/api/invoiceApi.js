import axiosInstance from "@/shared/api/axiosInstance";

export const invoiceApi = {
    getAll: (params) => axiosInstance.get("/api/invoices", { params }),
    getById: (id) => axiosInstance.get(`/api/invoices/${id}`),
    update: (id, data) => axiosInstance.put(`/api/invoices/${id}`, data),
    create: (data) => axiosInstance.post("/api/invoices", data),
    delete: (id) => axiosInstance.delete(`/api/invoices/${id}`),

    getItems: (invoiceId) => axiosInstance.get(`/api/invoices/${invoiceId}/items`),
    addItem: (invoiceId, data) => axiosInstance.post(`/api/invoices/${invoiceId}/items`, data),
    updateItem: (invoiceId, itemId, data) => axiosInstance.put(`/api/invoices/${invoiceId}/items/${itemId}`, data),
    deleteItem: (invoiceId, itemId) => axiosInstance.delete(`/api/invoices/${invoiceId}/items/${itemId}`),

    downloadPdf: (id) => axiosInstance.get(`/api/invoices/${id}/pdf`, { responseType: 'blob' }),
};