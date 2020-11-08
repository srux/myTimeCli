import React, { useRef, useState } from "react"
import { useData } from "../api/provider"
import { Link, useHistory } from "react-router-dom"

export default function UpdateProfile() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser, updatePassword, updateEmail } = useData()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setError("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        history.push("/")
      })
      .catch(() => {
        setError("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
        
        <div className="auth">
            <div className="auth__container">
                <h1>Update Profile</h1>
                {error &&
                <span>{error}</span>}
                <form className="auth__form" onSubmit={handleSubmit} action="">
                    <input
                        type="email"
                        ref={emailRef}
                        required="required"
                        defaultValue={currentUser.email}
                        placeholder="Email:"/>
                    <input
                        type="password"
                        ref={passwordRef}
                        placeholder="Leave blank to keep the same"/>
                    <input
                        type="password"
                        ref={passwordConfirmRef}
                        placeholder="Leave blank to keep the same"/>
                    <button className="login-button" disabled={loading} value='Update' type="submit">Update</button>
                </form>
                <Link to="/">Cancel</Link>
            </div>
        </div>
                
  )
}