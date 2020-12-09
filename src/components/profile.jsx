import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"

//api
import {useData} from '../api/provider'


//plugins
import { RiImageLine } from "react-icons/ri";

import Dashboard from './dashboard'

//bg images
// import bgImg from '../assets/profile-bg.jpg';
// import bgImg1 from '../assets/profile-bg-1.png';
// import bgImg2 from '../assets/profile-bg-2.jpg';
// import bgImg3 from '../assets/profile-bg-3.png';
// import bgImg4 from '../assets/profile-bg-4.png';
// import bgImg5 from '../assets/profile-bg-5.png';
// import bgImg6 from '../assets/profile-bg-6.png';
import bgImg7 from '../assets/profile-bg-7.png';
import app from "../firebase";


export default function Profile() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useData()
  // const [profileBg, setBg] = useState("../assets/profile-bg.jpg")

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
    <div className="profile" style={{backgroundImage: `url(${bgImg7})`, backgroundSize:'cover',filter:'blur'}}>
     
        <div className="profile__container">
          <div className="profile__nav">
            {error && <span>{error}</span>}
            {/* <div className="profile__bg"><RiImageLine/></div> */}
            <span className="profile__email">{currentUser.email}</span>
            <Link to="/update-profile" className="profile__update">
              Update Profile
            </Link>
            <button className="dashboard__signout" variant="link" onClick={handleLogout}>
          Log Out
        </button>
          </div>
        </div>
        {/* <h1 className="mobv">Mobile Version Coming Soon..</h1> */}
      <Dashboard currentUser={currentUser} data={data} settings={settings} />
      </div>
  )
}