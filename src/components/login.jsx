import React, { useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"

import {useAuth} from '../api/auth'

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <div className="auth">
      <div className="auth__container">
        <h1>Login</h1>
        {error && <span variant="danger">{error}</span>}
        <form className="auth__form"  onSubmit={handleSubmit} action="">
              <input placeholder='Email:' type="email" ref={emailRef}/>
              <input placeholder='Password:' type="password" ref={passwordRef}/>
              <button disabled={loading} className="login-button">Log In</button>
        </form>
        <Link className="forgetpassword" to="/forgot-password">Forgot Password?</Link>
        <div className="account">
            Need an account? <Link to="/signup">Register here</Link>
        </div>
      </div>
    </div>
  )
}