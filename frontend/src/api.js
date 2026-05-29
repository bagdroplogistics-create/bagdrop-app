import axios from "axios";

const BACKEND_URL = "https://bagdrop-clean-backend.vercel.app";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const TOKEN_KEY = "bagdrop_token";
const USER_KEY = "bagdrop_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}
export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
export function setStoredUser(u) {
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
}

// Stable client id (also used pre-auth as fallback for bookings)
export function getClientId() {
  const user = getStoredUser();
  if (user?.id) return user.id;
  let id = localStorage.getItem("bagdrop_client_id");
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("bagdrop_client_id", id);
  }
  return id;
}

export const http = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const t = getToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export const AuthAPI = {
  requestOtp: async (phone) => (await http.post("/auth/request-otp", { phone })).data,
  verifyOtp: async (phone, code, name) => (await http.post("/auth/verify-otp", { phone, code, name })).data,
  me: async () => (await http.get("/auth/me")).data,
  logout: async () => (await http.post("/auth/logout")).data,
  updateProfile: async (body) => (await http.patch("/auth/profile", body)).data,
};
                                                   

export const BookingsAPI = {
  create: async (payload) => {
    const response = await API.post("/bookings", payload);
    return response.data;
  },

  list: async () => {
    const response = await API.get("/bookings");
    return response.data;
  },

  get: async (id) => {
    const response = await API.get(`/bookings/${id}`);
    return response.data;
  },

  updateStatus: async (id, body) => {
    const { data } = await API.patch(`/bookings/${id}/status`, body);
    return data;
  },

  track: async (code) => {
    const response = await API.get(`/track/${code}`);
    return response.data;
  },

 cancel: async (id) => {
   const response = await API.delete(
    `/bookings/${id}`
   );
  return response.data;
},


};

export default API;
