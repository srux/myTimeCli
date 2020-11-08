import React, { Component } from 'react'
import app from "firebase";


import Task from './task';

// plugins
import { RiAddFill,RiPlayLine } from "react-icons/ri";

const styles = {
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

class Job extends Component {
    constructor(props) {
        super(props)
            this.state={
          
              selectedJob:'' 
             
            }
    }

    componentDidMount(){

    }


    handleCurrentJob=(e)=>{
        e.preventDefault();
        let {job,jobId} = this.props;
      
        this.setState({
          selectedJob:jobId,
          selectedJobName:job
        })
        
    }

    handleToggle=(e)=>{
      e.preventDefault()
      let target = e.target.getAttribute('value');
     
      this.setState(state  => ({
        [target]: !this.state[target]
      }));
     }

     

    
    handleCurrentJob=(e)=>{
      e.preventDefault()
      
      let db = app.firestore();
      let {currentUser} = app.auth()
      let userUid = currentUser.uid
      let client = this.props.name;
      const clientRef = db.collection('users').doc(userUid).collection('clients').doc(client)

      let target = e.target.getAttribute('value');
      let {jobId,job} = this.props;
      this.setState(state  => ({
        selectedJob:jobId,
        selectedJobName:job,
        [target]: !this.state[target]
      }));
        clientRef.update({
          currentJob:jobId,
          currentJobName:job
        })
     }



    render() {
           let {job,jobId} = this.props;
           let date = new Date(jobId).toString().slice().replace(/\GMT(.*)/g,"");
           let {currentJob} = this.props
           let {selectedJob} = this.state


        return (
            <div className="existingjobs__jobContainer">
                <div onClick={this.handleCurrentJob} className="existingjobs__jobtab">
                <span>{job}</span>
                <div className="existingjobs__details">
                    <div className="job__newtask">
                    <div onClick={this.handleCurrentJob} value={jobId} className="existingjobs__newtask theme--button theme-bsml"><RiAddFill/></div>
                    { selectedJob === currentJob ? <><input type="text" onChange={this.props.handleNewTaskInput} placeholder="New Task" className="existingjobs__newtask"/>
                    <div onClick={this.props.startTimer} className="existingjobs__newtask theme--button theme-bsml"><RiPlayLine/></div></> : null }
                    </div>
                    
                    <span className="existingjobs__jobdate">{date}</span>
                  
                </div>
                
                </div>                
                <div className="existingjobs__taskContainer">  
                { this.props.tasks.map((task) => { let taskProps = { ...task, key:task.id }
                        return <Task {...taskProps} currentJob={this.props.currentJob}/> }) }</div>
               
            </div>
        )
    }
}


export default Job