import React, { Component } from 'react';
import Clients from './clients';

// import app from '../appConfig';
import app from "../firebase";


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

// const clientsRef = app.firestore().collection("clients");

class Dashboard extends Component {
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
          colour:'',
          id:0,
          options:{
            clientColor:'#fff'
          },
        },
        clients:[],
      
      } 
  }


  componentDidMount() {
    const db = app.firestore();

    const {currentUser} = this.props
    const userUid = currentUser.uid
   
    // let clientRef = db.collection('users').doc(userUid);

    db.settings({
      timestampsInSnapshots: true
    });
    db.collection('users').doc(userUid).collection('clients').get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      this.setState({
        clients:data
      })
    });
  
    // db.collection('users').doc(userUid).collection('clients').doc(name).set({...data});
    
  }

  componentDidUpdate(){
    const db = app.firestore();

    const {currentUser} = this.props
    const userUid = currentUser.uid
   


    db.settings({
      timestampsInSnapshots: true
    });
    db.collection('users').doc(userUid).collection('clients').get()
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
    let clientInfo = this.state.clientInfo
    this.setState({
      clientInfo:{
        ...clientInfo,
        name:e.target.value,
        jobs:[],
        id
      }
    })
  }

  handleClientAdd = (e,user) => {
    e.preventDefault();

    let data = this.state.clientInfo
    let name = this.state.clientInfo.name
    let clients = this.state.clients;
    this.setState({
        ...clients,
        clientInfo:{
          ...this.state.clientInfo,
        }
    })

    let db = app.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    
    const {currentUser} = this.props
    const userUid = currentUser.uid
    
    db.collection('users').doc(userUid).collection('clients').doc(name).set({...data});
    
    setTimeout(() => {
      this.setState({
        clientInfo:{
          name:'',
          colour:'',
          id:0,
          options:{
            clientColor:'#fff'
          },
          jobs:[]
        },
      })
    },300)
  }


  render() {  
  
    let {clientInfo,clients} = this.state

    let {addStatus} = this.state.styling
    let findClient = clients.find(client => client.name === clientInfo.name);
    let currentUser = this.props
    return (
        <>
      <div className="dashboard">
       
          <header className="header">
            <div className="header_left">
              <div className="logo__header">myTime</div>
              <div className="client__label">
                <input style={null} value={clientInfo.name} onChange={this.handleClientInput}  name='nc' className="client__input" placeholder="New Client..."/>
                <div style={clientInfo.name ==='' || findClient ? addStatus : null } onClick={this.handleClientAdd} className="client__add">ADD</div>
              </div>
            </div>
          </header>
          <div className="dashboard__clients">
          <form className="jobs" action="">

              <div className="clients__container" htmlFor="nj">

                {
                    this.state.clients.map((client) => {
                      let clientProps = {
                        ...client,
                        key:client.id
                      } 
                      return (<Clients {...clientProps} currentUser={currentUser}/>) 
                    })
                  }
                
              </div>
              </form>
          </div>
        </div>  
        </>
    )
  }
}

export default Dashboard;
