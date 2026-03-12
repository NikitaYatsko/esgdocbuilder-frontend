import axios from "axios";

const axiosInstance = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('/api/auth/refresh', { refreshToken });
                
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('email');
                
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        
        if (error.response && error.response.status === 429) { // чисто защита от дудоса
            alert('Превышен лимит запросов. Пожалуйста, попробуйте позже.');
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;