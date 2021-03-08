import React, {useState,useEffect,useContext} from 'react';

import {ACTIONS} from '../api/data-provider'
import {DataContext} from '../api/data-provider';
//plugins
// import { TiArrowBack,TiPlus,TiMinus } from "react-icons/ti";

//functions



const Client = (props,cli) => {
  const Context = useContext(DataContext)
  
  const handlePayload = () => {
    Context.dispatch({type:ACTIONS.TOGGLE_CLIENT,payload:{id:props.id,toggles:{cliPanel:true}}})
    
  }

  return (
    <div className="view client-tab" style={ props.cli.id === props.id ? {backgroundColor:'#f1f1f1',position:'absolute',transition:'ease-in .2s', transform:' translateX(16.6em)',order:'1'} : {height:'3em',backgroundColor:'#fff',transition:'none'}}>
      <div onClick={handlePayload} 
        className="view client" 
        style={ props.cli.id === props.id ? {backgroundColor:props.color,position:'absolute'} : {backgroundColor:props.color,transition:'none'}} 
        >
          <div className="text" style={ props.color !== '#fafafa' ? {color:'#fafafa'} : {color:'#000'} }>
          {props.name}
          </div>
      </div>
      
     
    </div>
  );
}

export default Client;
