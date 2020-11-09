import React, { Component } from 'react'
import app from "firebase";

// plugins
import { RiDeleteBackFill} from "react-icons/ri";

class Task extends Component {
    constructor(props) {
        super(props)
            this.state={  
                toggleremove:false,
            }
    }

    componentDidMount(){
        const db = app.firestore();
        const userUid = app.auth().currentUser.uid
        const client = this.props.client;
        const id = this.props.id
        const clientRef = db.collection('users').doc(userUid).collection('clients').doc(client)
        clientRef.get().then((doc) => {
          if (doc.exists) {
            let data = doc.data().jobs
            this.setState({
                id,
             jobs:{
              ...data
             } 
            })
          }
          else {
            console.log('no such document')
          }
        })
    }
    

    // removeIdea = (id) => {
    //     var ideas = this.state.ideas;
    //     var filtered = ideas.filter((idea) => {
    //       return idea.id !== id
    //     });
    //     this.setState ({
    //       ideas: filtered
    //     });
    //   }
      

    handleRemoveTask=()=> {
        const db = app.firestore();
        const userUid = app.auth().currentUser.uid
        const client = this.props.client;
        const clientRef = db.collection('users').doc(userUid).collection('clients').doc(client)

        clientRef.get().then((doc) => {
            if (doc.exists) {
              console.log('doc data', doc.data())
              let jobsData = doc.data().jobs
              let currentTask = this.state.id
        
              //filter tasks from jobs list
              const jobs = jobsData.map((job) => {
                return {...job, tasks: job.tasks.filter((task) => task.id != currentTask)}
              })
              // update database
              clientRef.update({
                jobs
              })

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
  

 

    render() {
           let {client,job,tasks,task,startTime,logTime,timerTime,money} = this.props;
           // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
           let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
           let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
           let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
           let {toggleremove} = this.state
    

        return (

                <div className="existingjobs__jobitem">
                    <div className="jobitem__name">{task}</div>
                    <div className="jobitem__time">Start Time: {startTime}</div>
                    <div className="jobitem__breaks">
             
                        Breaks:
                        <div  className="jobitem__pauses">
                            
                            {this.props.pauses.map((pause,i) => <div key={i}>{pause} to </div>)}
                        </div>
                        <div  className="jobitem__resumes">
                            {this.props.resumes.map((resume,i) => <div key={i}>{resume}</div>)}
                        </div>
                    </div>

                    <div className="jobitem__time">Log Time: {logTime}</div>
                    <div className="jobitem__time">Total Time:
                    { (hours === '00') ? null : ' '+hours+' Hrs'  }{ (minutes === '00') ? null : ' '+minutes+' Mins'  } {seconds} Secs</div>
                    <div>$: {Math.round(money * 100) / 100}</div>
                    <div className="jobitem__removeblock">
                    { toggleremove ? <span className="jobitem__remove-confirm">Are you sure you want to delete this task? <div className="theme-button alert-confirmation" value={'toggleremove'} onClick={this.handleToggle}> NO </div><div className="theme-button alert-confirmation"  onClick={this.handleRemoveTask}>YES</div></span> : <span  className="jobitem__remove"><RiDeleteBackFill onClick={this.handleToggle} value={'toggleremove'}/>   </span>}
                    </div>

                </div>
        )
    }
}


export default Task