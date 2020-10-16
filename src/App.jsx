import './styles/app.css';
import React, { Component } from 'react';
import Clients from './components/clients';

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
    let addClientName = this.state.clientInfo
    let addClient = this.state.clients.concat(addClientName)
    

    this.setState({
        clients:addClient,
        clientInfo:{
          ...this.state.clientInfo,
        }
    })
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


  

  findClient = () => {
        // 1. Make a shallow copy of the items
        let tasks = this.state.data
        let clients = [...this.state.clients];
        let clientName = this.state.data.client
        let findClient = clients.find(c => c.name === clientName);
        // 2. Make a shallow copy of the item you want to mutate
        let client = {...clients[0]};
        // 3. Replace the property you're intested in
        client.tasks = [tasks];
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        clients[0] = client;
        // 5. Set the state to our new copy

        console.log(findClient)

        if ( findClient ) {
          this.setState({
            clients
            });
            console.log('match',client)
        }
        else {
          return
        }
      
  }


  render() {  
  
    let {data,clientInput,clientInfo,clients,timerTime} = this.state

    let {addStatus} = this.state.styling
    let findClient = clients.find(client => client.name === clientInfo.name);

        // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);

    
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
