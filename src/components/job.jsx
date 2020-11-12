import React, { Component } from 'react'
import app from "firebase";


import Task from './task';

//api
import {queryClientData,getClientData} from '../api/data'

// plugins

import { RiAddFill,RiPlayLine,RiInboxArchiveLine } from "react-icons/ri";



class Job extends Component {
    constructor(props) {
        super(props)
            this.state={
              toggleremove:false,
              togglearchive:false,
              selectedJob:null
             
            }
    }

    componentDidMount(){
      let currentJob = this.state.props
      this.setState({
        selectedJob:currentJob
      })
    }


    handleCurrentJob=(e)=>{
        e.preventDefault();
        let {job,jobId} = this.props;
      
        this.setState({
          selectedJob:jobId,
          selectedJobName:job
        })
        
    }

    handleCurrentJob=(e)=>{
      e.preventDefault()
      
      let client = this.props.name;
      let target = e.target.getAttribute('value');
      let {jobId,job} = this.props;
      this.setState(state  => ({
        selectedJob:jobId,
        selectedJobName:job,
        [target]: !this.state[target]
      }));
      queryClientData(client).update({
          currentJob:jobId,
          currentJobName:job
        })
     }

     handleRemoveJob=()=> {
      let db = app.firestore();
      let client = this.props.name;
      getClientData().then((doc) => {
          if (doc.exists) {
            db.settings({
              timestampsInSnapshots: true
            });
            
            let jobsData = this.props.jobs
            let selectedJob = this.state.selectedJob
          
            // filter selected job from array
            let jobs = jobsData.filter(job => job.jobId !== selectedJob);
            console.log(jobs)
            queryClientData(client).update({
              jobs
            })
              
          }
          else {
            console.log('no such document')
          }         
        })
  }

  handleArchive=()=> {
    let db = app.firestore();
    let client = this.props.name;
  
    getClientData(client).then((doc) => {
        if (doc.exists) {
          db.settings({
            timestampsInSnapshots: true
          });
          
          let jobsData = this.props.jobs
          let selectedJob = this.state.selectedJob
          let existingArchive = doc.data().archivedJobs
          
          // filter selected job from array
          let jobsArchived = jobsData.filter(job => job.jobId === selectedJob);
          let archivedJobs = [...existingArchive,...jobsArchived]

          queryClientData(client).update({
            archivedJobs
          })

          setTimeout(()=>{
            let jobs = jobsData.filter(job => job.jobId !== selectedJob);
            queryClientData(client).update({
              jobs
            })
          },300)
         
        }
        else {
          console.log('no such document')
        }         
      })
}


  handleToggle=(e)=>{
    e.preventDefault()
    let target = e.target.getAttribute('value');
   
    this.setState(state  => ({
      [target]: !this.state[target]
    }));
   }

   handleDeleteConfirm=(e)=>{
    e.preventDefault()

    this.setState({
        deleteJobInput:e.target.value,
    })

   }

   handleDeleteClear=(e)=>{
    e.preventDefault()
    this.setState({
      deleteJobInput:'',
  })
   }




    render() {
        
           let {currentJob,job,jobId} = this.props
           let {togglearchive,
            // toggleremove,deleteJobInput,selectedJobName
           } = this.state
           let jobselect = jobId === currentJob
          //  let confirmDelete = deleteJobInput === selectedJobName 
           let date = new Date(jobId).toString().slice().replace(/\GMT(.*)/g,"");
           let tasks = this.props.tasks



           let total = tasks.reduce(function(prev, current) {
            return prev + +current.money
          }, 0);

          let totalTime = tasks.reduce(function(prev, current) {
            return prev + +current.timerTime
          }, 0);

          let seconds = ("0" + (Math.floor(totalTime / 1000) % 60)).slice(-2);
          let minutes = ("0" + (Math.floor(totalTime / 60000) % 60)).slice(-2);
          let hours = ("0" + Math.floor(totalTime / 3600000)).slice(-2);

         
        return (
            <div className="existingjobs__jobContainer">
                <div onClick={this.handleCurrentJob} style={  jobselect ?  {backgroundColor:'#fd4218'} : {backgroundColor:'#555', cursor:'pointer', borderRadius:'.3em'} } className="existingjobs__jobtab">
                <span>{job}</span>
                <div className="existingjobs__details">
                    {jobselect ?  <div className="job__newtask">
                    <div onClick={this.handleCurrentJob} value={jobId} className="existingjobs__newtask theme--button theme-bsml"><RiAddFill/></div>
                    { jobselect ? <><input type="text" onChange={this.props.handleNewTaskInput} placeholder="New Task" className="existingjobs__newtask"/>
                    <div onClick={this.props.startTimer} className="existingjobs__newtask theme--button theme-bsml"><RiPlayLine/></div></> : null }
                    </div>
                    : <div></div> }
                    {/* <div className="job__removeblock">
                    { toggleremove ? 
                      <span className="existingjobs__remove-confirm"> { !confirmDelete ? <div>Enter job name to confirm deletion</div> : null}
                        {confirmDelete ?  <span>Are you sure you want to delete this job?</span>: <input onChange={this.handleDeleteConfirm}  placeholder={selectedJobName} style={{borderRadius:'.3em', marginLeft:'1em'}} type="text"/>}   
                          {confirmDelete ? <div className="job__removebuttons" style={{display:'flex'}}><div className="theme-button alert-confirmation"  onClick={this.handleRemoveJob}>YES</div> <div className="theme-button alert-confirmation" value={'toggleremove'}  onClick={this.handleDeleteClear}> NO </div></div>: null}</span> 
                          : <span  className="existingjobs__newtask theme--button theme-bsml"><IoMdRemove onClick={this.handleToggle} value={'toggleremove'}/>   </span>}
                    </div> */}
                    <div className="job__details">
                    <div className="job__time"><span >{hours != '00' ? hours+' Hrs' : null }  {minutes} Mins {seconds} Secs </span> </div>
                    <div className="job__total"><span > $ {total.toFixed(2)}</span> </div>
                    {jobselect ? 
                    <div className="job__archiveblock">
                      
                   { togglearchive ? 
                      <span className="existingjobs__remove-confirm">
                        <span>Are you sure you want to archive this job?</span>   
                         <div className="job__removebuttons" style={{display:'flex'}}><div className="theme-button alert-confirmation"  onClick={this.handleArchive}>YES</div> <div className="theme-button alert-confirmation" value={'togglearchive'}  onClick={this.handleToggle}> NO </div></div></span> 
                          : <span  className="existingjobs__newtask theme--button theme-bsml"><RiInboxArchiveLine onClick={this.handleToggle} value={'togglearchive'}/>   </span>}
                   </div> : <span style={{width:'2em'}}> </span> }
                   </div>
                    <span className="existingjobs__jobdate">{date}</span>
                </div> 
               
                </div>
                { jobselect ?                 
                <div className="existingjobs__taskContainer">  
                { this.props.tasks.map((task) => { let taskProps = { ...task, key:task.id }
                        return <Task {...taskProps} currentJob={this.props.currentJob}/> }) }
                        </div>: null }
               
                 </div>
        )
    }
}


export default Job