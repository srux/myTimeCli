import './styles/app.css';
import React, { Component } from 'react';
import Clients from './components/clients';
import firebase from './config/FirebaseConfig';

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

const clientsRef = firebase.firestore().collection("clients");

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


  componentDidMount() {
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection("clients").get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({
        clients:data
      })
    });
    
  }

  componentDidUpdate(){
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    db.collection("clients")
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({
        clients:data
      })
    });
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



  render() {  
  
    let {clientInput,clientInfo,clients} = this.state

    let {addStatus} = this.state.styling
    let findClient = clients.find(client => client.name === clientInfo.name);

    
    return (
      <div className="App">
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
