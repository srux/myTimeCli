import React from 'react'
import app from "../firebase";

const db = app.firestore();


// export function getClients(userUid) {
//     return  db.collection('users').doc(userUid).collection('clients').get()
// }

// export function getSettings(userUid) {
//     return  db.collection('users').doc(userUid).collection('clients').get()
// }

// export function querySettings(userUid){
//    const data = db.collection('users').doc(userUid).collection('settings').doc('rates')
// }


export function deleteClient(userUid,name){
    db.collection('users').doc(userUid).collection('clients').doc(name).delete();
} 


export default {deleteClient}





