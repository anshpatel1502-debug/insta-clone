import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

export async function login(username, password) {
  const response = await api.post("/api/auth/login", {
    username,
    password
  })

  if (response?.data?.token) {
    localStorage.setItem("token", response.data.token)
  }

  return response.data
}

export async function register(username, email, password) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password
  })

  if (response?.data?.token) {
    localStorage.setItem("token", response.data.token)
  }

  return response.data
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me")

  return response.data
} 