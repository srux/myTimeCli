import React, { Component } from 'react'
import app from "firebase";

// api
import {queryClientData,getClientData} from '../api/data'

// plugins
import { GiSaveArrow } from "react-icons/gi";
import { RiDeleteBackFill,RiAddFill,RiSubtractLine,RiCloseLine,RiPlayLine,RiInboxArchiveLine,RiEdit2Line,RiArrowGoBackLine} from "react-icons/ri";
import { TiArrowLeftThick,TiTick,TiArrowBackOutline } from "react-icons/ti";

class Task extends Component {
    constructor(props) {
        super(props)
            this.state={  
                toggleremove:false,
                toggleEdit:false,
                currentTask:{
                  id:0
                }
            }
    }

    componentDidMount() {
      let taskProps = this.props
      let taskData = taskProps
      const {currentTask,currentJob,jobs,...rest} = taskData

      this.setState({
        jobs,
        taskData:{
          ...rest,
          logId:Date.now()
        }
      })

    }


    handleRemoveTask=()=> {
        let db = app.firestore();
        let client = this.props.client;

        getClientData(client).then((doc) => {
            if (doc.exists) {
              db.settings({
                  timestampsInSnapshots: true
              });
              let jobsData = doc.data().jobs
              let currentTask = this.props.currentTask.id
      
              //filter tasks from jobs list
              let jobs = jobsData.map((job) => {
              return {...job, tasks: job.tasks.filter((task) => task.id !== currentTask)}
              })
              // update database
              queryClientData(client).update({
                jobs
              })

            }
            else {
              console.log('no such document')
            }         
          })
    }

    // updateMessage(newTask) {
    //   this.setState(prevState => {
    //     const tasks = [...prevState.jobs.tasks];
    //     const index = tasks.findIndex(o => o.id === this.props.currentTask.id);
  
    //     tasks[index] = newTask;
  
    //     return { tasks };
    //   });
    // }

    handleEditTask=()=> {
      let db = app.firestore();
      let client = this.props.client;

      getClientData(client).then((doc) => {
          // let docData = doc.data()
          let jobsData = doc.data().jobs
          let currentJob = this.props.currentJob
          // define selected job
          let selectedJob = jobsData.find(j => j.jobId === currentJob)
          // define tasks of selected job
          let tasks = selectedJob.tasks
          // create task
          let data = this.state.taskData

    
            this.setState({ 
              tasks:[
                ...tasks,
                {
                ...data
              }
            ]
        })
    
        

          let taskArr = selectedJob.tasks
          let filteredArr = [...new Map(taskArr.map(item => [item.id , item])).values()]
          filteredArr.push(data) 
    
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
       
    
          console.log(filteredArr,'filteredARr')
    
          let newJobs = this.state.newJobs
          let filteredJobs = jobsData.filter(job => job.jobId !== currentJob);
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
                console.log('EDITED')
                this.setState({
                  toggleEdit:false,
                })
      })
  }





    handleCurrentTask = (e) => {  
        e.preventDefault();
        let client = this.props.client;
        
        let taskProps = this.props
        let taskData = taskProps
        const {currentTask,currentJob,jobs,...rest} = taskData

        this.setState({
          jobs
        })

         if (this.props.currentTask.id !== this.props.id){
          this.setState({
            toggleEdit:false,
          })
         }
     
          getClientData(client).then((doc) => {
            if (doc.exists) {
              let currentTask = {...rest}
              queryClientData(client).update({
                currentTask
              })
            
            }
            else {
              console.log('no such document')
            }
        })
      console.log('rt')
        
    }

    handleUpdateInput =(e)=> {
      let taskData = this.state.taskData
      let target = e.target.getAttribute('id');
      this.setState({
        taskData:{
          ...taskData,
          [target]:e.target.value
        }
      });
    }

    
  

    
    handleToggle=(e)=>{

        e.preventDefault()
        let target = e.target.getAttribute('value');
       
        this.setState(state  => ({
          [target]: !this.state[target]
        }));
       }

  

 

