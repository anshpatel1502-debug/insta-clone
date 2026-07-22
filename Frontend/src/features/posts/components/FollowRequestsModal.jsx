import React, { useEffect } from "react"
import { useFollow } from "../hook/useFollow"
import "../style/FollowRequestsModal.scss"

const FollowRequestsModal = ({ isOpen, onClose }) => {
  const {
    fetchPendingRequests,
    handleAcceptRequest,
    handleRejectRequest,
    pendingRequests,
    loadingRequests
  } = useFollow()

  useEffect(() => {
    if (isOpen) {
      fetchPendingRequests()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glassmorphic" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Follow Requests</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {loadingRequests ? (
            <div className="loading-spinner">Loading requests...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="empty-state">No follow requests pending</div>
          ) : (
            <div className="requests-list">
              {pendingRequests.map((req) => (
                <div key={req._id} className="request-card">
                  <div className="user-info">
                    <img
                      src={req.follower?.profileImage || "https://picsum.photos/150"}
                      alt={req.follower?.username}
                      className="avatar"
                    />
                    <div className="user-details">
                      <span className="username">@{req.follower?.username}</span>
                      {req.follower?.bio && <span className="bio">{req.follower.bio}</span>}
                    </div>
                  </div>
                  <div className="actions">
                    <button
                      className="btn-accept"
                      onClick={() => handleAcceptRequest(req.follower?.username)}
                    >
                      Confirm
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleRejectRequest(req.follower?.username)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowRequestsModal
