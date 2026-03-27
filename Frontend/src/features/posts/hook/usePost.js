import { useContext } from "react";
import { useEffect } from "react";
import { PostContext } from "../Post.context";
import { getFeed, createPost, likePost, unLikePost } from "../services/post.api";

export const usePost = () => {

  const context = useContext(PostContext)
  if (!context) {
    throw new Error("usePost must be used inside PostProvider")
  }
  const { loading, setLoading, feed, setFeed, post, setPost } = context

  const handleGetFeed = async () => {

    setLoading(true)
    const data = await getFeed()
    setFeed(data.posts.reverse())
    setLoading(false)

  }

  const handleCreatePost = async (imgURL, caption) => {

    setLoading(true)
    const data = await createPost(imgURL, caption)
    setFeed(preFeed => [data.post, ...preFeed])
    setLoading(false)

  }

  const handleLikePost = async (postId) => {

    setFeed(preFeed => {
      return preFeed.map(post => {
        return post._id === postId ? { ...post, isLiked: true } : post
      }
      )
    })
    await likePost(postId)
  }

  const handleUnLikePost = async (postId) => {

    setFeed(preFeed => {
      return preFeed.map(post => {
        return post._id === postId ? { ...post, isLiked: false } : post
      }
      )
    })
    await unLikePost(postId)

  }

  useEffect(() => {
    handleGetFeed()
  }, [])

  return {
    loading, feed, post, handleGetFeed, handleCreatePost, handleLikePost, handleUnLikePost
  }
}