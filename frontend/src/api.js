import axios from "axios";

// Auto-detect backend URL
const BACKEND_URL = "https://bagdrop-clean-backend.vercel.app/";

export const API = `${BACKEND_URL}/api`;

// Persist a stable client_id per browser
export function getClientId() {
  let id = localStorage.getItem("bagdrop_client_id");

  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    localStorage.setItem("bagdrop_client_id", id);
  }

  return id;
}

export const http = axios.create({
  baseURL: API,
  timeout: 15000,
});

export const BookingsAPI = {
  list: async () => {
    const { data } = await http.get("/bookings", {
      params: { client_id: getClientId() },
    });

    return data;
  },

  create: async (payload) => {
    const { data } = await http.post("/bookings", {
      ...payload,
      client_id: getClientId(),
    });

    return data;
  },

  get: async (id) => {
    const { data } = await http.get(`/bookings/${id}`);
    return data;
  },

  cancel: async (id) => {
    const { data } = await http.delete(`/bookings/${id}`);
    return data;
  },

  updateStatus: async (id, body) => {
    const { data } = await http.patch(
      `/bookings/${id}/status`,
      body
    );

    return data;
  },

  track: async (code) => {
    const { data } = await http.get(`/track/${code}`);
    return data;
  },
};

