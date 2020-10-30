import React, { Component } from 'react';
import Tasks from '../components/Tasks';
import { GrPauseFill, GrPlayFill,GrShare} from 'react-icons/gr';
// import firebase from '../FirebaseConfig';
import firebase from "../config/FirebaseConfig";


let styles = {
    close:{
      visibility:'hidden',
    },
    open:{
      visibility:'visible',
    },
    hide: {
        display:'none'
    },
    show: {
        display:'flex'
    },
    max: {
        position:'absolute',
        height:'60vh',
        width:'80%',
        zIndex:'2',
        left:'10%'
    },
    flexRow: {
        display:'flex',
        alignItems: 'center'
    },
    flexCol: {
        display:'flex',
        flexDirection: 'column'
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

class Clients extends Component {
    constructor(props) {
        super(props)

        this.state = {
            clientToggle:'',
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            tasks:[],
            styling:{
              logStatus:styles.close,
              timeStatus:styles.close,
              pauseStatus:styles.playing,
              resumeStatus:styles.paused,
              inputStatus:styles.open,
              addStatus:styles.paused
            },
            data:{
              client:'',
              task:'',
              startTime:'',
              rate:0,
              money:0,
              logTime:'',
              id:0,
              pauseTime:'',
              pauses:[],
              resumes:[],
            },
        }

    }

    updatedProps = () => {
      alert('props changed')
    }

    getSnapshotBeforeUpdate(prevProps) {
      return { updateProps: prevProps.clients !== this.props.clients };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (snapshot.updateProps) {
        this.updatedProps();
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

        this.timeStor = setInterval(() => {
          let client = this.state.data.client
          let task = this.state.data.task
          let timer = this.state.timerTime
          localStorage.setItem('client',client)
          localStorage.setItem('Task',task)
          localStorage.setItem('Task Time',timer)
        },60000)

        let newStart = new Date().toLocaleTimeString();
        let id = Date.now();
        let client = this.props.name;
          this.setState ({
            data: {
              ...this.state.data,
              startTime:newStart,
              id,
              client
            },
            styling: {
              ...this.state.styling,
              logStatus:styles.open,
              timeStatus:styles.open,
              inputStatus:styles.hide
            },
    
          });
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
            pauseStatus:styles.paused,
            resumeStatus:styles.playing
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
            resumeStatus:styles.paused,
            pauseStatus:styles.playing,
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
    
      stopTimer = () => {
        let data = this.state.data
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        clearInterval(this.timeStor);

        let newLog = new Date().toLocaleTimeString();
        let addtask = this.state.data
        let addJob = this.state.tasks.concat(addtask);

        localStorage.clear();

        this.setState ({
          timerStart: 0,
          timerTime: 0,
          data: {
            logTime:newLog,
            ...this.state.data,
          },
          slash:'',
          tasks:addJob,
    
          styling: {
            ...this.state.styling,
            inputStatus:styles.open,
            logStatus:styles.close,
            timeStatus:styles.close,
            pauseStatus:styles.playing
          },
        });

        setTimeout(() => { 
          const db = firebase.firestore();
          db.settings({
            timestampsInSnapshots: true
          });

          let clientRef = db.collection('clients').doc(data.client);
          
          clientRef.update({ 
            tasks: firebase.firestore.FieldValue.arrayUnion({
              ...data
            })
        }); }, 300);
        
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
              pauses:[],
              resumes:[],
            }
        })
        }, 600)
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
    
      handleLog = (e) => {
        e.preventDefault();

        let newLog = new Date().toLocaleTimeString();
        // let timerTime = this.state.timerTime
        let {timerStart,timerTime,} = this.state;
        let rate = this.state.data.rate
        let scale = rate/3600000
        let total = scale * timerTime
        // const clientRef = db.collection('clients').doc(data.client);
        this.setState ({ 
          data: {
            ...this.state.data,
            logTime:newLog,
            timerTime,
            timerStart,
            money:total
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

      handleClientToggle = (e) => {
          e.preventDefault()
        this.setState({
            clientToggle:e.target.id
        })

      } 

      handleClientRate = (e) => {
        e.preventDefault()
        this.setState({
          data: {
            ...this.state.data,
            rate:e.target.value
          },
        })
      }

    render() {
        let {name,id} = this.props
        let {timerTime,clientToggle} = this.state
        let {pauseTime,task,client,startTime,resumeTime,rate} = this.state.data
        let {timeStatus,logStatus,pauseStatus,inputStatus,resumeStatus} = this.state.styling
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        let scale = rate/3600000
        let total = scale * timerTime
        
        return (
            
            <div className="client-card"> 
             <div className="timer-notification" onChange={this.timeKeeper} style={timeStatus}> 
             <div className="timer-notification__control">
                
                        
                        <div style={styles.flexRow}>
                            <h4>On the clock </h4>
                            <div style={logStatus} className="newJob__pauses">
                        
                            <div style={pauseStatus} className="newJob__control" onClick={this.pauseTimer}> <GrPauseFill/> { pauseStatus === 'Paused' ? 'ed' : null }</div>
                            </div>
                            <div style={logStatus} className="newJob__resumes">
                                <div style={resumeStatus} className="newJob__control" onClick={this.resumeTimer}> <GrPlayFill /> </div>
                            </div>
                            
                            <span style={logStatus} className="newJob__control" onMouseDown={this.handleLog} onMouseUp={this.stopTimer}> <GrShare/> </span>  
                            </div> {name} {task} {hours} Hrs : {minutes} Mins : {seconds} Secs  $ {total.toFixed(2)} 
                        </div>
                    
             </div>
                {clientToggle === name ? <h3 className="client-name" onClick={this.handleClientToggle} id=''>{name}</h3> : <h3 className="client-name" onClick={this.handleClientToggle} id={name}>{name}</h3>}
                
                {/* {this.props.pauses.map((pause,i) => <div key={i}>{pause} to </div>)} */}
                {clientToggle === name ? 
                <> 
                <div className={"newJob__jobInfo"} style={styles.max} >
                    
                    <div className="newJob__clientdash">
                    <div><h3>{name}</h3><label className="newJob__clientratelabel" htmlFor="clientrate"><span className="dollar">$</span><input id="clientrate" className="newJob__clientrate" onChange={this.handleClientRate} value={rate} placeholder="Hourly Rate..." type="number"/> </label></div>
                    <div onClick={this.handleClientToggle} className="newJob__cardclose">Close</div></div>
                  
                    <div className="newJob__task">            
                        <input style={inputStatus} value={task} onChange={this.handleNewJobInput}  name='nj' className="newjob__input" placeholder="Task Name..."/>
                        { task === ''  ? null : <span style={inputStatus} className="newJob__control" onClick={this.startTimer}>Start</span> }
                        <div className="newJob__timer" style={timeStatus}> <span>{client}</span><span>{task}</span><span>{startTime}</span></div>
                        <div className="newJob__timer" onChange={this.timeKeeper} style={timeStatus}> {hours} Hrs : {minutes} Mins : {seconds} Secs </div>
                        {/* <div className="newJob__logtime" style={timeStatus}> {logTime} </div> */}
                        <div style={logStatus} className="newJob__pauses">
                        <div style={pauseStatus} className="newJob__control" onClick={this.pauseTimer}>Pause{ pauseStatus === 'Paused' ? 'ed' : null }</div>
                            {pauseTime}
                        </div>
                        <div style={logStatus} className="newJob__resumes">
                            <div style={resumeStatus} className="newJob__control" onClick={this.resumeTimer}>Resume </div>
                            {resumeTime}
                        </div>
                        
                        <span style={logStatus} className="newJob__control" onMouseDown={this.handleLog} onMouseUp={this.stopTimer}>Log</span>  
                        <span className="newJob__timer" style={logStatus}>$ {total.toFixed(2)}</span> 
                    </div>
                    <div className="newJob__tasklist">
                        {
                            this.props.tasks.map((task) => {
                                let taskProps = {
                                    ...task,
                                    key:task.id
                                }
                                return <Tasks {...taskProps}/>
                            })
                        }
                    </div>
                </div> 
                <div onClick={this.handleClientToggle} className="overlay"></div> 
                </>
                : 
                <div className={"newJob__jobInfo"} style={styles.hide} ></div>}
              
                 
            </div>
        )
    }
}


export default Clients