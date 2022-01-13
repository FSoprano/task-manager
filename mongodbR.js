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
    // db.collection('users').findOne({ name: 'Klara', age: 32 }, (error, user) => {
    //     if (error) {
    //         return console.log('Something went wrong.');
    //     };
    //     // Searching for a document and not finding one is not an error;
    //     // we get 'null' on the console.
    //     // If more than one user exists with the properties specified, 
    //     // findOne will return the first only.
    //     // A specific user can be found by the unique Object ID.
    //     console.log(user);
    // });
    // db.collection('users').findOne({ _id: new ObjectID('61c086c595855f40c5387a90')}, (error, user) => {
    //     if (error) {
    //         return console.log('Something went wrong.');
    //     };
    //     // Searching by Object ID: Providing the ID string is not enough.
    //     // Binary data, blabla. 
    //     console.log(user);
    // });
    // db.collection('users').find({ age: 107 }).toArray((error, user) => {
    //     if (error) {
    //         return console.log('Failure running toArray on cursor.');
    //     };
    //     console.log(user);
    // });
    // No callback function. What we get is a cursor that points at the 
    // matching objects in the database. On the cursor, we can use a bunch 
    // of methods. One of them is toArray, which takes a callback.
    // db.collection('users').find({ age: 107 }).count((error, count) => {
    //     if (error) {
    //         return console.log('Failure counting objects.');
    //     };
    //     console.log('Counted objects: ', count);
    // });
    db.collection('tasks').findOne({ _id: new ObjectID('61c08e31346e136a8d52523b')}, (error, task) => {
        if (error) {
            return console.log('Error fetching task.');
        };
        // Searching by Object ID: Providing the ID string is not enough.
        // Binary data, blabla. 
        console.log(task);
    });
    db.collection('tasks').find({ completed: false }).toArray((error, tasks) => {
            if (error) {
                return console.log('Failure running toArray on task cursor.');
            };
            console.log(tasks);
        });
});
