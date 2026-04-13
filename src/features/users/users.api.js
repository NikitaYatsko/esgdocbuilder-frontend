import axiosInstance from "@/shared/api/axiosInstance";

export const usersApi = {
    getAllUsers: () => axiosInstance.get('/users'),
    createUser: (userData) => axiosInstance.post('/users/create', userData),
    deleteUser: (email) => axiosInstance.delete(`/users/${email}`),
    getAllRoles: () => axiosInstance.get('/roles'),
}