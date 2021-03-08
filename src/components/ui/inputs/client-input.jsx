import React, {useState,useContext,useEffect} from 'react';
import {DataContext} from '../../../api/data-provider';

import app from "../../../firebase";
import {auth} from "../../../firebase";

//ACTIONS
import {ACTIONS} from '../../../api/data-provider'

//functions
import useToggle from '../../functions/useToggle'

import { CirclePicker  } from 'react-color';

const ClientInput = () => {
    const Context = useContext(DataContext);
    const clients = Context.data
    // const cli = Context.cli
    const dispatch = Context.dispatch

    const catMap = [...clients].map((i) => i.category)
    const cats = new Set(catMap);
    const categories = [...cats]

    const [isOn, toggleIsOn] = useToggle();
    const [client, setClient] = useState({name:'',rate:'',category:'',color:'#fafafa',jobs:{},id:Date.now()})
    const [exClient, setExClient] = useState(false)
    const [category, setCategory] = useState('')


    const handleClientInput = (e) =>{ 
        setClient({...client, [e.currentTarget.id]:e.target.value,id:Date.now()})
    }

    useEffect(() => {
        const filtered = clients.map((c) => c.name === client.name)
        if (filtered.find((t) => t) === true ) {
            setExClient(true)
        }else {
            setExClient(false)
        }
    }, [client,exClient]);

    const handleClientColor = (color) => {
        setClient({...client,color:color.hex})     
    }

    const handleAddClient = () => {    
        dispatch({type:ACTIONS.ADD_CLIENT,payload:{...client}})
        setTimeout(() => {
            setClient({name:'',rate:'',category:'',color:'#fafafa',id:Date.now()})
        },100)

    }

    // const handlePayload = () => {
    //     const db = app.firestore();
    //     const id = Date.now();
    //     setClient({...client,id:id})
    //         try {
    //             let userUid = auth.currentUser.uid
    //             return db.collection('users').doc(userUid).collection('clients').doc(client.name).set({...client})
    //           }
    //           catch(err) {
    //            console.log('Failed to add client',err)
    //         }
      
    // }

    return (
        <div className="view sidebar">
            <div className="view new-client" style={{display:'flex', flexDirection:'column'}}>
                <input className ="TextInput add-inputs client-name"
                    id="name"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChange={handleClientInput}
                    value={client.name}
                    type="text"
                    placeholder='Client Name'   
                />
                <input className ="TextInput add-inputs client-rate"
                    id="rate"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChange={handleClientInput}
                    value={client.rate}
                    type='number'
                    placeholder='$ Rate'
                />
             
                    <div className="view client-category drop-down" >
                        <input className ="TextInput add-inputs"
                        id="category"
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChange={handleClientInput}
                        value={client.category}
                        type='text'
                        placeholder='New Category'
                        />
                        <div className="text" onClick={toggleIsOn} style={{cursor:'pointer'}}>Existing Category</div>
                        { isOn ?       
                        <div className="view">
                            {categories.map((cat) => {
                                return <div className="text" onClick={() => {setClient({...client, category:cat})}} value={cat}>{cat}</div>
                            })}            
                        </div> : null }
              

                </div>
                
                <div className="view colorpicker">
                    <div className="text subheading">Label Colour</div>
                    <CirclePicker  
                        color={client.color}
                        onChangeComplete={handleClientColor}
                    />
                </div>
                { exClient === true ? <button onClick={handleAddClient}>Update {client.name}</button> :  <button onClick={handleAddClient}> Add Client: {client.name} </button> }
               
            </div>
        </div>
    );
}

export default ClientInput;