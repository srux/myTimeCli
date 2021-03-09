import React, {useState,useContext,useEffect,useRef,useReducer} from 'react';
import {DataContext,ACTIONS} from '../api/data-provider';
//plugins 
import 'react-perfect-scrollbar/dist/css/styles.css';
import { TiArrowBack,TiChevronLeft,TiPlus,TiMinus,TiThList } from "react-icons/ti";
import Scrollbar from 'react-scrollbars-custom'
import { CirclePicker  } from 'react-color';


//functions
import useToggle from './functions/useToggle'
import usePrevious from './functions/usePrevious'

//components
import Client from './client'
import Sidebar from './ui/sidebar'
import ClientActivity from './client-activity';
import Timer from './functions/timer';


const Dashboard = () => { 
  // data context
  const Context = useContext(DataContext);
  const clients = Context.data
  const cli = Context.cli
  const dispatch = Context.dispatch

  const [exClient, setExClient] = useState(false)
  const [Input,setInput] = useState(false)
  const [client, setClient] = useState({name:'',rate:'',category:'',color:'#f1f1f1',jobs:{},id:Date.now()})

  const [isCol,toggleCol] = useToggle();
  const [isCat,toggleCat] = useToggle();
  const [isOn, toggleIsOn] = useToggle();

  const [order, orderBy] = useState()
  const [filter, filterBy] = useState('')
  
  // prev filter state
  const prevFilter = usePrevious(filter)

  // filtering out categories
  const catMap = [...clients].map((i) => i.category).filter((i) => i !== '')
  const cats = new Set(catMap);
  const categories = [...cats]
  const clientsFilter = clients.filter((i) => i.category === filter )

  const handleOrderReset = () => {
    setTimeout(() => {
      toggleIsOn(!isOn)
    },100)
  }

  const filterConditions = () =>{
    if (prevFilter === filter) {
      setTimeout(() => {
        filterBy('')
      },100)
    }
  }
  
  const ClientsOrderBy = clients.sort((a,b)=>{

    if (order === 'date' ) {
      return new Date(b.id) - new Date(a.id);
    } 
    if (order === 'name') {
      if (b.name > a.name) {
       return -1
      }
    }
    if (order === 'colour') {
      if (b.color > a.color) {
        return -1
       }
    }
    console.log('ClientsOrderBy')
  })

  const currClient = clients.filter((c) => c.id === cli.id)

  
    const toggleClientInput = () => {
      setInput(!Input)
  }

    const handleClientInput = (e) =>{ 
      Context.dispatch({type:ACTIONS.TOGGLE_CLIENT,payload:{id:0,toggles:{cliPanel:true}}})
      setClient({...client, [e.currentTarget.id]:e.target.value,id:Date.now()})
  }

    const handleClientColor = (color) => {
      setClient({...client,color:color.hex})
      toggleCol(false)    
    }

    const handleAddClient = () => {    
      dispatch({type:ACTIONS.ADD_CLIENT,payload:{...client}})
      setTimeout(() => {
          setClient({name:'',rate:'',category:'',color:'#f1f1f1',id:Date.now(),jobs:{}})
      },100)
  }

  useEffect(() => {
    const filtered = clients.map((c) => c.name === client.name)
    if (filtered.find((t) => t) === true ) {
        setExClient(true)
    }else {
        setExClient(false)
    }
}, [client,exClient]);




  return (
    <div className="view dashboard">
      <Sidebar/>
      <div className="view clients">
        <div className="client-dash-timer"><Timer/></div>
        
          <div className="view clients-dash">
          
          <div className="view client-filter drop-down" >
            <div className="text" onClick={toggleIsOn} style={{cursor:'pointer'}}>Filter by: {order}</div>
            { isOn ?       
            <div className="view">            
              <div className="text" onClick={() => {orderBy('date')}} onMouseUp={handleOrderReset}>Date Created</div>
              <div className="text" onClick={() => {orderBy('name')}}  onMouseUp={handleOrderReset}>Name</div>
              <div className="text" onClick={() => {orderBy('colour')}} onMouseUp={handleOrderReset}>Colour</div>
            </div> : null }
          </div>
         
          <div className="view client-categories">
             {
                categories.sort().map((cat) => {
                  return <div className="text" style={cat === filter ? {backgroundColor:'#333',color:'#f1f1f1'} : {backgroundColor:'#f1f1f1'} } onClick={() => {filterBy(cat) }}   key={cat}>{cat}</div> 
                })
              }
              {filter !== '' ? <div className="text filter-cancel" onClick={() => {filterBy('')}} >X</div> : null }
            </div>
            
          </div>
          <div className="view new-client" >
          {Input !== true ?<span style={{display:'flex',flexDirection:'row',alignItems:'center'}}><button className="button button-new" onClick={toggleClientInput} value=''><TiPlus/></button> Add Client</span> : <button className="button button-new" onClick={toggleClientInput} value=''><TiMinus/></button> } 
        
            {Input !== true ? null :    <div className="view client-inputs" style={{display:'flex', flexDirection:'row'}}>
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
             
                    <div className="view client-category drop-down" style={{alignItems:'flex-end'}}>
                        <input className ="TextInput add-inputs"
                        id="category"
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                        onChange={handleClientInput}
                        value={client.category}
                        type='text'
                        placeholder='New Category'
                        />
                        <div className="text" onClick={toggleCat} style={{cursor:'pointer',position:'absolute'}}><TiThList/></div>
                        { isCat ?       
                        <div className="view">
                            {categories.map((cat) => {
                                return <div className="text" onClick={() => {setClient({...client, category:cat},toggleCat(!isCat))}} value={cat}>{cat}</div>
                            })}            
                        </div> : null }
              

                </div>
                
                <div className="view colorpicker">
                    <div className="text subheading" style={client.color !== '#f1f1f1' ? {cursor:'pointer',backgroundColor:client.color,color:'#fafafa'} : {cursor:'pointer'} } onClick={() => {toggleCol(!isCol)}}>Label Colour</div>
                    
                    { isCol ? <CirclePicker  
                        className="colourPicker"
                        color={client.color}
                        onChangeComplete={handleClientColor}
                        
                    /> : null }
                </div>
                { exClient === true ? <button onClick={handleAddClient}>Update {client.name}</button> :  <button onClick={handleAddClient}> Add Client {client.name} </button> }
                </div> } 
         
            </div>
          <div className="view client-panel">
          { filter === '' ?  
           
            <Scrollbar noScrollX style={{overflow:'visible',width:'15em'}}>
                        
              <div className="view client-tabs">
                  {ClientsOrderBy.map((client) => {
                      let clientProps = {
                        ...client,
                        key:client.id,
                      } 
                      return (<Client cli={cli} dispatch={dispatch} {...clientProps}/>) 
                    })
                  }</div>
              </Scrollbar>
              :  
                  <Scrollbar noScrollX style={{overflow:'visible',width:'15em'}}><div className="view client-tabs">
                  {clientsFilter.map((client) => {
                      let clientProps = {
                        ...client,
                        key:client.id,
                      } 
                      return (<Client cli={cli} dispatch={dispatch} {...clientProps}/>) 
                    })
                  }
              </div>
              </Scrollbar> }
              
                {
                  currClient.map((client) => {
                    let clientProps = {
                      ...client,
                      key:client.id,
                      cli,
                      dispatch
                    } 
                    return <ClientActivity {...clientProps}/>
                  })
                }

         </div>
      </div>
      
    </div>

  );
}

export default Dashboard;
