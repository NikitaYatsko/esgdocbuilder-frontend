import axios from "axios";

let isRefreshing = false;
let refreshPromise = null;
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

const baseURL = import.meta.env.DEV
  ? '/api'
  : 'https://cors-anywhere.herokuapp.com/https://esg-docbuilder-production-1693.up.railway.app';

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});


refreshClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

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
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/logout')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshClient.post('/auth/refresh')
          .then(res => {
            const newToken = res.data.accessToken || res.data.token;
            if (!newToken) throw new Error('No token received');
            setAccessToken(newToken);
            return newToken;
          })
          .catch(err => {
            setAccessToken(null);
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
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;