    render() {
           let {task,startTime,logTime,timerTime,money,id,logId} = this.props;
           let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
           let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
           let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
           let {toggleremove,toggleEdit} = this.state
           let cId = this.props.currentTask.id
           let date = new Date(logId).toString().slice().replace(/\GMT(.*)/g,"");
        return (

           <div className="existingjobs__jobitem job-edit"  style={{  backgroundColor: cId === id ? 'black': '#efefef' , color: cId === id ? 'white' : null,cursor: cId === id ?  null : 'pointer' }} onClick={this.handleCurrentTask}>
                     { cId === id && toggleEdit ?
                     <>
                   
                     <div className="jobitem__name"><input onChange={this.handleUpdateInput} style={{width:'8em'}} type="text" id="task"  placeholder={task}/></div>
                     <div className="jobitem__start">Start: <input onChange={this.handleUpdateInput} style={{width:'8em',marginLeft:'.3em'}} type="text" id="startTime" placeholder={startTime}/></div>
 
                     <div className="jobitem__date">Logged: <input onChange={this.handleUpdateInput} style={{width:'8em',marginLeft:'.3em'}} type="text" id="logTime" placeholder={logTime}/></div>
                     <div className="jobitem__time-money">
                       <div className="jobitem__time" style={{display:'flex'}}>
                       <input onChange={this.handleUpdateInput} style={{width:'4em'}} type="number" id="hours" placeholder={hours}/> Hours <input onChange={this.handleUpdateInput} style={{width:'4em',marginLeft:'.3em'}} id="minutes"   type="number" placeholder={minutes}/> Mins <input onChange={this.handleUpdateInput} style={{width:'4em',marginLeft:'.3em'}}  id="seconds" type="number" placeholder={seconds}/>Secs</div>
                       <div className="jobitem__money">$:  <input onChange={this.handleUpdateInput} style={{width:'7em'}}  id="money" type="number" placeholder={Math.round( money * 100) / 100}/></div>
                       <div className="jobitem__removeblock">
                     </div>
                     
                     <span  className="jobitem__edit" style={{marginRight:'.5em',fontSize:'1.5em'}}><TiArrowBackOutline value="toggleEdit" onClick={this.handleToggle} />   </span>
                     <span  className="jobitem__edit" style={{marginRight:'0em',fontSize:'1.6em'}}><TiTick onClick={this.handleEditTask} />   </span>
                     </div>
                     </>
                     : 
                     <>
                     
                     <div className="jobitem__name">{task}</div>
                     <div className="jobitem__start">Start: {startTime}</div>

                     <div className="jobitem__date">Logged: {date}</div>
                     <div className="jobitem__time-money">
                       <div className="jobitem__time">
                       { (hours === '00') ? null : ' '+hours+' Hrs'  }{ (minutes === '00') ? null : ' '+minutes+' Mins'  } {seconds} Secs</div>
                       <div className="jobitem__money">$: {Math.round(money * 100) / 100}</div>
                       <div className="jobitem__removeblock">
                     </div>
                     { cId === id ? <span  className="jobitem__edit"><RiEdit2Line style={{fontSize:'.95em'}} onClick={this.handleToggle} value="toggleEdit" />   </span>: null}
                     { toggleremove ? <span className="jobitem__remove-confirm">Are you sure you want to delete this task? <div className="theme-button alert-confirmation" value={'toggleremove'} onClick={this.handleToggle}> NO </div><div className="theme-button alert-confirmation"  onClick={this.handleRemoveTask}>YES</div></span> : <span  className="jobitem__remove"><RiDeleteBackFill onClick={this.handleToggle} value={'toggleremove'}/>   </span>}
                     </div>
                     
                     </> }
                </div>
        )
    }
}


export default Task