import { followUser,unFollowUser } from "../services/follow.api"

export const useFollow = () => {

  const handleFollowUser = async (username) => {
    await followUser(username)
  }

  const handleUnFollowUser = async (username) => {
    await unFollowUser(username)
  }


  return {
    handleFollowUser,handleUnFollowUser
  }
}