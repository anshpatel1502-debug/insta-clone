import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import Nav from '../../shared/components/Nav'
import { usePost } from '../hook/usePost'

const Feed = () => {

  const { feed,loading,handleGetFeed,handleLikePost,handleUnLikePost } = usePost()

  useEffect(()=>{
    handleGetFeed()
  },[])

  if(loading || !feed){
    return(
      <main>
        <h1>Feed is loading...</h1>
      </main>
    )
  }

  console.log(feed)

  return (
    <main>
        <Nav />
      <div className="feed">
        <div className="posts">
          {feed.map(post=>{
            return <Post 
            
            key={post._id}
            user={post.user} 
            post={post} 
            loading={loading} 
            handleLikePost={handleLikePost} 
            handleUnLikePost={handleUnLikePost}  />
          })}
        </div>
      </div>
    </main>
  )
}

export default Feed