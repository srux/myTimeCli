import app from "../firebase";
import {auth} from "../firebase";

const db = app.firestore();

// export function querySettings(userUid){
//    const data = db.collection('users').doc(userUid).collection('settings').doc('rates')
// }


export function setRate(globalRate, setGlobalRate) {
     let userUid = auth.currentUser.uid
     return db.collection('users').doc(userUid).collection('settings').doc('rates').set({globalRate,setGlobalRate})
}

export function getRate() {
    let userUid = auth.currentUser.uid
    return db.collection('users').doc(userUid).collection('settings').doc('rates').get()
}

export function addClient(data, client) {
    db.settings({
        timestampsInSnapshots: true
    });
    let userUid = auth.currentUser.uid
    return db.collection('users').doc(userUid).collection('clients').doc(client).set({...data})
}

export function queryClientData(client) {
    let userUid = auth.currentUser.uid
    return db.collection('users').doc(userUid).collection('clients').doc(client)
}

export function getClientData(client) {
    let userUid = auth.currentUser.uid
    return db.collection('users').doc(userUid).collection('clients').doc(client).get()
}

export function deleteClient(userUid,name){
    db.collection('users').doc(userUid).collection('clients').doc(name).delete();
} 

export function addJob(client,payload) {
    db.settings({
        timestampsInSnapshots: true
    });
    let userUid = auth.currentUser.uid
    return db.collection('users').doc(userUid).collection('clients').doc(client).update(payload)
}


export default {deleteClient,setRate,addClient,getRate,queryClientData,getClientData,addJob}





