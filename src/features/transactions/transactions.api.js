import axiosInstance from "@/shared/api/axiosInstance.js";

export const transactionsApi = {
    getOperations: (params) => axiosInstance.get('/bank/operations', params),
    postOperation:
        (operationData) => axiosInstance.post('/bank/operations', operationData),
    getBalance: () => axiosInstance.get('/bank/accounts'),
    deleteOperation: (id) => axiosInstance.delete(`/bank/operations/${id}`),
}