import React, { Component } from 'react'
import app from "firebase";

//api
import {useAuth} from '../api/auth'

import Task from './task';

// plugins
import { IoMdRemove} from "react-icons/io";

class Jobs extends Component {
    constructor(props) {
        super(props)
            this.state={
              currentJob:''  
            }
    }


    handleCurrentJob=(e)=>{
        e.preventDefault();
        this.setState({
            currentJob:e.target.value
        })
    }
 

    render() {
           let {job} = this.props;
           // let centiseconds = ("0" + (Math.floor(timerTime / 10) % 100)).slice(-2);


        return (
            <div className="existingjobs__jobContainer">
                <span className="existingjobs__jobtab">{job}</span>
                 { this.props.tasks.map((task) => { let taskProps = { ...task, key:task.id }
                        return <Task {...taskProps}/> }) }
            </div>
        )
    }
}


export default Jobs