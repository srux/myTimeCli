import React, { useState, useEffect,useContext } from "react";
import {ACTIONS} from '../../api/data-provider';
import {DataContext} from '../../api/data-provider';

const Timer = (props) => {
  const Context = useContext(DataContext)
  const c = Context.cli
  const timerOn = Context.cli.timeStatus

  useEffect(() => {
    let intervalId;

    if (timerOn) {
      
      intervalId = setInterval(() => {
        const secondCounter = c.timer.counter % 60;
        const minuteCounter = Math.floor(c.timer.counter / 60);
        
        Context.dispatch({type:ACTIONS.UPDATE_TIMER,payload:{counter:c.timer.counter+1,second:secondCounter,minute:minuteCounter}})
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerOn, c.timer.counter]);



  return (
    <div className="container">

        {c.timer.counter !== 0 ? <span className="text client-date">{c.timer.date}</span> : null }
         
        <div className="time">
        {timerOn ? `${`On the clock: `}` : null }
        {timerOn && c.timer.minute === 0 && c.timer.second === 0 ?  <span>Loading</span> : null}
            <span className="minute">{c.timer.minute !== '00' ? `${c.timer.minute} Mins :` : null} </span>
            <span className="second">{c.timer.second !== '00' ? `${c.timer.second} Secs` : null}</span>
        </div>
        
    </div>
  );
};

export default Timer;
