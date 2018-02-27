/**
 * connect to database and insert tweet
 */
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://mjr5736:sen!0rDesign@seniordesign-shard-00-00-hiyas.mongodb.net:27017,seniordesign-shard-00-01-hiyas.mongodb.net:27017,seniordesign-shard-00-02-hiyas.mongodb.net:27017/test?ssl=true&replicaSet=SeniorDesign-shard-0&authSource=admin";

var dbFunctions = {
    addTweetToDB: function (tweet) {
        MongoClient.connect(uri, function (err, db) {
            if (err) throw err;
            var database = db.db("test");
            var collection = database.collection("test");
            collection.insertOne(tweet, function (err, res) {
                if (err) throw err;
                console.log('\n\nInserted in database!\n\n');
            });
            db.close();
        });
    },

    getTweetFromDB: function(dbKey, dbValue) {
        MongoClient.connect(uri, function (err, db) {
            var result = null;

            if (err) throw err;
            var database = db.db("test");
            var collection = database.collection("test");
            result = collection.find({dbKey: dbValue});
            db.close();

            return result;
        });
    }
};
module.exports = dbFunctions;