import React from 'react'
import { useNavigate } from "react-router"
import "../Nav.scss"

const Nav = () => {

  const navigate = useNavigate()

  return (
    <nav className="nav-bar">
      <h1>Insta</h1>
      <button 
      onClick={()=>{navigate("/create-post")}}
      className='button primary-button'>New Post</button>
    </nav>
  )
}

export default Nav