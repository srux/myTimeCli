import React, { Component } from 'react';
import Tasks from './tasks';

// import app from '../appConfig';
import app from "firebase";

//plugins
import { GrPauseFill, GrPlayFill,GrShare} from 'react-icons/gr';
import { Beforeunload  } from 'react-beforeunload';
// import { GithubPicker  } from 'react-color'

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
    shrinkHor:{
      width:'0'
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
    },
  }


class Clients extends Component {
    constructor(props) {
        super(props)

        this.state = {
            clientToggle:'',
            optionToggle:false,
            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            tasks:[],
            clientOptions:{
              clientColor:'#fff',
            },

            styling:{
              logStatus:styles.close,
              timeStatus:styles.close,
              pauseStatus:styles.playing,
              resumeStatus:styles.paused,
              inputStatus:styles.open,
              addStatus:styles.paused,
              optionStatus:styles.shrinkHor
              
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
        },10000)

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
        
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        clearInterval(this.timeStor);

        let data = this.state.data
        let addtask = this.state.data
        let addJob = this.state.tasks.concat(addtask);

        localStorage.clear();

        this.setState ({
          data: {
            ...data,
          },
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
          const db = app.firestore();
          db.settings({
            timestampsInSnapshots: true
          });

          let clientRef = db.collection('clients').doc(data.client);
          
          clientRef.update({ 
            tasks: app.firestore.FieldValue.arrayUnion({
              ...data
            })
        }); }, 300);
        
        setTimeout(()=> {
          this.setState ({
            timerStart: 0,
            timerTime: 0,
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
        let {timerStart,timerTime,} = this.state;
        let rate = this.state.data.rate
        let scale = rate/3600000
        let total = scale * timerTime

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

        handleOptionToggle = (e) => {
          e.preventDefault()

          this.setState(prevState => ({
            optionToggle: !prevState.optionToggle
          }));
        
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

      handleColor = (e,clientOptions) => {
      
        e.preventDefault();;
        this.setState({
          clientOptions:{ 
            ...clientOptions,
            clientColor:e.target.className
          }
        })
        
        setTimeout(() => { 
          const client = this.props.name
          const clientOptions = this.state.clientOptions
          const clientColor = clientOptions.clientColor
          const db = app.firestore();
          db.settings({
            timestampsInSnapshots: true
          });
          
          let clientRef = db.collection('clients').doc(client);
          
          clientRef.update({ 
            options:{
              ...clientOptions,
              clientColor
            }
            
        }); }, 300);
      }

    render() {
        let {name} = this.props
        let {timerTime,clientToggle} = this.state
        let {pauseTime,task,client,startTime,resumeTime,rate} = this.state.data
        let {timeStatus,logStatus,pauseStatus,inputStatus,resumeStatus} = this.state.styling
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        let scale = rate/3600000
        let total = scale * timerTime
        let clientOptions = this.props.options
   
        return (
          
          <div className="client-card"> 
            { timerTime > 0 ? <Beforeunload onBeforeunload={ () => "You have time running, please log time"} /> : null }
          

            <div className="timer-notification" onChange={this.timeKeeper} style={timeStatus}> 
             <div className="timer-notification__control">
                
                        
               <div style={styles.flexRow}>
                  <h4>On the clock
                  </h4>
                  <div style={logStatus} className="client__pauses">

                      <div style={pauseStatus} className="client__control" onClick={this.pauseTimer}>
                          <GrPauseFill/>
                          { pauseStatus === 'Paused' ? 'ed' : null }</div>
                  </div>
                  <div style={logStatus} className="client__resumes">
                      <div
                          style={resumeStatus}
                          className="client__control"
                          onClick={this.resumeTimer}>
                          <GrPlayFill/>
                      </div>
                  </div>

                  <span
                      style={logStatus}
                      className="client__control"
                      onMouseDown={this.handleLog}
                      onMouseUp={this.stopTimer}>
                      <GrShare/>
                  </span>
                  </div> {name} {task} {hours} Hrs : {minutes} Mins : {seconds} Secs  $ {total.toFixed(2)} 
              </div>
                    
            </div>
                {clientToggle === name ? <h3 className={"client-name "+clientOptions.clientColor} onClick={this.handleClientToggle} id=''>{name}</h3> : <h3 className={"client-name "+clientOptions.clientColor} onClick={this.handleClientToggle} id={name}>{name}</h3>}
                
                {clientToggle === name ? 
                <> 
                <div className={"client__jobInfo"} style={styles.max}>

                    <div className="client__clientdash">

                        <div>
                            <h3 className={"client-name panel "+clientOptions.clientColor}>{name}</h3>
                            <label
                                style={inputStatus}
                                className="client__clientratelabel"
                                htmlFor="clientrate">
                                <span style={inputStatus} className="dollar">$</span><input
                                    style={inputStatus}
                                    id="clientrate"
                                    className="client__clientrate"
                                    onChange={this.handleClientRate}
                                    value={rate}
                                    placeholder="Hourly Rate..."
                                    type="number"/>
                            </label>
                        </div>
                        <div className="client__optionsdash">
                            <div onClick={this.handleOptionToggle} className="client__optionbutton">
                                Options
                            </div>
                            <div onClick={this.handleClientToggle} className="client__cardclose">Close</div>
                        </div>
                    </div>
                    { this.state.optionToggle ?
                    <div className="client__options">
                        <div className="options__colorpick">
                            <ul>
                                <li className='red' onClick={this.handleColor}></li>
                                <li className='turq' onClick={this.handleColor}></li>
                                <li className='black' onClick={this.handleColor}></li>
                                <li className='purple' onClick={this.handleColor}></li>
                                <li className='blue' onClick={this.handleColor}></li>
                                <li className='yellow' onClick={this.handleColor}></li>
                                <li className='green' onClick={this.handleColor}></li>
                                <li className='clear' onClick={this.handleColor}></li>
                            </ul>
                        </div>
                    </div>
                    : null }
                    <div className="client__task">
                        <input
                            style={inputStatus}
                            value={task}
                            onChange={this.handleNewJobInput}
                            name='nj'
                            className="task__input"
                            placeholder="Task Name..."/>
                        { task === '' ? null :
                        <span style={inputStatus} className="client__control" onClick={this.startTimer}>Start</span>
                        }
                        <div className="client__timer" style={timeStatus}>
                            <span>{client}</span>
                            <span>{task}</span>
                            <span>{startTime}</span>
                        </div>
                        <div className="client__timer" onChange={this.timeKeeper} style={timeStatus}>
                            {hours} Hrs : {minutes} Mins : {seconds} Secs at ${rate} per hour<span className="client__timer" style={logStatus}>/ $ {total.toFixed(2)}</span>
                        </div>
                        <div style={logStatus} className="client__pauses">
                            <div style={pauseStatus} className="client__control" onClick={this.pauseTimer}>Pause{ pauseStatus === 'Paused' ? 'ed' : null }</div>
                            {pauseTime}
                        </div>
                        <div style={logStatus} className="client__resumes">
                            <div
                                style={resumeStatus}
                                className="client__control"
                                onClick={this.resumeTimer}>Resume
                            </div>
                            {resumeTime}
                        </div>

                        <span
                            style={logStatus}
                            className="client__control"
                            onMouseDown={this.handleLog}
                            onMouseUp={this.stopTimer}>Log</span>

                    </div>
                    <div className="client__tasklist">
                        { this.props.tasks.map((task) => { let taskProps = { ...task, key:task.id }
                        return <Tasks {...taskProps}/>}) }
                    </div>
                </div>
                <div onClick={this.handleClientToggle} className="overlay"></div> 
                </>
                : 
                <div className={"client__jobInfo"} style={styles.hide} ></div>}
              
                 
          </div>
        )
    }
}


export default Clients