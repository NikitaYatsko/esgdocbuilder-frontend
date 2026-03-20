import axios from "axios";

let isRefreshing = false;
let refreshPromise = null;

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

const axiosInstance = axios.create({
  baseURL: 'https://juristic-zain-unconvened.ngrok-free.dev',
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: 'https://juristic-zain-unconvened.ngrok-free.dev',
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
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
    if (
      originalRequest.url.includes('/auth/refresh') ||
      originalRequest.url.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshClient.post('/auth/refresh')
          .then(res => {
            const { accessToken: newToken } = res.data;
            setAccessToken(newToken);
            return newToken;
          })
          .catch(err => {
            console.log("REFRESH FAILED");
            throw err;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      try {
        const newToken = await refreshPromise;

        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);

      } catch (e) {
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;