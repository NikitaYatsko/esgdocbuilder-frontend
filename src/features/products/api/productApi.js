import axiosInstance from "@/shared/api/axiosInstance";

export const productApi = {
  getAll: (params) => axiosInstance.get("/products", { params }),
  getAllProducts: (params) => axiosInstance.get("/products/all-products", { params }),
  search: (term) => axiosInstance.get(`/products/search?q=${encodeURIComponent(term)}`),
  getByCategory: (id) => axiosInstance.get(`/products/category/${id}`),
  getByTypeOfUnit: (type) => axiosInstance.get(`/products/type-of-unit/${encodeURIComponent(type)}`),
  getCategories: () => axiosInstance.get("/products/category"),
  getById: (id) => axiosInstance.get(`/products/${id}`),
  update: (id, data) => axiosInstance.put(`/products/${id}`, data),
  create: (data) => axiosInstance.post("/products", data),
  delete: (id) => axiosInstance.delete(`/products/${id}`),
};