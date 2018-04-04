/**
 * connect to database and insert tweet
 */
let MongoClient = require('mongodb').MongoClient;
let uri = "mongodb://mjr5736:sen!0rDesign@seniordesign-shard-00-00-hiyas.mongodb.net:27017,seniordesign-shard-00-01-hiyas.mongodb.net:27017,seniordesign-shard-00-02-hiyas.mongodb.net:27017/test?ssl=true&replicaSet=SeniorDesign-shard-0&authSource=admin";

let ex = module.exports = {};

function addTweetToDB( tweet ) {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;

        let database = db.db("test");
        let collection = database.collection("test");
        collection.insertOne(tweet, function (err, res) {
            if (err) throw err;
            console.log('\n\nInserted in database!\n\n');
        });

        db.close();
    });
}

function getAllTweetsFromDB( sendTweets ) {
    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;

        let database = db.db("test");
        let collection = database.collection("test");
        collection.find().toArray( function( err, result ) {
            sendTweets( result );
            db.close();
        });
    });
}

function getSearchResults( user, keywords, startDate, endDate, city, state, sendTweets ) {

    console.log( '\n\n' + search + '\n\n' );

    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;

        let database = db.db("test");
        let collection = database.collection("test");
        collection.find( {id: 980938515910406100} ).toArray( function( err, result ) {
            sendTweets( result );
            db.close();
        });
    });
}

ex.addTweetToDB = addTweetToDB;
ex.getAllTweetsFromDB = getAllTweetsFromDB;
ex.getSearchResults = getSearchResults;