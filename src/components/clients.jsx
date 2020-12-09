import React, { Component } from 'react';

import Job from './job';
import ArchivedJob from './archive-job';
//api
import {getRate,getClientData,deleteClient,queryClientData,queryJobs} from '../api/data'
import app from "firebase";


//plugins

import { RiListSettingsFill,RiInboxUnarchiveLine } from "react-icons/ri";
import { GrPauseFill, GrPlayFill,GrShare} from 'react-icons/gr';
import { RiArchiveLine } from "react-icons/ri";


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
        height:'68vh',
        width:'96%',
        zIndex:'2',
        left:'2%',
        top:'7em',
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
  

componentDidMount() {
    let client = this.props.name;



    let data = this
        .state
        .data
        getRate()
        .then((doc) => {
            if (doc.exists) {
                let rate = doc
                    .data()
                    .globalRate

                    this
                    .setState({
                        data: {
                            ...data,
                            rate
                        }
                    })
            } else {
                console.log('no such document')
            }
        })

        getClientData(client)
        .then((doc) => {
            if (doc.exists) {
                let data = doc
                    .data()
                    .jobs
                    this
                    .setState({
                        existingJobs: {
                            ...data
                        }
                    })
            } else {
                console.log('No clients exist')
            }
        })
        .then(
          queryClientData(client).update({
            currentTask:0,
            currentJob:null
          })
        )
}


    startTimer = () => {  
      let newStart = new Date().toLocaleTimeString();
      let id = Date.now();
      let jobId = Date.now();
      let client = this.props.name;
      let cTask = this.props.currentTask
      if ( cTask === 0 ) {
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
        }
        else {
          this.setState({
            timerOn: true,
            eTimerTime: cTask.timerTime,
            timerStart: Date.now()
          });

     
            this.timer = setInterval(() => {
              let timer =  Date.now() - this.state.timerStart
              this.setState({
                timerTime: timer + this.state.eTimerTime
            });
            }, 10);
   

        }

        if ( cTask === 0 ) {
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
        } 
        else {
          
          this.setState ({
            data: {
              ...cTask
            },
            styling: {
              ...this.state.styling,
              logStatus:styles.open,
              timeStatus:styles.open,
              inputStatus:styles.hide
            },

          })
        }
      };


    
      handleStoreData = () => {
        let db = app.firestore();
        this.setState({ timerOn: false });
        clearInterval(this.timer);
        clearInterval(this.timeStor);

        // define data
        let data = this.state.data

        // add job to jobs list
        let addJob = this.state.jobs.concat(data);
        let job = data.job
        let jobId = data.jobId
        let cTask = this.props.currentTask
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

          let client = this.props.name
          let eJobs = this.props.jobs
          let cJobId = this.state.data.jobId
          let eJobsFilter = eJobs.filter((eJob) => {return eJob.jobId === cJobId}).length > 0
      
          //Add new job
          if ( !eJobsFilter ) {
            
            db.settings({
              timestampsInSnapshots: true
            });
            queryClientData(client).update({ 
              jobs:app.firestore.FieldValue.arrayUnion({
                job,
                jobId,
                invoiced:false,
                tasks:
                  [data]
              })
          })
          .then(function() {
            queryClientData(client).update({
              currentJob:jobId,
              currentJobName:job
            })
            console.log("Job", job, "Added");
          })
          .catch(function(error) {
              alert("Error adding document: ", error);
          }); 
          }
          //resume function
          else {
            getClientData(client).then((doc) => {
              if (doc.exists) {
               
                //data
                  let jobsData = doc.data().jobs
                  let docData = doc.data()
                  let currentJob = this.state.data.jobId
                
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
                let filteredJobs = docData.jobs.filter(job => job.jobId !== currentJob);
                let jobs = [...filteredJobs,...newJobs]
  
                db.settings({
                  timestampsInSnapshots: true
                });
                //send payload
                    if ( !eJobsFilter) {
                        queryClientData(client).update({
                          jobs
                        })
                      console.log('Task Added')
                    }

                    else {

                      this.setState({ 
                            tasks:[
                              ...tasks,
                              {
                              ...data
                            }
                        ]
                      })
    
                        let taskArr = this.state.tasks
                        const filteredArr = [...new Map(taskArr.map(item => [item.id , item])).values()]


                        this.setState({ 
                          newJobs:[
                            {
                              ...selectedJob,
                              tasks:[
                                ...filteredArr,
                              ]
                              }
                          ]
                        })
      

                        let newJobs = this.state.newJobs
                        let filteredJobs = docData.jobs.filter(job => job.jobId !== currentJob);
                        let jobsCombine = [...filteredJobs,...newJobs]
                        let currentTask = this.state.currentTask
                        let jobs = jobsCombine.map((job) => {
                            return {...job, tasks: job.tasks.filter((task) => task.logId !== this.props.currentTask.logId)}
                          })
          
                        //send payload
                        
                              setTimeout(()=>{
                                queryClientData(client).update({
                                  jobs,
                                  currentTask:{
                                    ...currentTask,
                                    ...data
                                  }
                                })
                              },300)
                            
                            console.log('Task Resume Logged')

                    }
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

      resetCurrentJob =(e)=>{
        e.preventDefault();
        let client = this.props.name;
        this.setState({
          data:{
            ...this.state.data,
            job:''
          }
        })
        queryClientData(client).update({
          currentJob:null,
          currentJobName:''
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
        let logId = Date.now()
        let {timerStart,timerTime} = this.state;
        let rate = this.state.data.rate
        let scale = rate/3600000
        let total = scale * timerTime


        this.setState ({ 
          data: {
            ...this.state.data,
            logTime:newLog,
            logId,
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
          let client = this.props.name
          let clientOptions = this.state.clientOptions
          let clientColor = clientOptions.clientColor

          queryClientData(client).update({ 
            options:{
              ...clientOptions,
              clientColor
            }
            
        }); }, 300);
      }

      
    handleClientToggle = (e) => {
      e.preventDefault()
    
      let data = this.state.data
      getRate().then((doc) => {
        if (doc.exists) {
          let rate = doc.data().globalRate
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
    let client = this.props.name
   
    this.setState({
      optionToggle:false,
      colorToggle:false,
      deleteToggle:false,
    });

    queryClientData(client).update({
      currentTask:0
    })
   }


   handleDeleteConfirm=(e)=>{
    e.preventDefault()

    this.setState({
        deleteClientInput:e.target.value,
    })

   }

      handleDeleteClient=()=>{
        let name = this.props.name
        let {currentUser} = app.auth()
        let userUid = currentUser.uid
        deleteClient(userUid,name)
      }

      handleCurrentJob=(e)=>{
        e.preventDefault()
        let jobName = this.props.currentJobName
        let client = this.props.name;
        let jobId = e.target.getAttribute('value');
        let job = e.target.getAttribute('id');
        let data = this.state.data
        // let {jobId,job} = this.props;
        this.setState(state  => ({
          selectedJob:jobId,
          selectedJobName:job,
          [jobId]: !this.state[jobId]
        }));
        queryClientData(client).update({
            currentJob:jobId,
            currentJobName:job
          })
       }
  

      handleRestoreJob=()=> {
        let db = app.firestore();
        let client = this.props.name;
      
        getClientData(client).then((doc) => {
            if (doc.exists) {
              db.settings({
                timestampsInSnapshots: true
              });
              
              let jobsData = this.props.jobs
              let existingArchive = this.props.archivedJobs
              let selectedJob = this.state.currentJob
              
              // doc.data().archivedJobs
              
              // filter selected job from array
              let jobsArchived = existingArchive.filter(job => job.jobId === selectedJob);
              let jobs = [...jobsData,...jobsArchived]
    
              queryClientData(client).update({
                jobs
              })
    
              setTimeout(()=>{
                let archivedJobs = existingArchive.filter(job => job.jobId !== selectedJob);
                queryClientData(client).update({
                  archivedJobs
                })
                console.log('Archived Updated')
              },300)
             
            }
            else {
              console.log('no such document')
            }         
          })
    }
    

    render() {
        let {name,jobs,archivedJobs,currentTask,currentJob,currentJobName} = this.props
        let {timerTime,clientToggle,optionToggle,deleteToggle,colorToggle,selectedJob,existingJobs,timerOn} = this.state
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

                  </div>
                  {name} {job}
                  <span>{hours} </span>
                  Hrs
                  <span>{minutes} </span>
                  Mins
                  <span>{seconds} </span>
                  Secs
                  <span className="clpanel__rate">
                      $ {total.toFixed(2)}
                  </span>
                  <div style={logStatus} className="client-log">
                          <div
                              className="client__timer-button"
                              onMouseDown={this.handleLog}
                              onMouseUp={this.handleStoreData}>
                              {/* <GrShare/> */}Log
                          </div>
                      </div>
              </div>
            </div>
                {clientToggle === name ? <h3 className={"client__name "+clientOptions.clientColor} onClick={this.handleClientToggle} onMouseUp={this.handleClearToggles} id=''>{name}</h3> : <h3 className={"client__name "+clientOptions.clientColor} onClick={this.handleClientToggle} id={name}>{name}</h3>}
                
                {clientToggle === name ? 
                <> 
                
                <div className="clpanel" style={styles.max}>
                  
                { colorToggle && !deleteToggle ?
                    <div className="clpanel__optiondash">
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
                      <div className="clpanel__archivedjobs" >  
                          <span onClick={this.handleToggle} value={'togglearchive'} className="existingjobs__newtask theme--button theme-bsml" style={{zIndex:3 }}><RiArchiveLine  /></span>
                          { this.state.togglearchive ?
                                  <div className="clpanel__archivedpanel">
                                      <h2>Archived Jobs</h2>
                                      <ul>
                                          {this.props.archivedJobs.map((aJob) => { let aJobProps = {
                                          ...aJob,
                                          key:aJob.jobId } 
                                          return  <ArchivedJob {...aJobProps} 
                                          client={name}
                                          // archivedJobs={archivedJobs} 
                                          jobs={existingJobs}
                                          />
                                          }) }
                                      </ul>
                                  </div>
                              : null }  
                              <div  onClick={this.handleToggle} style={{display: this.state.togglearchive ? 'block' : 'none' }} className="archived-overlay"  value={'togglearchive'}></div>
                        </div>
                     </div>
                   
                    : null }

          
                    <div onClick={this.resetCurrentJob} className="clpanel__clientdash">

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
                  
                    <div 
                   
                    className="clpanel__task">
                      { currentJob === null ? <input
                            style={inputStatus}
                            value={job}
                            onClick={this.handleClearToggles}
                            onChange={this.handleNewJobInput}
                            onFocus={this.resetCurrentJob}
                            name='nj'
                            className="task__input"
                            placeholder="Job Name..."/>: null }
                            { currentTask === 0 ?  <input
                            style={inputStatus}
                            value={task}
                            onClick={this.handleClearToggles}
                            onChange={this.handleNewTaskInput}
                            name='nt'
                            className="task__input"
                            placeholder="Task Name..."/> : null }
                           
                        { (job === '' && currentTask === 0) || (timerOn === true) ? null :
                        <div style={inputStatus, {marginLeft:'0em'}} className="clpanel__control" onClick={this.startTimer}>{ currentTask === 0 || currentJob === null ? <span>Start</span> :<span>Resume Task</span> }</div>
                        }
                        <div className="clpanel__timer" style={timeStatus}>
                            <span>{job}</span>
                            <span>{task}</span>
                            <span>{startTime}</span>
                        </div>
                        <div className="clpanel__timer" onChange={this.timeKeeper} style={timeStatus}>
                        <span className="clpanel__time">{hours}</span> Hrs : <span className="clpanel__time">{minutes}</span> Mins : <span className="clpanel__time">{seconds}</span> Secs at ${rate} per hour<span className="clpanel__rate" style={logStatus}>/ $ {total.toFixed(2)}</span>
                        </div>
          
                        <span
                            style={logStatus}
                            className="clpanel__control"
                            onMouseDown={this.handleLog}
                            onMouseUp={this.handleStoreData}>Log</span>

                    </div>
                
                  <Scrollbar className="clpanel__tasklist" style={{ padding: '1em' }}>
                        { this.props.jobs.map((job) => { let jobProps = { ...job, key:job.jobId }
                        return <Job {...jobProps} jobs={jobs} name={name} currentTask={this.props.currentTask} resetCurrentJob={this.props.resetCurrentJob} currentJob={this.props.currentJob} styling={this.state.styling} timerOn={timerOn} startTimer={this.startTimer} handleNewTaskInput={this.handleNewTaskInput}  /> }) }
                        <div onClick={this.resetCurrentJob} className="spacer"></div>
                   </Scrollbar>
                </div>
                <div onClick={this.handleClientToggle} onMouseUp={this.resetCurrentJob} onMouseDown={this.handleClearToggles} className="overlay"></div> 
                </>
                : 
                <div className={"client__jobInfo"} style={styles.hide}  ></div>}
          </div>
        )
    }
}


export default Clients