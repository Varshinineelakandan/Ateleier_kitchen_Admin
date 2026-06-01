// ─── orderService.js ──────────────────────────────────────────────────────
// Centralised API layer using Axios.
// Base URL is read from REACT_APP_API_URL env var (CRA) or VITE_API_URL (Vite).
// ──────────────────────────────────────────────────────────────────────────

import axios from "axios";

const BASE_URL =
  (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor – attach token if present ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor – normalise errors ───────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Network error";
    console.error("[OrderService]", message);
    return Promise.reject(new Error(message));
  }
);

// ── Public API ─────────────────────────────────────────────────────────────
const orderService = {
  /** Fetch all orders */
  getAllOrders: () => api.get("/orders").then((r) => r.data),

  /** Fetch single order by id */
  getOrderById: (id) => api.get(`/orders/${id}`).then((r) => r.data),

  /** Update order status */
  updateOrderStatus: (id, status) =>
    api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),
};

export default orderService;
