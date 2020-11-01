import React, { Component } from 'react'
import './styles/app.css';

// plugins
import {BrowserRouter as Router, Route,Link } from "react-router-dom";

// components
import Dashboard from './components/dashboard';
import Signup from './components/signup';
import Login from './components/login';
// import {AuthProvider} from './api/auth';

class App extends Component {
  constructor(props) {
    super(props)
      this.state = {
        signedIn:false,
      }
  }

  handleSignIn = () => {
    this.setState({
        signedIn:true
    })
}

handleSignOut = () => {

  this.setState({
      signedIn:false
  })
}

  render() {
    let {signedIn} = this.state;
    return (
  
        <Router>
             <div className="dashboard__auth">   
          { signedIn ? <Link to="/" className="dashboard__signout" onClick={this.handleSignOut} >Sign Out</Link> : <> <Link className="dashboard__signin" onClick={this.handleSignIn}>Sign In</Link> <Link  to="/Signup" className="dashboard__signin" onClick={this.handleSignIn}>Register</Link></> }   
         </div>
          <div>
            { signedIn ? <Route exact path='/' component={Dashboard}/> : null }
            
            <Route exact path='/login' component={Login}/>
            <Route exact path='/Signup' component={Signup}/>
          </div>
        </Router>

    )
  }
}


export default App