import axiosInstance from "@axios/axiosInstance.js";

export const transactionsApi = {
    getOperations: (params) => axiosInstance.get('/bank/operations', params),
    postOperation:
        (operationData) => axiosInstance.post('/bank/operations', operationData),
    getBalance: () => axiosInstance.get('/bank/accounts'),
    deleteOperation: (id) => axiosInstance.delete(`/bank/operations/${id}`),
    getCategories: () => axiosInstance.get('/bank-categories'),
    getBankPdf: (start, end) => axiosInstance.get(`/pdf/bank?start=${start}&end=${end}`, { responseType: 'blob' }),
}