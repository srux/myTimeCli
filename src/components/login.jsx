import React, { useRef, useState } from "react"
import { Link, useHistory,navigate } from "react-router-dom"
import {useAuth} from '../api/auth'
import app from "firebase";

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  
  
  app.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      history.push("/")
      // ...
    }
    // The signed-in user info.
    var user = result.user;
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

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

  async function handleGoogleSignIn(e) {
    e.preventDefault()
      const googleProvider = new app.auth.GoogleAuthProvider();
      app.auth().signInWithRedirect(googleProvider);
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
              <button className="auth_google" onClick={handleGoogleSignIn}>Login with Google</button>
        </form>
        <Link className="forgetpassword" to="/forgot-password">Forgot Password?</Link>
        <div className="account">
            Need an account? <Link to="/signup">Register here</Link>
        </div>
        
      </div>
    </div>
  )
}