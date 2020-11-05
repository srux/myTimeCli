import React from 'react'
import app from "../firebase";

const db = app.firestore();


export function getData(userUid) {
    return  db.collection('users').doc(userUid).collection('clients').get()
}

export function queryData(userUid){
    db.collection('users').doc(userUid).collection('clients')
}

export function deleteClient(userUid,name){
    db.collection('users').doc(userUid).collection('clients').doc(name).delete();
}

export function setData(data) {
  this.setState({
      clients:data
  })
}


export default {getData,deleteClient}





