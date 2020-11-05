import React, { useContext, useState, useEffect } from "react"
import {useAuth} from '../api/auth'

import { Link, useHistory } from "react-router-dom"
import Dashboard from './dashboard'
import bgImg from '../assets/profile-bg.jpg';
import app from "../firebase";
import {getData,queryData,setData} from "../api/data";


export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth()
  const [profileBg, setBg] = useState("../assets/profile-bg.jpg")

  const history = useHistory()
  const db = app.firestore();
  const userUid = currentUser.uid

  const [data, setData] = useState([]);
  const [settings, setSettings] = useState([]);

  useEffect(() => { 
          const updateData = db.collection('users').doc(userUid).collection('clients').onSnapshot(snap => {
          const data = snap.docs.map(doc => doc.data())
          setData(data)
        });
        //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
        return () => updateData()
  }, []);

      useEffect(() => { 
        const updateSettings= db.collection('users').doc(userUid).collection('settings').onSnapshot(snap => {
        const settings = snap.docs.map(doc => doc.data())
        setSettings(settings)
      });
      //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
      return () => updateSettings()
    }, []);
  


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
            <span className="profile__email">{currentUser.email}</span>
            <Link to="/update-profile" className="profile__update">
              Update Profile
            </Link>
            <button className="dashboard__signout" variant="link" onClick={handleLogout}>
          Log Out
        </button>
          </div>
        </div>
      <Dashboard currentUser={currentUser} data={data} settings={settings} />
      </div>
  )
}