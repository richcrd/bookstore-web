import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE } from "../../app/config";
import { tokenProvider } from "../auth/tokenProvider";
import { HttpError } from "./HttpError";

export const httpClient = axios.create({ baseURL: API_BASE });

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = tokenProvider.getAccessToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ title?: string; detail?: string }>) => {
    const status = error.response?.status ?? 0;
    const message = error.response?.data?.title ?? error.response?.data?.detail ?? error.message;
    if (status === 401) tokenProvider.triggerUnauthorized();
    return Promise.reject(new HttpError(status, message));
  },
);
