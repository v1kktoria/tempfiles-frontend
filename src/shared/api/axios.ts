import { store } from "../../store/store";
import { loginSuccess, logout } from "../../store/slices/authSlice";
import { refreshTokensApi } from "../../api/authApi";
import { api } from "./axiosInstance";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];
let interceptorsSetUp = false;
let errorToastShown = false;
let globalNavigate: NavigateFunction;

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

export const setupInterceptors = (navigate: NavigateFunction) => {
  if (interceptorsSetUp) return;
  interceptorsSetUp = true;
  globalNavigate = navigate;

  api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.data?.message === "User is banned") {
      toast.error("Your account has been banned. Please contact the administrator.");
      store.dispatch(logout());
      globalNavigate("/login");

      return Promise.reject(err);
    }

    if (errorToastShown) {
      return Promise.reject(err);
    }

    if (err.response?.status !== 401 || originalRequest._retry || originalRequest.url?.includes("/auth/refresh")) {
      errorToastShown = true;
      toast.error(err.response?.data?.message || "Server error");

      setTimeout(() => {
        errorToastShown = false;
      }, 2000);

      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await refreshTokensApi();
      const newToken = data.accessToken;

      store.dispatch(loginSuccess(newToken));

      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      processQueue(null, newToken);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      store.dispatch(logout());
      toast.error((refreshError as Error)?.message || "Session expired. Please log in again.");
      globalNavigate("/login");

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
