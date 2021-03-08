import React, { useContext, useState, useEffect } from "react"

// firebase api
import app from "../firebase";
import {auth} from "../firebase";

const AuthContext = React.createContext()

export function useData() {
    return useContext (AuthContext)
}

export function AuthProvider({ children }) {
    const db = app.firestore();


    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)

      function signup(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
      }
    
      function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
      }
    
      function logout() {
        return auth.signOut()
      }
    
      function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
      }
    
      function updateEmail(email) {
        return currentUser.updateEmail(email)
      }
    
      function updatePassword(password) {
        return currentUser.updatePassword(password)
      }
      

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          setCurrentUser(user)
          setLoading(false)
        
        })
    
        return unsubscribe
      }, [])


      const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
      }

      
    
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
    
    
}

