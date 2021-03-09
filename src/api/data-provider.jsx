import React, {useContext,useState,useEffect,createContext,useReducer} from 'react'

import app from "../firebase";
// import {auth} from "../firebase";
import {useData} from '../api/auth-provider'
import {addClient,deleteClient,addJob} from './db-actions'

export const DataContext = createContext()

// export function useData() {
//     return useContext(DataContext)
// }
export const ACTIONS = {
  TOGGLE_CLIENT:'toggle-client',
  DELETE_CLIENT:'delete-client',
  UPDATE_TIMER:'update-timer',
  RESET_TIMER:'reset-timer',
  ADD_CLIENT:'add-client',
  ADD_JOB:'add-job',
  UPDATE_JOB:'update-job',
  LOG_TIME:'log-time',
  TIMER_STATUS:'timer-status',
  LOG_JOB:'log-job',
}
  
export const DataProvider =({children}) => {
    const db = app.firestore();
    const { currentUser, logout } = useData()
    const [data, setData] = useState([])
    const [fetching, setFetched] = useState(true)


   
    const reducer = (cli,action) => {
      let removeCli = data.filter(c => c.id === cli.id ).map((n) => n.name )
      // let cliData = data[cliIndex]
      // console.log('cliIndex',cliIndex)
      switch(action.type) {  
        case ACTIONS.ADD_CLIENT:
          addClient(action.payload)
        case ACTIONS.DELETE_CLIENT:
          deleteClient(removeCli[0])
        case ACTIONS.TOGGLE_CLIENT:
          return {data,...cli,id:action.payload.id,toggles:{cliPanel:true}}
        case ACTIONS.ADD_JOB: 
          addJob(action.payload.jobs,action.payload.job.client,action.payload.job.name,action.payload.job)
          return {data,...cli}
        case ACTIONS.LOG_TIME:
          addJob(action.payload.jobs,action.payload.job.client,action.payload.job.name,action.payload.job)
          return {data,...cli}
        case ACTIONS.UPDATE_JOB:
          return {data,...cli,job:action.payload}
        case ACTIONS.TIMER_STATUS:
          let timerStatus = action.payload
          return {data,...cli,...timerStatus}
        case ACTIONS.UPDATE_TIMER:
          let timeData = action.payload
          return {data,...cli,timer:{...timeData}}
        case ACTIONS.RESET_TIMER:
          // let timerData = action.payload
          return {data,...cli,timeStatus:false,timer:action.payload}
      default: 
        return cli
      }
    }

    const [cli,dispatch] = useReducer (reducer,{id:0,job:{id:0},activeCli:0,timeStatus:false,timer:{counter:0,second:0,minute:0}})

    useEffect(() => { 
      if (currentUser !== null ) {
        const updateData = db.collection('users').doc(currentUser.uid).collection('clients').onSnapshot(snap => {
          const clientData = snap.docs.map(doc => doc.data())
          setData(clientData)
          // dispatch(clientData)
          setFetched()
            console.log('Fetched Data')
        }, (err) => {
            console.log('Failed to update from database',err)
        });
      
        return () => updateData()
      }

    }, []);

    
  
  

      const value = {
        data,cli,dispatch
      }

      
      
    return ( 
        <DataContext.Provider value={value}>
            {!fetching && children}
        </DataContext.Provider>
    );
}