import './styles/app.css';
import React, { Component } from 'react';
import Timer from 'react-compound-timer';
import Job from './components/job';
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
        timerOn: false,
        timerStart: 0,
        timerTime: 0,
        styling:{
          logStatus:styles.close,
          timeStatus:styles.close,
          pauseStatus:styles.playing,
          inputStatus:styles.open,
          addStatus:styles.paused
        },
        data:{
          client:'',
          task:'',
          startTime:'',
          logTime:'',
          id:0,
          pauseTime:'',
          timer:'',
          pauses:[],
          resumes:[],
          tasks:[],
        },
        clientInfo:{
          name:'',
          id:0,
        },
        clients:[],
        jobs:[]
      } 
  }

  startTimer = () => {
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    }, 10);

    let newStart = new Date().toLocaleTimeString();
    let id = Date.now();

      this.setState ({
        data: {
          ...this.state.data,
          startTime:newStart,
          id
        },
        styling: {
          ...this.state.styling,
          logStatus:styles.open,
          timeStatus:styles.open,
          inputStatus:styles.close
        },

      });
  };

  stopTimer = () => {
    this.setState({ timerOn: false });
    clearInterval(this.timer);

    let newLog = new Date().toLocaleTimeString();
    let addtask = this.state.data
    let addJob = this.state.jobs.concat(addtask);
    
    let currentClient = this.state.clientInfo.name
    
      

    this.setState(prevState => ({
      [currentClient]: {                   // object that we want to update
          ...prevState.currentClient,    // keep all other key-value pairs
          tasks: 'something'       // update the value of specific key
      }
  }))

    // this.setState(prevState => ({
    //   clients: {
    //     ...prevState.clients,           // copy all other key-value pairs of food object
    //     [currentClient]: {                     // specific object of food object
    //       ...prevState.clients.tasks,   // copy all pizza key-value pairs
    //       tasks: [addtask]          // update value of specific key
    //     }
    //   }
    //  }))

    this.setState ({
      timerStart: 0,
      timerTime: 0,
      data: {
        logTime:newLog,
        ...this.state.data,
      
      },
      slash:'',
      jobs:addJob,

      styling: {
        ...this.state.styling,
        inputStatus:styles.open,
        logStatus:styles.close,
        timeStatus:styles.close,
        pauseStatus:styles.playing
      },
    });
    setTimeout(()=> {
      this.setState ({
        data: {
          pauseTime:'',
          resumeTime:'',
          client:'',
          task:'',
          startTime:'',
          logTime:'',
          id:0,
          pauseTime:'',
          timer:'',
          pauses:[],
          resumes:[],
          tasks:[],
        }
    })
    }, 300)
  };

  pauseTimer = () => {
    this.setState({ timerOn: false });
    clearInterval(this.timer);
    let newPause = new Date().toLocaleTimeString();
    let addPause = this.state.data.pauses.concat(newPause);
    
    this.setState ({
      data: {
        ...this.state.data,
        pauseTime:newPause,
        pauses:addPause,
      },
      styling: {
        ...this.state.styling,
        pauseStatus:styles.paused
      },
    })

  };

  resumeTimer = () => {

    this.setState({ timerOn: true });
    clearInterval(this.timer);
    
    this.setState({
      timerOn: true,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime
    });
    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart
      });
    }, 10);


    let newResume = new Date().toLocaleTimeString();
    let addResume = this.state.data.resumes.concat(newResume)
    this.setState ({
      timerOn: true,
      data: {
        ...this.state.data,
        resumeTime:newResume,
        resumes:addResume
      },
      styling: {
        ...this.state.styling,
        pauseStatus:styles.playing
      },
    })

  };

  resetTimer = () => {

    let newLog = new Date().toLocaleTimeString();
    let addtask = this.state.data
    let addJob = this.state.jobs.concat(addtask);

    this.setState ({
      timerStart: 0,
      timerTime: 0,
      data: {
        logTime:newLog,
        ...this.state.data,
      
      },
      slash:'',
      jobs:addJob,

      styling: {
        ...this.state.styling,
        inputStatus:styles.open,
        logStatus:styles.close,
        timeStatus:styles.close,
        pauseStatus:styles.playing
      },
    })

  };

  addJob = (data) => {
      let task = { id:Date.now(),
      ...data
    };
    let newJobsList = [task,...this.state.jobs];
    this.setState({
      jobs:newJobsList
    })
  }

  handleNewJobInput = (e) => {
    this.setState({
      data: {
        ...this.state.data,
        task:e.target.value
      }
    })

  }

  handleClientInput = (e) => {
    e.preventDefault();
    let id = Date.now()
    this.setState({
      clientInfo:{
        name:e.target.value,
        id
      }
    })
  }

  handleClientAdd = (e) => {

    let id = Date.now()
    let addClientName = this.state.clientInfo
    let addClient = this.state.clients.concat(addClientName)
    
    this.setState({
        clients:addClient,
        id:id
      
    })
  }

  handleClientSelect = (e) => {
    e.preventDefault();

    this.setState({
      slash:' / ',
      data:{
        ...this.state.data,
        client:e.target.value,
      }
    })
  }

  handleLog = (e) => {
    e.preventDefault();
    
    let newLog = new Date().toLocaleTimeString();
    let timerTime = this.state.timerTime
    this.setState ({ 
      data: {
        ...this.state.data,
        logTime:newLog,
        timerTime
      },
    })
  } 

  timeKeeper = (e) => {
    console.log(this.state.data.timer)
    this.setState ({
      data: {
        ...this.state.data,
        timer:e.target.innerHtml
      }
    })

  }


  render() {  
  
    let {data,clientInput,clientInfo,clients,timerTime} = this.state
    let {pauseTime,task,client,startTime,logTime,resumeTime} = this.state.data
    let {timeStatus,logStatus,pauseStatus,inputStatus,addStatus} = this.state.styling
    let findClient = clients.find(client => client.name === clientInfo.name);

        // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
    
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
              <div className="newjob">
              
              <div className="container">
                <label className="newjob__label" htmlFor="nj">
                  <select style={inputStatus} onClick={this.handleClientSelect}className="newjob__clientselect" name="" id="">
                  <option defaultValue="Select Client" >Select Client</option>
                    {
                      this.state.clients.map((client) => {
                        let clientProps = {
                          ...client,
                          key:client.id
                        } 
                        return (<Clients {...clientProps}/>) 
                      })
                    }
                  </select>
                  <input style={inputStatus} value={task} onChange={this.handleNewJobInput}  name='nj' className="newjob__input" placeholder="Task Name..."/>
                  { (client === '') || ( task === '' || data.client ==='Select Client' ) ? null : <span style={inputStatus} className="newJob__control" onClick={this.startTimer}>Start</span> }
            
                </label>
                <div className="newJob__jobInfo" style={styles.jobInfo}>
                  <div className="newJob__timer" style={timeStatus}> <span>{client}</span><span>{task}</span><span>{startTime}</span></div>
                  <div className="newJob__timer" onChange={this.timeKeeper} style={timeStatus}> {hours} Hrs : {minutes} Mins : {seconds} Secs </div>
                  {/* <div className="newJob__logtime" style={timeStatus}> {logTime} </div> */}
                  <div style={logStatus} className="newJob__pauses">
                  <div style={pauseStatus} className="newJob__control" onClick={this.pauseTimer}>Pause{ pauseStatus === 'Paused' ? 'ed' : null }</div>
                    {pauseTime}
                  </div>
                  <div style={logStatus} className="newJob__resumes">
                    <div  className="newJob__control" onClick={this.resumeTimer}>Resume </div>
                    {resumeTime}
                  </div>
                  <span style={logStatus} className="newJob__control" onMouseDown={this.handleLog} onMouseUp={this.stopTimer}>Log</span>    
              </div>
             </div>
                  
       
            </div>
              <div className="existingjobs">
                  <h4>Clients</h4>
                    <div className="existingjobs__client">
                    {
                    this.state.jobs.map((job) => {
                      let jobProps = {
                        ...job,
                        key:job.id,

                      };
                      return (
                        <Job {...jobProps}/>
                      )
                    })
                    }
                    </div>
              </div>
            </form>
          </div>
        </div>  
    )
  }
}

export default App;
