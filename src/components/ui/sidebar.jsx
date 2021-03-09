import React, {useState,useEffect,useContext} from 'react';

//plugins
import { TiArrowBack,TiPlus,TiMinus } from "react-icons/ti";

//api
import {DataContext,ACTIONS} from '../../api/data-provider';
//functions
import useToggle from '../functions/useToggle'

//components
import ClientInput from './inputs/client-input'



const Sidebar = () => {
    const Context = useContext(DataContext)
    const [Input,setInput] = useState('')
    const [isOn, toggleIsOn] = useToggle();
    

    const toggleClientInput = () => {
        Context.dispatch({type:ACTIONS.TOGGLE_CLIENT,payload:{id:0,toggles:{cliPanel:true}}})
        if (Input === 'client') {
            setInput('')
        }
        else {
            setInput('client')
        }
    }

    const toggleJobInput = () => {
        if (Input === 'job') {
            setInput('')
        }
        else {
            setInput('job')
        }
    }

    const toggleCategoryInput = () => {
        if (Input === 'category') {
            setInput('')
        }
        else {
            setInput('category')
        }
    }

    const handleToggle = () => {
        if (Input !== '') {
            setInput('')
            toggleIsOn();
        } else {
            toggleIsOn();
        }
    }


    useEffect(() => {
      
    },[]);
    return (
        <div className="ui">
            <div style={{display:'flex',alignItems:'center'}} className="view grp">
                <button className="add" style={{borderRadius:'.2em'}} onClick={handleToggle}> { isOn ? <TiArrowBack/> : <TiPlus/> }</button>
                <span>{ isOn ? null : 'Add Something' }</span>
            </div>
        {isOn ? <>       
        { Input !== 'client' && Input !== '' ? null : 
        <div className="view new-grp">  
            <button className="button button-new" onClick={toggleClientInput} value=''>
               {Input !== 'client' ? <TiPlus/> : <TiMinus/> } 
            </button>
            <input style={{pointerEvents:'none',height:'2.5em',backgroundColor:'#fff'}} placeholder="New Client"></input>
        </div>
        }    
        { Input !== 'job' && Input !== ''  ? null : 
        <div className="view new-grp">
            <button className="button button-new" onClick={toggleJobInput} value=''>
                {Input !== 'job' ? <TiPlus/> : <TiMinus/> }
            </button>
            <input style={{pointerEvents:'none',height:'2.5em',backgroundColor:'#fff'}} placeholder="New Job"></input>
        </div>
        }
        { Input !== 'category' && Input !== '' ? null :
        <div className="view new-grp">
            <button className="button button-new" onClick={toggleCategoryInput} value=''>
                    {Input !== 'category' ? <TiPlus/> : <TiMinus/> }
            </button>
            <input style={{pointerEvents:'none',height:'2.5em',backgroundColor:'#fff'}} placeholder="New Category"></input>
        </div> }
         </>: null }
          { isOn ?  <>
          { Input === "client" ?    
            <ClientInput/>
             : null }
          { Input === "job" ? <div className="text">this will be new job</div> : null }
          { Input === "category" ? <div className="text">this will be new category</div> : null } 
          </>
          : null } 
      </div>

    );
}

export default Sidebar;


