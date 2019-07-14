const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app  = require('express')();

admin.initializeApp();

const config = {
    apiKey: "AIzaSyCoXhNlvHPP1rWQIZk6J4NDqS_3kW3yOFw",
    authDomain: "party-concepts.firebaseapp.com",
    databaseURL: "https://party-concepts.firebaseio.com",
    projectId: "party-concepts",
    storageBucket: "party-concepts.appspot.com",
    messagingSenderId: "590075158568",
    appId: "1:590075158568:web:22ce354babe85d84"
  };

const firebase = require('firebase');

firebase.initializeApp(config)
// var auth = firebase.auth();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


app.get('/screams', (req, res)=>{

    admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt','desc')
    .get()
    .then(data => {
        let screams = [];
        data.forEach(doc => {
            screams.push({
                screamID:doc.id,
                ...doc.data()
            });
        })
        return res.json(screams);
    })
    .catch(err => console.error(err));
})

app.post('/scream',(req, res) => {
        const newScream = {
            body: req.body.body,
            userHandle: req.body.userHandle,
            createdAt: new Date().toISOString()
        };

        admin.firestore()
            .collection('screams')
            .add(newScream)
            .then((doc) => {
                res.json({message: `document ${doc.id} created successfully`});
            })
            .catch(err => {
                res.status(500).json({error: 'something went wrong'});
                console.error(err);
            })
    });
// Signup route
app.post('/signup', (req, res)=>{
    const newUser = {
        email: req.body.email,
        confirmPassword: req.body.confirmPassword,
        password: req.body.password,
        handle: req.body.handle,
    };

    // TODO: validate data

    firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data =>{
        return res.status(201).json({message:`user ${data.user.uid} signed up successfully`});
    })
    .catch(err =>{
        console.error(err);
        return res.status(500).json({error:err.error});
    });
})

exports.api = functions.region('asia-east2').https.onRequest(app);