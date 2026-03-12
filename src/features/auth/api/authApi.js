import axiosInstance from "@/shared/api/axiosInstance";

const mockLogin = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email === 'test@test.com' && credentials.password === 'password123') {
        resolve({
          data: {
            accessToken: 'mock-jwt-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            user: {
              id: 1,
              email: credentials.email,
              name: 'Test User'
            }
          }
        });
      } else {
        reject({
          response: {
            status: 401,
            data: { message: 'Неверный email или пароль' }
          }
        });
      }
    }, 1000);
  });
};

export const authApi = {
    login: (credentials) => {
        // используем заглушку
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return mockLogin(credentials);
        }
        return axiosInstance.post('/auth/login', credentials);
    }, 
    logout: () => axiosInstance.post('/auth/logout'), // так же отправит пост запрос, но для выхода из аккаунта
    refreshToken: () => axiosInstance.post('/auth/refresh'), // нужен для обнавления токена
}