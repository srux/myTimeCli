import React,{useState,useContext,useEffect} from 'react';
import Timer from './functions/timer';

import {DataContext,ACTIONS} from '../api/data-provider';

import { TiArrowBack,TiChevronLeft,TiPlus,TiMinus } from "react-icons/ti";
import { BiTrashAlt } from "react-icons/bi";


//functions
import useToggle from '../components/functions/useToggle'


const ClientActivity = (props) => {
     const Context = useContext(DataContext)
     const timerOn = Context.cli.timeStatus

     const counter = props.cli.timer.counter

     const t = props.cli.timer
     const c = Context.cli
     
     let time = new Date().toLocaleTimeString()
     let year = new Date().toDateString();

     const [isOn, toggleIsOn] = useToggle(timerOn);
     const [jobData,setJobData] = useState({client:props.name,name:c.job.name,id:c.job.id,created:c.job.created})
     const [currJob,setCurrJob] = useState({id:0})

    const jobs = Object.entries(props.jobs)
      
     const handleToggleCLient = () => {
        props.dispatch({type:ACTIONS.TOGGLE_CLIENT,payload:{id:0}})
      }

      const handleDelete = () => {
        props.dispatch({type:ACTIONS.DELETE_CLIENT,payload:{id:props.id}})
      }


      const handleSaveJob = () => {
          let jobs = props.jobs
          let j = jobData

          props.dispatch({type:ACTIONS.LOG_TIME,payload:{jobs,job:{...j,client:props.name,name:j.name,counter:t.counter,second:t.second,minute:t.minute}}})
          props.dispatch({type:ACTIONS.TIMER_STATUS,payload:{timeStatus:false}})
      }

      const handleTimerStatus = () => {
          let jobs = props.jobs
          let j = jobData
          props.dispatch({type:ACTIONS.LOG_TIME,payload:{jobs,job:{...j,client:props.name,name:j.name,counter:t.counter,second:t.second,minute:t.minute}}})
          props.dispatch({type:ACTIONS.TIMER_STATUS,payload:{timeStatus:!timerOn}})
      }

      const handleSelectJob = (job) => {
        console.log(job)
          const setJob = async () => {
            setJobData(job)
          }
          setJob().then( () => {
            props.dispatch({type:ACTIONS.UPDATE_TIMER,payload:{counter:job.counter,second:job.second,minute:job.minute}})
            props.dispatch({type:ACTIONS.UPDATE_JOB,payload:{...jobData}})
          })
      }

      const handleSetName = (e) => {
        setJobData({name:e.target.value,id:Date.now(),created:`${year} at ${time}`})
      }

      const handleToggle = () => {
        if (jobData.job !== '') {
            toggleIsOn();
        } else {
            toggleIsOn();
        }
      }
      useEffect(() => {
        setJobData({...jobData,counter:t.counter,second:t.second,minute:t.minute})
        props.dispatch({type:ACTIONS.UPDATE_JOB,payload:{...jobData}})
      },[t])

    return (
        <div className="view client-activity">
          
            <div className="view client-info">
                <div className="text" style={ props.color !== '#f1f1f1' ? 
                  {backgroundColor:props.color,padding:'.7em 1em',borderRadius:'.2em'} : 
                  {backgroundColor:props.color,padding:'.7em 1em',borderRadius:'.2em',color:'#000'} }>
                  <div className="view client-back"
                      style={  props.color !== '#f1f1f1' ? {color:props.color} : {color:'#555'}}
                      onClick={handleToggleCLient}><TiChevronLeft/></div>
                  <span className="text" style={props.color !== '#f1f1f1' ? { color:'#fafafa' } : {color:'#000'}}>{props.name}</span>
                  <div className="view client-r-options" >
                    <button className="button-icon" onClick={handleDelete}><BiTrashAlt/></button>
                  </div>
                </div> 
              
              
            </div>
            <div className="view client-jobs">
              <div className="view client-timer">
                <button className="add" style={{borderRadius:'.2em'}} onClick={handleToggle}> { isOn ? <TiArrowBack/> : <TiPlus/> }</button>
                { isOn  ? <><input style={ timerOn ? {pointerEvents:'none',backgroundColor:'transparent',boxShadow:'none',border:'none'} : null} placeholder={ timerOn && c.job.name !==''  ? c.job.name : 'Job name...'} type="text" onChange={handleSetName}/> 
                { jobData.job !== '' || c.activeCli === c.id ? 
                  <div className="buttons">
                      { !timerOn ?   
                      <button onClick={handleTimerStatus} className="start">
                        Start
                      </button>
                    : null } 
                      { (jobData.client === '' ) ? 
                      <button onClick={handleSaveJob} className="reset">
                          Save Job
                      </button> : 
                      <button onClick={handleSaveJob} className="reset">
                          Log Time
                      </button> }
                      
                  </div>
                : null }
                {/* <Timer id={props.id} name={props.name} job={jobData.job} jobs={props.jobs} /> */}
                </>
                : null }
              </div>
              {
                jobs.map((i) => {
                  let j = i[1]
                  return <div className="view job" key={j.id}  onClick={ timerOn === true ? null : () => handleSelectJob(j)}   style={c.job.id === j.id ? {backgroundColor:props.color,color:'#f1f1f1'} : {cursor:'pointer'}}> {j.name} : {j.created}  
                  { c.job.id !== j.id ? <span>{'  '+j.minute+' Mins'} {j.second+' Secs'}</span> :  <span>{'  '+c.timer.minute+' Mins'} {c.timer.second+' Secs'}</span> } 
                  </div>
                })
              }
            </div>
        </div>
    );
}

export default ClientActivity;
