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

function getSearchResults( searchVars, sendTweets ) {

    printRes( searchVars );

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

function printRes( searchVars ) {

    let keywords = searchVars.keywords,
        cities = searchVars.cities,
        states = searchVars.states,
        startDate = searchVars.startDate,
        endDate = searchVars.endDate;

    let k = '',
        c = '',
        s = '';

    if ( keywords !== undefined )
        k = keywords;
    else
        k = 'couldn\'t get keywords';

    if ( cities !== undefined )
        c = cities;
    else
        c = 'couldn\'t get cities';

    if ( states !== undefined )
        s = states;
    else
        s = 'couldn\'nt get states';

    console.log( '\n\n' +
        k.toString() + '\n' +
        c.toString() + '\n' +
        s.toString() + '\n' +
        startDate.toString() + '\n' +
        endDate.toString() + '\n\n'
    );
}

ex.addTweetToDB = addTweetToDB;
ex.getAllTweetsFromDB = getAllTweetsFromDB;
ex.getSearchResults = getSearchResults;