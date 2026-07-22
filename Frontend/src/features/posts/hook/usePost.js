import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchFeed,
  createPostThunk,
  likePostThunk,
  unLikePostThunk
} from "../../../store/slices/postSlice";

export const usePost = () => {
  const dispatch = useDispatch()
  const { feed, loading } = useSelector((state) => state.posts)

  const handleGetFeed = () => {
    dispatch(fetchFeed())
  }

  const handleCreatePost = async (imgURL, caption) => {
    await dispatch(createPostThunk({ imgURL, caption })).unwrap()
  }

  const handleLikePost = async (postId) => {
    dispatch(likePostThunk(postId))
  }

  const handleUnLikePost = async (postId) => {
    dispatch(unLikePostThunk(postId))
  }

  useEffect(() => {
    handleGetFeed()
  }, [])

  return {
    loading, feed, handleGetFeed, handleCreatePost, handleLikePost, handleUnLikePost
  }
}