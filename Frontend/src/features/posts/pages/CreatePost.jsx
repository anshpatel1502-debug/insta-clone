import React, { useState, useRef } from 'react'
import "../style/createPost.scss"
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'

const createPost = () => {

  const [caption, setCaption] = useState("")
  const postImageInputFileRef = useRef(null)
  const navigate = useNavigate()

  const { loading, handleCreatePost } = usePost()


  async function handleSubmit(e) {
    e.preventDefault()

    const file = postImageInputFileRef.current.files[0]
     if (!file) {
        alert("Please select an image")
        return
      }
    await handleCreatePost(file, caption)

    navigate("/")
  }

  if (loading) {
    return (
      <main>
        <h1>creating post...</h1>
      </main>
    )
  }

  return (
    <main>
      <div className="form-container">
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit}>
          <label className='post-image-label' htmlFor="postImage">select image</label>
          <input ref={postImageInputFileRef} hidden type="file" name='postImage' id='postImage' />
          <input
            value={caption}
            onChange={(e) => { setCaption(e.target.value) }}
            type="text" name='caption' id='caption' placeholder='Enter caption' />
          <button className='button primary-button'>create post</button>
        </form>
      </div>
    </main>
  )
}

export default createPost