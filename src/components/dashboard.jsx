import React, {useState,useContext,useEffect,useRef,useReducer} from 'react';

//plugins 
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css';

import Scrollbar from 'react-scrollbars-custom'

import {DataContext} from '../api/data-provider';

import app from "../firebase";
import {auth} from "../firebase";
//functions
import useToggle from './functions/useToggle'
import usePrevious from './functions/usePrevious'
import {addClient,deleteClient} from '../api/db-actions'

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
