import axiosInstance from "@/shared/api/axiosInstance";

export const authApi = {
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    logout: () => axiosInstance.post('/auth/logout'),
    refreshToken: () => axiosInstance.post('/auth/refresh'),
    getProfile: () => axiosInstance.get('/profile'),
    updateProfile: (data) => axiosInstance.put('/profile/data', data),
    getAllUsers: () => axiosInstance.get('/users'),
    createUser: (userData) => axiosInstance.post('/users/create', userData),
    deleteUser: (email) => axiosInstance.delete(`/users/${email}`),
    getBalance: () => axiosInstance.get('/bank/accounts'),
    getOperations: (params) => axiosInstance.get('/bank/operations', params),
    postOperation: (operationData) => axiosInstance.post('/bank/operations', operationData),
    getAllRoles: () => axiosInstance.get('/roles'),

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