import React, { Component } from 'react'
import './styles/app.css';

// plugins
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";

// components
import Profile from './components/profile';
import Signup from './components/signup';
import Login from './components/login';
import UpdateProfile from './components/updateprofile';
import ForgotPassword from './components/forgotpassword';
import {DataProvider} from './api/provider';
import PrivateRoute from './components/privateRoute';


class App extends Component {
  constructor(props) {
    super(props)
      this.state = {
        signedIn:false,
      }
  }

  render() {
    return (
      <DataProvider>
        <Router>
          <Switch>
            <div>
              <PrivateRoute exact path='/' component={Profile}/>
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <Route exact path='/login' component={Login}/>
              <Route exact path='/Signup' component={Signup}/>
              <Route path="/forgot-password" component={ForgotPassword} />
            </div>
            </Switch>
          </Router>
      </DataProvider>
    )
  }
}


export default App