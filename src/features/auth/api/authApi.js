import axiosInstance from "@/shared/api/axiosInstance";

export const authApi = {
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    logout: () => axiosInstance.post('/auth/logout'),
    refreshToken: () => axiosInstance.post('/auth/refresh'),
    getProfile: () => axiosInstance.get('/profile'),
}