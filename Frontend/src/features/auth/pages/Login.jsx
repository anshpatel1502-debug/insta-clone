import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import "../style/form.scss"
import { useAuth } from '../Hooks/useAuth'

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const { loading, handleLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handleLogin(username, password)
    console.log("User loggedIn")

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
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            onInput={(e) => { setUsername(e.target.value) }}
            type="text"
            name='username'
            id='username'
            placeholder='Enter Your Username' />
          <input
            onInput={(e) => { setPassword(e.target.value) }}
            type="password"
            name='password'
            id='password'
            placeholder='Enter Your Password' />
          <button className='button primary-button'>Login</button>
        </form>
        <p>Dony't have any account <Link to={"/register"}>create one</Link></p>
      </div>
    </main >
  )
}

export default Login