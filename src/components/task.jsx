import React, { Component } from 'react'
import app from "firebase";

// api
import {queryClientData,getClientData} from '../api/data'

// plugins
import { GiSaveArrow } from "react-icons/gi";
import { RiDeleteBackFill,RiAddFill,RiSubtractLine,RiCloseLine,RiPlayLine,RiInboxArchiveLine,RiEdit2Line} from "react-icons/ri";
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
        taskData:{
          ...rest
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

    handleEditTask=()=> {

      let db = app.firestore();
      let client = this.props.client;

      getClientData(client).then((doc) => {
          if (doc.exists) {
            db.settings({
                timestampsInSnapshots: true
            });
          
            console.log('edit task')
  
            // update database
            
            // queryClientData(client).update({
            //   jobs
            // })

          }
          else {
            console.log('no such document')
          }         
        })
  }





    handleCurrentTask = (e) => {  
        e.preventDefault();
        let client = this.props.client;

        let taskProps = this.props
        let taskData = taskProps
        const {currentTask,currentJob,jobs,...rest} = taskData
     
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

           <div className="existingjobs__jobitem job-edit"  style={{  backgroundColor: cId === id ? 'black': '#efefef' , color: cId === id ? 'white' : null }} onClick={this.handleCurrentTask}>
                     {/* { toggleEdit ?
                     <>
                     <span  className="jobitem__edit"><GiSaveArrow onClick={this.handleEditTask} />   </span>
                     <div className="jobitem__name"><input onChange={this.handleUpdateInput} style={{width:'8em'}} type="text" id="task"  placeholder={task}/></div>
                     <div className="jobitem__start">Start: <input onChange={this.handleUpdateInput} style={{width:'8em'}} type="text" id="startTime" placeholder={startTime}/></div>
 
                     <div className="jobitem__date">Logged: <input onChange={this.handleUpdateInput} style={{width:'8em'}} type="text" id="logTime" placeholder={logTime}/></div>
                     <div className="jobitem__time-money">
                       <div className="jobitem__time" style={{display:'flex'}}>
                       <input onChange={this.handleUpdateInput} style={{width:'4em'}} type="number" id="hours" placeholder={hours}/> Hours <input onChange={this.handleUpdateInput} style={{width:'4em'}} id="minutes"   type="number" placeholder={minutes}/> Mins <input onChange={this.handleUpdateInput} style={{width:'4em'}}  id="seconds" type="number" placeholder={seconds}/>Secs</div>
                       <div className="jobitem__money">$:  <input onChange={this.handleUpdateInput} style={{width:'7em'}}  id="money" type="number" placeholder={Math.round( money * 100) / 100}/></div>
                       <div className="jobitem__removeblock">
                     </div>
                   
                     </div>
                     </>
                     : 
                     <> */}
                     
                     <div className="jobitem__name">{task}</div>
                     <div className="jobitem__start">Start: {startTime}</div>

                     <div className="jobitem__date">Logged: {date}</div>
                     <div className="jobitem__time-money">
                       <div className="jobitem__time">
                       { (hours === '00') ? null : ' '+hours+' Hrs'  }{ (minutes === '00') ? null : ' '+minutes+' Mins'  } {seconds} Secs</div>
                       <div className="jobitem__money">$: {Math.round(money * 100) / 100}</div>
                       <div className="jobitem__removeblock">
                     </div>
                     <span  className="jobitem__edit"><RiEdit2Line onClick={this.handleToggle} value="toggleEdit" />   </span>
                     { toggleremove ? <span className="jobitem__remove-confirm">Are you sure you want to delete this task? <div className="theme-button alert-confirmation" value={'toggleremove'} onClick={this.handleToggle}> NO </div><div className="theme-button alert-confirmation"  onClick={this.handleRemoveTask}>YES</div></span> : <span  className="jobitem__remove"><RiDeleteBackFill onClick={this.handleToggle} value={'toggleremove'}/>   </span>}
                     </div>
                     {/* </> } */}
                </div>
        )
    }
}


export default Task