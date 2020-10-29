import './styles/app.css';
import React, { Component } from 'react';
import Clients from './components/clients';
import firebase from './api/FirebaseConfig';

let styles = {
  jobInfo:{
    paddingTop:'1em'
  },
  close:{
    visibility:'hidden',
  },
  open:{
    visibility:'visible',
  },
  paused:{
    backgroundColor:'#dfdfdf',
    pointerEvents:'none',
    color:'#fff',
  },
  playing:{
    pointerEvents:'initial',
  }
}

class App extends Component {
  constructor(props) {
    super(props)
      this.state = {
        styling:{
          logStatus:styles.close,
          timeStatus:styles.close,
          pauseStatus:styles.playing,
          inputStatus:styles.open,
          addStatus:styles.paused
        },
        clientInfo:{
          name:'',
          id:0,
          tasks:[]
        },
        clients:[],
        jobs:[]
      } 
  }

  handleClientInput = (e) => {
    e.preventDefault();
    let id = Date.now()
    this.setState({
      clientInfo:{
        name:e.target.value,
        tasks:[],
        id
      }
    })
  }

  handleClientAdd = (e) => {
    e.preventDefault();

    let addClientData = this.state.clientInfo
    let addClient = this.state.clients.concat(addClientData)
    let name = this.state.clientInfo.name

    this.setState({
        clients:addClient,
        clientInfo:{
          ...this.state.clientInfo,
        }
        
    })

    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });

    const clientRef = db.collection('clients').doc(name).set(addClientData);

  }

  handleClientSelect = (e) => {
    e.preventDefault();

    this.setState({
      data:{
        ...this.state.data,
        client:e.target.value,
      }
    })
  }


  

  handleClient = (e) => {
    e.preventDefault();
    
    const db = firebase.firestore();
    // db.settings({
    //   timestampsInSnapshots: true
    // });

    const clientRef = db.collection('clients').doc('1betMBnUVBh8GvwRgmYS').set({
      id:444,
      name:'notGubba'
    })
    console.log('clientInfo',clientRef)
  
  }


  render() {  
  
    let {data,clientInput,clientInfo,clients,timerTime} = this.state

    let {addStatus} = this.state.styling
    let findClient = clients.find(client => client.name === clientInfo.name);

        // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
    let handleClient = this.handleClient
    
    return (
      <div className="App">
        <button onClick={handleClient}>FIND</button>
          <header className="header">
            <div className="header_left">
              <div className="logo__header">myTime</div>
              <div className="client__label">
                <input style={null} value={clientInput} onChange={this.handleClientInput}  name='nc' className="client__input" placeholder="New Client..."/>
                <div style={clientInfo.name ==='' || findClient ? addStatus : null } onClick={this.handleClientAdd} className="client__add">ADD</div>
              </div>
            </div>
          </header>
          <div className="dashboard">
          <form className="jobs" action="">

              <div className="clients__container" htmlFor="nj">
                {/* <select style={inputStatus} onClick={this.handleClientSelect}className="newjob__clientselect" name="" id="">
                <option defaultValue="Select Client" >Select Client</option>
                
                </select> */}
                {
                    this.state.clients.map((client) => {
                      let clientProps = {
                        ...client,
                        key:client.id
                      } 
                      return (<Clients {...clientProps}/>) 
                    })
                  }
                
              </div>
              </form>
          </div>
        </div>  
    )
  }
}

export default App;
