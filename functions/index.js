const functions = require('firebase-functions');
const admin = require("firebase-admin");
// const express = require("express")
// const { ApolloServer, gql } = require("apollo-server-express");

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

// const typeDefs = gql`
// type data {
//     client:String,
//     task:String,
//     startTime:String,
//     rate:Int,
//     money:Int,
//     logTime:String,
//     id:Int,
//     pauseTime:String,
//   }
//   type clientInfo {
//     name:String,
//     id:Int,
//     tasks:[data]
//   }
// `;

// const resolvers = {
//     Query: {
//         clientInfo: () =>
//         admin
//           .database()
//           .ref("clients")
//           .once("value")
//           .then(snap => snap.val())
//           .then(val => Object.keys(val).map(key => val[key]))
//     }
//   };


//     const app = express();
//     const server = new ApolloServer({ typeDefs, resolvers });
//     server.applyMiddleware({ app, path: "/", cors: true });
//     exports.graphql = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
