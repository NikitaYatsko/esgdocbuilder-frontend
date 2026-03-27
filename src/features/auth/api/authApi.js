import axiosInstance from "@/shared/api/axiosInstance";

export const authApi = {
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    logout: () => axiosInstance.post('/auth/logout'),
    refreshToken: () => axiosInstance.post('/auth/refresh'),
    getProfile: () => axiosInstance.get('/profile'),
    getBalance: () => axiosInstance.get('/bank/accounts'),
    getOperations: () => axiosInstance.get('/bank/operations'),
    postOperation: (operationData) => axiosInstance.post('/bank/operations', operationData),

    uploadAvatar: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return axiosInstance.post('/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}