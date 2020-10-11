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
        let {client,task,startTime,pauses,resumes,logTime} = this.props
        return (
            <li className="existingjobs__jobitem" onClick={this.handleToggle}>{client}
              <span style={toggle}>
                <span>Task: {task}</span>
                
                <span className="jobitem__breaks">
                    Breaks:
                    <span className="jobitem__pauses">
                        {pauses} <span/> {resumes}
                    </span>

                </span>
                <span>Start Time: {startTime}</span>
                <span>Log Time: {logTime}</span>
                <span>Time: {logTime}</span>
                </span>
            </li>
        )
    }
}


export default Job