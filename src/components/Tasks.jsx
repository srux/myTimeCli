import React, { Component } from 'react'

class Tasks extends Component {
    constructor(props) {
        super(props)
    }


    render() {
           let {client,task,startTime,logTime,timerTime,money} = this.props;
           // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
           let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
           let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
           let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);
           
        return (
            <div className="existingjobs__jobitem">{client}
          
              <div>Task: {task}</div>
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
              </div>
        )
    }
}


export default Tasks