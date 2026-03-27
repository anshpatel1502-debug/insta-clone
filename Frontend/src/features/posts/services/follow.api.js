import axios from "axios";

const api = axios.create({
  baseURL:"http://localhost:3000",
  withCredentials:true
})

export async function followUser(username){

  const response = await api.post("/api/users/follow/"+username)
  return response.data

}

export async function unFollowUser(username){

  const response = await api.post("/api/users/unfollow/"+username)
  return response.data

}