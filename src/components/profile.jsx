import React, { useState } from "react"
import {useAuth} from '../api/auth'
import { Link, useHistory } from "react-router-dom"
import Dashboard from './dashboard'
import bgImg from '../assets/profile-bg.jpg';


export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const history = useHistory()
  const [profileBg, setBg] = useState("../assets/profile-bg.jpg")
  
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
    <div className="profile" style={{backgroundImage: `url(${profileBg})`}}>
        <div className="profile__container">
          <div className="profile__nav">
            {error && <span>{error}</span>}
            {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
            <button className="dashboard__signout" variant="link" onClick={handleLogout}>
          Log Out
        </button>
          </div>
        </div>
      <Dashboard currentUser={currentUser}/>
      </div>
  )
}