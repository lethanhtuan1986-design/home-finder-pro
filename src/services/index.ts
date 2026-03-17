import axios from 'axios';
import { toast } from 'sonner';

// ==================== Constants ====================

export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.xanhstay.vn/api/v1';
export const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || 'https://api.xanhstay.vn';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://xanhstay.vn';

export const ERROR_CODE_SUCCESS = 0;

// ==================== Axios Instance ====================

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export default axiosInstance;

// ==================== Types ====================

export interface ResponseError {
  code: number;
  message: string;
  trace: string | null;
}

export interface ResponseBase<T> {
  error: ResponseError;
  data: T;
}

export interface Pagination {
  totalCount: number;
  totalPage: number;
}

// ==================== Helpers ====================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toastSuccess = (msg: string) => toast.success(msg);
const toastWarn = (msg: string) => toast.warning(msg);
const toastInfo = (msg: string) => toast.info(msg);

export const httpRequest = async ({
  http,
  setLoading,
  msgSuccess,
  showMessageSuccess = false,
  showMessageFailed = false,
}: {
  http: Promise<any>;
  setLoading?: (loading: boolean) => void;
  showMessageSuccess?: boolean;
  showMessageFailed?: boolean;
  msgSuccess?: string;
}) => {
  setLoading?.(true);

  try {
    await delay(500);

    const res: any = await http;

    // Call API thành công
    if (res?.error?.code === ERROR_CODE_SUCCESS) {
      if (showMessageSuccess) {
        toastSuccess(msgSuccess || res?.error?.message || 'Thành công!');
      }

      return res?.data || true;
    } else {
      throw res?.error?.message || 'Thất bại!';
    }
  } catch (err: any) {
    console.error('Lỗi gọi api:', err);

    if (typeof err === 'string') {
      if (showMessageFailed) toastWarn(err || 'Có lỗi đã xảy ra!');
      return;
    }

    if (err?.response?.status === 401) {
      return Promise.reject(err);
    }

    if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED') {
      if (showMessageFailed) toastInfo('Kiểm tra kết nối internet của bạn!');
      return;
    }

    throw err;
  } finally {
    setLoading?.(false);
  }
};

// ==================== Image Helper ====================

export function getImageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${IMAGE_URL}/${path}`;
}

// ==================== Price Helper ====================

export function formatVNPrice(price: number): string {
  if (price >= 1000000) {
    const m = price / 1000000;
    return m % 1 === 0 ? `${m} triệu` : `${m.toFixed(1)} triệu`;
  }
  return price.toLocaleString('vi-VN') + 'đ';
}

// ==================== Server-side fetch for SEO ====================

export async function fetchForSEO<T>(endpoint: string, body: Record<string, unknown>): Promise<ResponseBase<T>> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
