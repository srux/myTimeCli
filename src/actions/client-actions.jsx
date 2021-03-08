import React, {useState, useReducer} from 'react'
import {DataContext} from '../api/data-provider';
const ClientActions = () => {

    const Context = useContext(DataContext);

    export const ACTIONS = {
        ADD_CLIENT:'add-client'
    }

    const reducer = (clients,action) => {
        switch(action.type) {
            case ACTIONS.ADD_CLIENT:
                return [...clients,newClient(action.payload.name)]
            default: return clients
        }
    }

}

export default ClientActions