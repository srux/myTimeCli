import React, { Component } from 'react';
import Clients from './clients';

//api
import {setRate,addClient} from '../api/data'

//plugins
import { RiTimer2Fill } from "react-icons/ri";

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
          globalRate:'',
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
    setRate(globalRate,setGlobalRate).then(() => {
      console.log('Rate $'+globalRate+' Set' )

    }).catch((error)=>{
       alert("Error setting rate: ", error);
    })
  }

  handleResetGlobalRate = (e) => {
    e.preventDefault();
    
    this.setState({
      settings:{
        globalRate:'',
        setGlobalRate:false
      }
    })
    
    setTimeout(() =>{
      let {globalRate,setGlobalRate} = this.state.settings
      setRate(globalRate,setGlobalRate).then(() => {
        console.log('Global rate reset' )
  
      }).catch((error)=>{
         alert("Error resetting rate: ", error);
      })
    },300)

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
  
    this.setState({
        ...clients,
        clientInfo:{
          ...this.state.clientInfo,
        }
    })

    addClient(data,client).then(() => {
      console.log("Client", client, "Created");
    })
    .catch((error) => {
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
          
              <div className="header__settings">
                  <div className="header__logo">myTime</div>
                  <div className="header__settings-toggle" onClick={this.handleToggle} value={'settingsToggle'} ><RiTimer2Fill style={{pointerEvents:'none'}}/></div>

                  { settingsToggle ? <div className="header__settings-popup"></div> : null }

                 
              </div>
             
              <div className="header__clientlabel">
                <input style={null} value={clientInfo.name} onChange={this.handleClientInput}  name='nc' className="client__input" placeholder="New Client..."/>
                <div style={clientInfo.name ==='' || findClient ? addStatus : null } onClick={this.handleClientAdd} className="client__add theme-button">ADD</div>

              </div>
            </div>
            {this.props.settings.map((setting,i) => 
            <div key={i} className="header__rate">
                    <div className="header__dollar">$</div>
                    <input
                        value={setting.setGlobalRate ? setting.globalRate : globalRate }
                        onChange={this.handleGlobalRateInput}
                        placeholder={'Hourly Rate'}
                        type="number"/>                   
                      { setting.setGlobalRate ?  <div className="header__rateset theme--button" onClick={this.handleResetGlobalRate}>CLEAR</div>  : <div className="header__rateset theme--button" onClick={this.handleSetGlobalRate}>SET</div> }
              </div>   )}
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
