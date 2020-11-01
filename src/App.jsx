import React, { Component } from 'react'
import './styles/app.css';

// plugins
import {BrowserRouter as Router, Route,Link } from "react-router-dom";

// components
import Profile from './components/profile';
import Signup from './components/signup';
import Login from './components/login';
import {AuthProvider} from './api/auth';
import PrivateRoute from './components/privateRoute';
import { auth } from './firebase';


class App extends Component {
  constructor(props) {
    super(props)
      this.state = {
        signedIn:false,
      }
  }

  render() {
    return (
      <AuthProvider>
          <Router>
            <div>
              <PrivateRoute exact path='/' component={Profile}/>
              <Route exact path='/login' component={Login}/>
              <Route exact path='/Signup' component={Signup}/>
            </div>
          </Router>
      </AuthProvider>
    )
  }
}


export default App