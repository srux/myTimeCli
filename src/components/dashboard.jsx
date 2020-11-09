import React, { Component } from 'react';
import Clients from './clients';

// import app from '../appConfig';
import app from "../firebase";

//plugins
import { RiListSettingsFill } from "react-icons/ri";

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

class Dashboard extends Component {
  constructor(props) {
    super(props)
      this.state = {
        settingsToggle:false,
        settings:{
          setGlobalRate:false,
          globalRate:null,
        },
        styling:{
          logStatus:styles.close,
          timeStatus:styles.close,
          pauseStatus:styles.playing,
          inputStatus:styles.open,
          addStatus:styles.paused
        },
        clientInfo:{
          id:0,
          name:'',
          options:{
            clientColor:'#fff'
          },
        },
        clients:[],
      
      } 
  }

  handleGlobalRateInput = (e) => {
    e.preventDefault();
    let globalRate = e.target.value
    this.setState({
      settings:{
        globalRate:parseInt(globalRate),
        setGlobalRate:true,
      }
    })
  }

  handleSetGlobalRate = (e) => {
    e.preventDefault();
    let {globalRate,setGlobalRate} = this.state.settings
    let {currentUser} = this.props
    let db = app.firestore();
    let userUid = currentUser.uid

    db.collection('users').doc(userUid).collection('settings').doc('rates').set({globalRate,setGlobalRate})
    
  }

  handleResetGlobalRate = (e) => {
    e.preventDefault();
    
    let {currentUser} = this.props
    let db = app.firestore();
    let userUid = currentUser.uid

    this.setState({
      settings:{
        globalRate:''
      }
    })

    let settings = {globalRate:0,setGlobalRate:false}
    db.collection('users').doc(userUid).collection('settings').doc('rates').set({...settings});
    
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
        archivedJobs:[],
        id
      }
    })
  }

  handleClientAdd = (e) => {
    e.preventDefault();

    let data = this.state.clientInfo
    let client = this.state.clientInfo.name
    let clients = this.state.clients;
    let db = app.firestore();
    let {currentUser} = this.props
    let userUid = currentUser.uid
  
    this.setState({
        ...clients,
        clientInfo:{
          ...this.state.clientInfo,
        }
    })

 
    db.settings({
      timestampsInSnapshots: true
    });
    
  
    
    db.collection('users').doc(userUid).collection('clients').doc(client).set({...data})
    .then(function() {
      
      console.log("Client", client, "Added");
    })
    .catch(function(error) {
        alert("Error adding document: ", error);
    });
    
    setTimeout(() => {
      this.setState({
        clientInfo:{
          id:0,
          name:'',
          options:{
            clientColor:'#fff'
          },
          jobs:[],
          archivedJobs:[]   
        },
      })
    },300)
  }

  handleToggle=(e)=>{
    e.preventDefault()
    let target = e.target.getAttribute('value');
   
    this.setState(state  => ({
      [target]: !this.state[target]
    }));
    console.log(target)
   }


  render() {  
  
    let {clientInfo,settingsToggle} = this.state
    let {globalRate} = this.state.settings
    let {addStatus} = this.state.styling
    let clientsProps = this.props.data
    let findClient = clientsProps.find(client => client.name === clientInfo.name);

    return (
        <>
      <div className="dashboard"> 
          <header className="header">
            <div className="header__left">
            {this.props.settings.map((setting,i) => 
              <div key={i} className="header__settings">
                  <div className="header__logo">myTime</div>
                  <div className="header__settings-toggle" onClick={this.handleToggle} value={'settingsToggle'} ><RiListSettingsFill style={{pointerEvents:'none'}}/></div>
                  { settingsToggle ? <div className="header__settings-popup"><div className="header__dollar">$</div>
                   <input value={setting.setGlobalRate ? setting.globalRate : globalRate } onChange={this.handleGlobalRateInput} placeholder={'My Rate'} type="number"/>{ setting.setGlobalRate ?  <div className="header__rateset theme--button" onClick={this.handleResetGlobalRate}>CLEAR</div>  : <div className="header__rateset theme--button" onClick={this.handleSetGlobalRate}>SET</div> }</div> : null }
              </div>
                )}
              <div className="header__clientlabel">
                <input style={null} value={clientInfo.name} onChange={this.handleClientInput}  name='nc' className="client__input" placeholder="New Client..."/>
                <div style={clientInfo.name ==='' || findClient ? addStatus : null } onClick={this.handleClientAdd} className="client__add theme-button">ADD</div>

              </div>
            </div>
          </header>
          <div className="clients">
                {
                    this.props.data.map((client) => {
                      let clientProps = {
                        ...client,
                        key:client.id
                      } 
                      return (<Clients {...clientProps} settings={this.props.settings}/>) 
                    })
                  }
          </div>
        </div>  
        </>
    )
  }
}

export default Dashboard;
