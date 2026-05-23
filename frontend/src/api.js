```javascript id="t4n7k2"
import axios from "axios";

const BACKEND_URL = "https://bagdrop-clean-backend.vercel.app";

export const API = `${BACKEND_URL}/api`;

export const http = axios.create({
  baseURL: API,
  timeout: 15000,
});

export const BookingsAPI = {
  create: async (payload) => {
    const { data } = await http.post("/bookings", payload);
    return data;
  },

  list: async () => {
    const { data } = await http.get("/bookings");
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

  track: async (code) => {
    const { data } = await http.get(`/track/${code}`);
    return data;
  },
};
```
