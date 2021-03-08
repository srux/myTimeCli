import React, { useState, useReducer } from 'react'
import './styles/app.css';

// plugins
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";

// components
import Profile from './components/profile';
import Signup from './components/signup';
import Login from './components/login';
import UpdateProfile from './components/updateprofile';
import ForgotPassword from './components/forgotpassword';
import {AuthProvider} from './api/auth-provider';
import {DataProvider} from './api/data-provider';
import PrivateRoute from './components/privateRoute';

const App = () => {
  const [signedIn,setSignIn] = useState(false)
  //hooks 
  
  return (
    <AuthProvider>
    <Router>
      <Switch>       
          <DataProvider exact path='/'>
            <PrivateRoute component={Profile}/>
          </DataProvider>
          <PrivateRoute path="/update-profile" component={UpdateProfile} />
          <Route exact path='/login' component={Login}/>
          <Route exact path='/Signup' component={Signup}/>
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </Router>
  </AuthProvider>
  );
}

export default App;




// class App extends Component {
//   constructor(props) {
//     super(props)
//       this.state = {
//         signedIn:false,
//       }
//   }

  
//   render() {
//     return (
//       <AuthProvider>
//         <Router>
//           <Switch>
//               {UserDashboard}   
//               <PrivateRoute path="/update-profile" component={UpdateProfile} />
//               <Route exact path='/login' component={Login}/>
//               <Route exact path='/Signup' component={Signup}/>
//               <Route path="/forgot-password" component={ForgotPassword} />
//             </Switch>
//           </Router>
//       </AuthProvider>
//     )
//   }
// }


// export default App