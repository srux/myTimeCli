import React, { Component } from 'react'
import app from "firebase";
// plugins
import { IoMdRemove} from "react-icons/io";

class Task extends Component {
    constructor(props) {
        super(props)
            this.state={  
            }
    }

    handleRemoveTask=()=> {

        // const db = app.firestore();
        // const {currentUser} = app.auth()
        // const userUid = currentUser.uid
        // const client = this.props.client
        // const tasks = this.props.tasks
        // const taskId = this.props.id

        // let taskRef = db.collection('users').doc(userUid).collection('clients').doc(client)

       
        // console.log(taskRef,'task')

    }
 

    render() {
           let {client,job,tasks,task,startTime,logTime,timerTime,money} = this.props;
           // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
           let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
           let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
           let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
           
    

        return (

                <div className="existingjobs__jobitem">
                    <div>{task}</div>
                    <div>Start Time: {startTime}</div>
                    <div className="jobitem__breaks">
             
                        Breaks:
                        <div  className="jobitem__pauses">
                            
                            {this.props.pauses.map((pause,i) => <div key={i}>{pause} to </div>)}
                        </div>
                        <div  className="jobitem__resumes">
                            {this.props.resumes.map((resume,i) => <div key={i}>{resume}</div>)}
                        </div>
                    </div>

                    <div>Log Time: {logTime}</div>
                    <div>Total Time:
                    { (hours === '00') ? null : ' '+hours+' Hrs'  }{ (minutes === '00') ? null : ' '+minutes+' Mins'  } {seconds} Secs</div>
                    <div>$: {Math.round(money * 100) / 100}</div>
                    <span onClick={this.handleRemoveTask} className="jobitem__remove"><IoMdRemove/></span>
                </div>
        )
    }
}


export default Task