
import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
  apiKey: "AIzaSyCuA3XLTwBkecfYSEoD-ighxWkBCa3cMV8",
  authDomain: "mytimecli.firebaseapp.com",
  databaseURL: "https://mytimecli-default-rtdb.firebaseio.com",
  projectId: "mytimecli",
  storageBucket: "mytimecli.appspot.com",
  messagingSenderId: "857728615291",
  appId: "1:857728615291:web:d79b8ad269bd6e7410f3de",
  measurementId: "G-RDM6XQKC1E"
})

export const auth = app.auth()
export default app