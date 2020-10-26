const functions = require('firebase-functions');
const admin = require("firebase-admin");
const express = require("express")
const {ApolloServer, gql} = require("apollo-server-express")

const serviceAccount = require("./mytime-client-firebase-adminsdk-unfnc-70952a86b0.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mytime-client.firebaseio.com"
})

const typeDefs = `

    type Client {
        name:String
        id:String
        tasks:Array
    }
    type Clients {
        clients:[Client]
    }
`
    const resolvers = {
        Query: {
        clients: () => {
            return admin
            .database()
            .ref("clients")
            .once("value")
            .then(snap => snap.val())
            .then(val => Object.keys(val).map((key)=> val[key]));
        }
    }
}

const app = express()
const server = new ApolloServer({typeDefs, resolvers})

server.applyMiddleware({ app,path:"/", cors: true})
exports.graphql = functions.https.onRequest(app)


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
