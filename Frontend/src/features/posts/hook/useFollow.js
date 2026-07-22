import { useDispatch, useSelector } from "react-redux"
import {
  followUserThunk,
  unFollowUserThunk,
  fetchPendingRequestsThunk,
  acceptRequestThunk,
  rejectRequestThunk
} from "../../../store/slices/postSlice.js"

export const useFollow = () => {
  const dispatch = useDispatch()
  const { pendingRequests, loadingRequests } = useSelector((state) => state.posts)

  const handleFollowUser = async (username) => {
    try {
      await dispatch(followUserThunk(username)).unwrap()
    } catch (err) {
      console.error("Error following user:", err)
    }
  }

  const handleUnFollowUser = async (username) => {
    try {
      await dispatch(unFollowUserThunk(username)).unwrap()
    } catch (err) {
      console.error("Error unfollowing user:", err)
    }
  }

  const fetchPendingRequests = () => {
    dispatch(fetchPendingRequestsThunk())
  }

  const handleAcceptRequest = async (username) => {
    try {
      await dispatch(acceptRequestThunk(username)).unwrap()
    } catch (err) {
      console.error("Error accepting request:", err)
    }
  }

  const handleRejectRequest = async (username) => {
    try {
      await dispatch(rejectRequestThunk(username)).unwrap()
    } catch (err) {
      console.error("Error rejecting request:", err)
    }
  }

  return {
    handleFollowUser,
    handleUnFollowUser,
    fetchPendingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    pendingRequests,
    loadingRequests
  }
}