import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router"
import { useFollow } from '../../posts/hook/useFollow'
import FollowRequestsModal from '../../posts/components/FollowRequestsModal'
import "../Nav.scss"

const Nav = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { fetchPendingRequests, pendingRequests } = useFollow()

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  return (
    <nav className="nav-bar">
      <h1 onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>Insta</h1>
      <div className="nav-actions">
        <button
          onClick={() => setIsModalOpen(true)}
          className="button secondary-button request-btn"
        >
          Requests
          {pendingRequests.length > 0 && (
            <span className="badge">{pendingRequests.length}</span>
          )}
        </button>
        <button 
          onClick={() => { navigate("/create-post") }}
          className='button primary-button'
        >
          New Post
        </button>
      </div>
      <FollowRequestsModal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        fetchPendingRequests()
      }} />
    </nav>
  )
}

export default Nav