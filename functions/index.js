const functions = require('firebase-functions');
const admin = require("firebase-admin");

const serviceAccount = require("./mytime-client-firebase-adminsdk-unfnc-70952a86b0.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mytime-client.firebaseio.com"
});

const db = admin.firestore()

exports.clients = functions.https.onRequest(async (req, res) => {
     const snapshot = await db.collection('clients').get()
     const clients = snapshot.empty ? []
     : snapshot.docs.map(doc => Object.assign(doc.data(), { id:doc.id }))
     res.send(clients)
})

exports.newUserSignup = functions.auth.user().onCreate(user => {
    return db.collection('users').doc(user.uid).set({
       clients:[]
    })
})

exports.userDelete = functions.auth.user().onDelete(user => {
    const doc = db.collection('users').doc(user.uid);
    return doc.delete(); 
})

// exports.onChange = functions.auth.user().onWrite(user => {
//     const doc = db.collection('users').doc(user.uid);
//     return 
// })
