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

    // db.collection('users').deleteMany(
    //     { age: 107 }
    // ).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // });

    db.collection('tasks').deleteOne(
        { description: 'Empty bin.' }
    ).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    });
});
