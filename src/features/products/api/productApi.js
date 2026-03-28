import axiosInstance from "@/shared/api/axiosInstance";

export const productApi = {
  getAll: (params) => axiosInstance.get("/products", {params}),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  update: (id, data) => axiosInstance.put(`/products/${id}`, data),
  create: (data) => axiosInstance.post("/products", data),
  delete: (id) => axiosInstance.delete(`/products/${id}`),
   
};