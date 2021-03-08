import React, { useRef, useState } from "react"
import { useData } from "../api/auth-provider"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useData()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
        <div className="auth">
                    <div className="auth__container">
                    <h1>Password Reset</h1>
                    {error && <span>{error}</span>}
                    {message && <span >{message}</span>}
                        <form className="auth__form"  onSubmit={handleSubmit} action="">
                            <input type="email" ref={emailRef} required  placeholder="Email:"/>
                            <button className="login-button" disabled={loading} type="submit">Reset Password</button>
                        </form>
                        <Link to="/login">Login</Link>
                        <div className="account">
                            Need an account? <Link to="/signup">Register here</Link>
                        </div>
                        </div>
                </div>
  )
}