import axios from "axios";

const BACKEND_URL = "https://bagdrop-clean-backend.vercel.app";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

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

  track: async (code) => {
    const response = await API.get(`/track/${code}`);
    return response.data;
  },
};

export default API;
