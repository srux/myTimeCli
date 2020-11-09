import React, { Component } from 'react';

import Job from './job';

// import app from '../appConfig';
import app from "firebase";

//api
import {deleteClient} from "../api/data"


//plugins

import { RiAddFill,RiPlayLine,RiInboxArchiveLine,RiListSettingsFill } from "react-icons/ri";
import { GrPauseFill, GrPlayFill,GrShare} from 'react-icons/gr';
import { Beforeunload  } from 'react-beforeunload';
import Scrollbar from "react-scrollbars-custom";


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
      opacity:0,
      transform: `scale(${1}, ${0})` 
    },
    max: {
        position:'absolute',
        height:'60vh',
        width:'81%',
        zIndex:'2',
        left:'9%',
        top:'15.8em',
    },
    flexRow: {
        display:'flex',
        alignItems: 'center'
    },
    flexCol: {
        display:'flex',
        flexDirection: 'column'
    },
    disabled:{
      pointerEvents:'none',
      opacity:.5,
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
            colorToggle:false,
            
            deleteClientInput:'',

            timerOn: false,
            timerStart: 0,
            timerTime: 0,
            jobs:[],
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
              job:'',
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
  

  componentDidMount(){
      const db = app.firestore();
      // const {currentUser} = app.auth()
      const userUid = app.auth().currentUser.uid
      const client = this.props.name;
      const ratesRef = db.collection('users').doc(userUid).collection('settings').doc('rates')
      
      let data = this.state.data
      ratesRef.get().then((doc) => {
        if (doc.exists) {
          console.log('doc data', doc.data())
          let rate = doc.data().globalRate
          console.log(rate)
         
          this.setState({
            data:{
              ...data,
              rate
            }
          })
        }
        else {
          console.log('no such document')
        }
      })

      const clientRef = db.collection('users').doc(userUid).collection('clients').doc(client)
      clientRef.get().then((doc) => {
        if (doc.exists) {
          let data = doc.data().jobs
          this.setState({
           existingJobs:{
            ...data
           } 
          })
        }
        else {
          console.log('no such document')
        }
      })
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

        // this.timeStor = setInterval(() => {
        //   let client = this.state.data.client
        //   let job = this.state.data.job
        //   let task = this.state.data.task
        //   let timer = this.state.timerTime
        //   localStorage.setItem('client',client)
        //   localStorage.setItem('Job',job)
        //   localStorage.setItem('Task',task)
        //   localStorage.setItem('Job Time',timer)
        // },10000)

        let newStart = new Date().toLocaleTimeString();
        let id = Date.now();
        let jobId = Date.now();
        let client = this.props.name;
          this.setState ({
            data: {
              ...this.state.data,
              startTime:newStart,
              id,
              jobId,
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
    
    
      handleStoreData = () => {
        
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        clearInterval(this.timeStor);

        // define data
        let data = this.state.data

        // add job to jobs list
        let addJob = this.state.jobs.concat(data);
        let job = data.job
        let jobId = data.jobId
        localStorage.clear();

        // create payload & switch toggles
        this.setState ({
          currentJob:jobId,
          data: {
            ...data,
          },
          jobs:addJob,
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
          const {currentUser} = app.auth()
          const userUid = currentUser.uid
          const client = this.props.name
          db.settings({
            timestampsInSnapshots: true
          });
         
          //update jobs
          const clientRef = db.collection('users').doc(userUid).collection('clients').doc(client);
          if ( this.props.currentJob === null) {
            clientRef.update({ 
              jobs:app.firestore.FieldValue.arrayUnion({
                job,
                jobId,
                tasks:
                  [data]
              })
          })
          .then(function() {
            clientRef.update({
              currentJob:jobId,
              currentJobName:job
            })
            console.log("Job", job, "Added");
          })
          .catch(function(error) {
              alert("Error adding document: ", error);
          }); 
          }
          else {
            clientRef.get().then((doc) => {
              if (doc.exists) {
                console.log('doc data', doc.data())
                
                //data
                let jobsData = doc.data().jobs
                let docData = doc.data()
              
                let currentJob = this.props.currentJob
                //define selected job
                let selectedJob = jobsData.find(j => j.jobId === currentJob)
                // define tasks of selected job
                let tasks = selectedJob.tasks
              
                //create task
                this.setState({ 
                  newJobs:[
                     {
                      ...selectedJob,
                      tasks:[
                        ...tasks,
                        {
                        ...data
                        }]
                      }
                  ]
                })

                //merge jobs with new task

                let newJobs = this.state.newJobs
                let filteredJobs = docData.jobs.filter(job => job.jobId != currentJob);
                let jobs = [...filteredJobs,...newJobs]

                //send payload
                setTimeout(()=>{
                  clientRef.update({
                    jobs
                  })
                },300)
              }

              else {
                console.log('no such document')
              }
              
            })
            
          }
        }, 300);
        
        // state cleanup
        setTimeout(()=> {
          this.setState ({
            timerStart: 0,
            timerTime: 0,
           
            data: {
              ...data,
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
            job:e.target.value
          }
        })
      }

      setCurrentJob =(e)=>{
        e.preventDefault();
        let db = app.firestore();
        let {currentUser} = app.auth()
        let userUid = currentUser.uid
        let client = this.props.name;
        const clientRef = db.collection('users').doc(userUid).collection('clients').doc(client)
        clientRef.update({
          currentJob:null
        })
      }

          
      handleNewTaskInput = (e) => {
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
            money:total,
          },
        })
      } 
    

      timeKeeper = (e) => {
        this.setState ({
          data: {
            ...this.state.data,
            timer:e.target.innerHtml
          }
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

      
      handleColor = (e,clientOptions) => {
        e.preventDefault();;
        this.setState({
          clientOptions:{ 
            ...clientOptions,
            clientColor:e.target.className
          },
     
        })
        this.setState(prevState=>({
          colorToggle: !prevState.colorToggle
        }))

        setTimeout(() => { 
          const client = this.props.name
          const clientOptions = this.state.clientOptions
          const clientColor = clientOptions.clientColor
          const db = app.firestore();

          let {currentUser} = app.auth()
          let userUid = currentUser.uid
          db.settings({
            timestampsInSnapshots: true
          });
              
          const clientRef = db.collection('users').doc(userUid).collection('clients').doc(client);
          
          clientRef.update({ 
            options:{
              ...clientOptions,
              clientColor
            }
            
        }); }, 300);
      }

      
      handleClientToggle = (e) => {
        e.preventDefault()
       this.setState({
          clientToggle:e.target.id
      })

    } 

   handleToggle=(e)=>{
    e.preventDefault()
    let target = e.target.getAttribute('value');
   
    this.setState(state  => ({
      [target]: !this.state[target]
    }));
   }

   handleClearToggles=(e)=>{
    e.preventDefault()
   
   
    this.setState({
      optionToggle:false,
      colorToggle:false,
      deleteToggle:false,
    });
   }


   handleDeleteConfirm=(e)=>{
    e.preventDefault()

    this.setState({
        deleteClientInput:e.target.value,
    })

   }

      handleDeleteClient=()=>{
        let name = this.props.name
        const {currentUser} = app.auth()
        let userUid = currentUser.uid
        deleteClient(userUid,name)
      }

    render() {
        let {name,jobs} = this.props
        let {timerTime,clientToggle,optionToggle,deleteToggle,colorToggle} = this.state
        let {pauseTime,job,task,startTime,resumeTime,rate} = this.state.data
        let {timeStatus,logStatus,pauseStatus,inputStatus,resumeStatus} = this.state.styling
        let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
        let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
        let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        let scale = rate/3600000
        let total = scale * timerTime
        let clientOptions = this.props.options
   
        return (
          
        <div className="client"> 
            { timerTime > 0 ? <Beforeunload onBeforeunload={ () => "You have time running, please log time"} /> : null }
          

            <div
              className="client__timer-notification"
              onChange={this.timeKeeper}
              style={timeStatus}>
              <div className="client__timer-control">

                <div style={styles.flexRow}>
                      <h4>On the clock
                      </h4>

                      <div style={logStatus} className="client-pauses">

                          <div style={pauseStatus} className="client__timer-button" onClick={this.pauseTimer}>
                              <GrPauseFill/>
                              { pauseStatus === 'Paused' ? 'ed' : null }</div>
                      </div>
                      <div style={logStatus} className="client-resumes">
                          <div
                              style={resumeStatus}
                              className="client__timer-button"
                              onClick={this.resumeTimer}>
                              <GrPlayFill/>
                          </div>
                      </div>
                      <div style={logStatus} className="client-log">
                          <div
                              className="client__timer-button"
                              onMouseDown={this.handleLog}
                              onMouseUp={this.handleStoreData}>
                              <GrShare/>
                          </div>
                      </div>
                  </div>
                  {name} {job}
                  <span>{hours}</span>
                  Hrs :
                  <span>{minutes}</span>
                  Mins :
                  <span>{seconds}</span>
                  Secs
                  <span className="clpanel__rate">
                      $ {total.toFixed(2)}
                  </span>
              </div>
            </div>
                {clientToggle === name ? <h3 className={"client__name "+clientOptions.clientColor} onClick={this.handleClientToggle} id=''>{name}</h3> : <h3 className={"client__name "+clientOptions.clientColor} onClick={this.handleClientToggle} id={name}>{name}</h3>}
                
                {clientToggle === name ? 
                <> 
                
                <div className="clpanel" style={styles.max}>
                { colorToggle && !deleteToggle ?
                    <div className="clpanel__colorspanel">
                        <div className="clpanel__colorpick">
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
               
                    <div className="clpanel__clientdash">

                        <div className="clpanel__clientname">
                            <h3 className={"clientname-panel "+clientOptions.clientColor}>{name}</h3>
                            <div className={"clpanel__settings-toggle "+clientOptions.clientColor} onClick={this.handleToggle} value={'colorToggle'} ><RiListSettingsFill style={{pointerEvents:'none'}}/></div>
                            <label
                                style={inputStatus}
                                className="clpanel__clientratelabel"
                                htmlFor="clientrate">


                                <span style={inputStatus} className="dollar">$</span>
                                {this.props.settings.map((setting,i) =>   
                                <input key={i}
                                    style={inputStatus}
                                    id="clientrate"
                                    className="clpanel__clientrate"
                                    onChange={this.handleClientRate}
                                    // defaultValue={setting.globalRate}
                                    value={ setting.setGlobalRate ? setting.globalRate : rate}
                                    placeholder="Hourly Rate..."
                                    type="number"/> )}
                              
                            </label>
                        </div>
                        <div className="clpanel__optionsdash">
                            
                            
                            <div style={ optionToggle ? null : styles.shrinkHor } className="clpanel__optionpopup"> 
                                
                                <div className="clpanel__optionbutton" value={'colorToggle'} onClick={this.handleToggle} >
                                    Color Label
                                </div>
                                <div className="clpanel__optionbutton alert" value={'deleteToggle'} onClick={this.handleToggle} >
                                  Delete
                                  { deleteToggle ?  
                                  <><div class="clpanel__delete">
                                    <label htmlFor="confirm-client .alert">Enter clients name to confirm deletion</label>
                                    <input id={'confirm-client'} onChange={this.handleDeleteConfirm} placeholder={name} type="text"/>
                                  { name === this.state.deleteClientInput
                                    ?   <div onClick={this.handleDeleteClient} className="alert-button">CONFIRM</div>
                                    :   <div onClick={this.handleDeleteClient} style={{ pointerEvents:'none', cursor:'no-drop', opacity:.3,}} className="alert-button">CONFIRM</div>
                                  }
                                  </div><div className="clpanel__overlay" onMouseUp={this.handleClearToggles}></div></> : null }
                                 
                                </div>
                              </div>
                              <div className="clpanel__optionbutton" value={'optionToggle'} onClick={this.handleToggle} onMouseUp={this.handleClearToggles}>Options</div>
                              <div onClick={this.handleClientToggle} onMouseUp={this.handleClearToggles} className="clpanel__cardclose">Close</div>
                        </div>
                    </div>
                  
                    <div className="clpanel__task">
                      <input
                            style={inputStatus}
                            value={job}
                            onChange={this.handleNewJobInput}
                            onFocus={this.setCurrentJob}
                            name='nj'
                            className="task__input"
                            placeholder="Job Name..."/>
                            <input
                            style={inputStatus}
                            value={task}
                            onChange={this.handleNewTaskInput}
                            name='nt'
                            className="task__input"
                            placeholder="Task Name..."/>
                        { job === '' ? null :
                        <div style={inputStatus} className="clpanel__control" onClick={this.startTimer}>Start</div>
                        }
                        <div className="clpanel__timer" style={timeStatus}>
                            <span>{job}</span>
                            <span>{task}</span>
                            <span>{startTime}</span>
                        </div>
                        <div className="clpanel__timer" onChange={this.timeKeeper} style={timeStatus}>
                        <span className="clpanel__time">{hours}</span> Hrs : <span className="clpanel__time">{minutes}</span> Mins : <span className="clpanel__time">{seconds}</span> Secs at ${rate} per hour<span className="clpanel__rate" style={logStatus}>/ $ {total.toFixed(2)}</span>
                        </div>
                        <div style={logStatus} className="clpanel__pauses">
                            <div style={pauseStatus} className="clpanel__control" onClick={this.pauseTimer}>Pause{ pauseStatus === 'Paused' ? 'ed' : null }</div>
                            {pauseTime}
                        </div>
                        <div style={logStatus} className="clpanel__resumes">
                            <div
                                style={resumeStatus}
                                className="clpanel__control"
                                onClick={this.resumeTimer}>Resume
                            </div>
                            {resumeTime}
                        </div>

                        <span
                            style={logStatus}
                            className="clpanel__control"
                            onMouseDown={this.handleLog}
                            onMouseUp={this.handleStoreData}>Log</span>

                    </div>
                
                  <Scrollbar className="clpanel__tasklist" style={{ padding: '1em' }}>
                        { this.props.jobs.map((job) => { let jobProps = { ...job, key:job.jobId }
                        return <Job {...jobProps} jobs={jobs} name={name} currentJob={this.props.currentJob} styling={this.state.styling} startTimer={this.startTimer} handleNewTaskInput={this.handleNewTaskInput}  /> }) }
                   </Scrollbar>
                </div>
                <div onClick={this.handleClientToggle} onMouseUp={this.handleClearToggles} className="overlay"></div> 
                </>
                : 
                <div className={"client__jobInfo"} style={styles.hide}  ></div>}
          </div>
        )
    }
}


export default Clients