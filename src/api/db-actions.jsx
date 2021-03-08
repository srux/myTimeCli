import app from "../firebase";
import {auth} from "../firebase";

const addClient = (data) => {
    const db = app.firestore();
    try {
        let userUid = auth.currentUser.uid
        return db.collection('users').doc(userUid).collection('clients').doc(data.name).set(data)
      }
      catch(err) {
       console.log('Failed to add client',err)
    }
}

// const addJob = (name,job,data) => {
//     const db = app.firestore();
//     try {
//         let userUid = auth.currentUser.uid
//         return db.collection('users').doc(userUid).collection('clients').doc(name).collection('jobs').doc(job).set(data)
//       }
//       catch(err) {
//        console.log('Failed to add client',err)
//     }
// }

const addJob = (jobs,client,name,data) => {
    const db = app.firestore();
    try {
        console.log('Added job')
        let userUid = auth.currentUser.uid
        // let exData = db.collection('users').doc(userUid).collection('clients').doc(name)
        return db.collection('users').doc(userUid).collection('clients').doc(client).update({ 
            jobs:{
                ...jobs,
                [name]:data
            }
        })
     
      }
      catch(err) {
       console.log('Failed to add job',err)
    }
}

const deleteClient = (name) => {
    const db = app.firestore();
    try {
        let userUid = auth.currentUser.uid
        return db.collection('users').doc(userUid).collection('clients').doc(name).delete()
      }
      catch(err) {
       console.log('Failed to delete client',err)
    }
}


export {addClient,deleteClient,addJob};
