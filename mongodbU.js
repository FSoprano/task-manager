// CRUD operations: create, read, update, delete
// const mongodb = require('mongodb');
// To get the connectors for CRUD ops from mongodb:
// const MongoClient = mongodb.MongoClient;
// The connectionURL starts with mongodb because that is their protocol.
// Type out the localhost URL because typing 'localhost' causes issues/
// strange behaviour.
// Grabbing another item from mongodb:
// const ObjectID = mongodb.ObjectID;
// After object destructuring, we get:
const { MongoClient, ObjectID} = require('mongodb');


const connectionURL = 'mongodb://127.0.0.1:27017';
// We can pick any database name we like:
const databaseName = 'task-manager';
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log('Connection to database failed.');
        // return to stop function execution if error occurs.
    };
    const db = client.db(databaseName);
    
    // db.collection('users').updateOne({
    //     // .updateOne() returns a promise if no callback is provided.
    //     _id: new ObjectID('61c086c595855f40c5387a90')
    // }, {
    //     $inc: { age: -1 }
    //     // Decreases the age by 1.
    //     // Check out https://docs.mongodb.com/manual/reference/operator/update/
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });
    db.collection('tasks').updateMany({
        // .updateOne() returns a promise if no callback is provided.
        completed: false 
    }, {
        $set: { completed: true }

    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });
    
});
