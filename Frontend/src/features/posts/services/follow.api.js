import axios from "axios";

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

export async function followUser(username){

  const response = await api.post("/api/users/follow/"+username)
  return response.data

}

export async function unFollowUser(username){

  const response = await api.post("/api/users/unfollow/"+username)
  return response.data

}

export async function acceptFollowRequest(username){

  const response = await api.post("/api/users/follow/acceptRequest/"+username)
  return response.data

}

export async function rejectFollowRequest(username){

  const response = await api.post("/api/users/follow/rejectRequest/"+username)
  return response.data

}

export async function getPendingFollowRequests(){

  const response = await api.get("/api/users/follow/requests")
  return response.data

}