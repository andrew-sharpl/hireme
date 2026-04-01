import axios from "axios";

// Prepends /api to the URL so that accessing /job triggers /api/job for example.
const api = axios.create({
  baseURL: "/api",
});

/* 
Interceptor that runs before every request.
Reads the JWT from localStorage and attaches it to the Auth header
so that every API call is authenticated automatically. 
Similar concept to AuthContext, simplifying authentication.
*/
api.interceptors.request.use((config) => {
  // Reads from local storage since it is not a react component that inherits auth context
  const stored = localStorage.getItem("hireme_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
