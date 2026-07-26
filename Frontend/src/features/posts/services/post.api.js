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

export async function getFeed(){  

  const response = await api.get("/api/posts/feed") 
  return response.data  

}

export async function createPost(imgURL,caption ){

  const formData = new FormData()
  formData.append("BMW",imgURL)
  formData.append("caption",caption)
  const response = await api.post("/api/posts",formData)
  return response.data

}

export async function likePost(postId){

  const response = await api.post("/api/posts/like/"+postId)
  return response.data

}

export async function unLikePost(postId){

  const response = await api.post("/api/posts/unlike/"+postId)
  return response.data

}