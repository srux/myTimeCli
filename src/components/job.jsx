import React, { Component } from 'react'

let styles = {
    close:{
      display:'none',
    },
    open:{
      display:'initial',
    }
  }

class Job extends Component {
    constructor(props) {
        super(props)
            this.state = {
                toggle:styles.close,
                
            }
    }


    handleToggle=()=> {

        let open = styles.open
        let close = styles.close

        if ( this.state.toggle === close) {
            this.setState({
                toggle:open
            })
            console.log('open')
        }
        else {
            this.setState({
                toggle:close
            }) 
            console.log('hide')
        }
        console.log('hit')
    }

    

    render() {
          let {toggle} = this.state
          let {client,task,startTime,logTime,timerTime} = this.props;
          // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);
          let seconds = ("0" + (Math.floor(timerTime / 1000) % 60)).slice(-2);
          let minutes = ("0" + (Math.floor(timerTime / 60000) % 60)).slice(-2);
          let hours = ("0" + Math.floor(timerTime / 3600000)).slice(-2);

        return (
            <div className="existingjobs__jobitem" onClick={this.handleToggle}>{client}
              <div style={toggle}>
                <div>Task: {task}</div>
                
                <div className="jobitem__breaks">

                    Breaks:
                    <div  className="jobitem__pauses">
                        {/* {this.props.pauses.map((pause,i) => <div key={i}>{pause} to </div>)} */}
                    </div>
                    <div  className="jobitem__resumes">
                        {/* {this.props.resumes.map((resume,i) => <div key={i}>{resume}</div>)} */}
                    </div>
                </div>
                <div>Start Time: {startTime}</div>
                <div>Log Time: {logTime}</div>
                <div>Total Time:
                { (hours === '00') ? null : {hours}+' Hrs'  }{ (minutes === '00') ? null : {minutes}+' Mins'  } {seconds} Secs</div>
                </div>
            </div>
        )
    }
}


export default Job