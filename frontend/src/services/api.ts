import axios from "axios";

const BASE_URL = window.location.hostname === "localhost"
  ? "http://localhost:8001/api"
  : `http://${window.location.hostname}:8001/api`;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data: { email: string; password: string; full_name: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post<{ access_token: string }>("/auth/login", data),
};

export const childrenAPI = {
  list: () => api.get("/children/"),
  create: (data: { name: string; birth_year: number; avatar?: string }) =>
    api.post("/children/", data),
  delete: (id: number) => api.delete(`/children/${id}`),
};

export const gamesAPI = {
  list: (cycle?: string) =>
    api.get("/games/", { params: cycle ? { cycle } : {} }),
  get: (id: number) => api.get(`/games/${id}`),
  saveProgress: (gameId: number, childId: number, data: { score: number; completed: boolean; time_spent_seconds: number }) =>
    api.post(`/games/${gameId}/progress/${childId}`, data),
  getProgress: (childId: number) =>
    api.get(`/games/progress/${childId}`),
};

export default api;
