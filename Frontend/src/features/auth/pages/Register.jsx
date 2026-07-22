import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
                
  const { loading, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleRegister(username, email, password)
    console.log("User registered")
    navigate("/")
  }

  if (loading) {
    return (
      <main>
        <h1>Loading..</h1>
      </main>
    )
  }
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => { setUsername(e.target.value) }}
            type="text"
            name='username'
            id='username'
            placeholder='Enter Your Username' />
          <input
            onInput={(e) => { setEmail(e.target.value) }}
            type="text"
            name='email'
            id='email'
            placeholder='Enter Your Email' />
          <input
            onInput={(e) => { setPassword(e.target.value) }}
            type="password"
            name='password'
            id='password'
            placeholder='Enter Your Password' />
          <button className='button primary-button'>Register</button>
        </form>
        <p>Already have any account <Link to={"/login"}>Login to account</Link></p>
      </div>
    </main>
  )
}

export default Register
