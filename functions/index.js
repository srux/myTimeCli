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

// const express = require("express")
// const {ApolloServer, gql} = require("apollo-server")


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
