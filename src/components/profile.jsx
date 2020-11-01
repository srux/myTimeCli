import React, { useState } from "react"
import {useAuth} from '../api/auth'
import { Link, useHistory } from "react-router-dom"
import Dashboard from './dashboard'

export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <>
        <div className="profile-container">
          <h2 className="text-center mb-4">Profile</h2>
          {error && <span variant="danger">{error}</span>}
          <strong>Email:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </div>
      
      <div className="w-100 text-center mt-2">
      <div className="dashboard__auth">   
        <button className="dashboard__signout" variant="link" onClick={handleLogout}>
          Log Out
        </button>
          </div>
  
        
      </div>
      <Dashboard/>
    </>
  )
}