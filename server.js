var TwitterPackage = require('twitter');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var uri = "mongodb://mjr5736:seni0rDes!gn@cluster0-shard-00-00-hiyas.mongodb.net:27017,cluster0-shard-00-01-hiyas.mongodb.net:27017,cluster0-shard-00-02-hiyas.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

// resolve path to ui page
app.get('/', function(req, res) {
    res.sendFile(path.resolve('index.html'));
});

// import secret.json file
var secret = require("./secret");

// make a new Twitter object
var Twitter = new TwitterPackage(secret);

// Call the stream function and pass in 'statuses/filter', our filter object, and our callback
Twitter.stream('statuses/filter', {track: 'weather, rain, snow, sleet, hail, raining, snowing, windy, tornado, hurricane, ice, icy'}, function(stream) {

    // when we get tweet data
    stream.on('data', function(tweet) {

        // if tweet has coordinates
        if (tweet.coordinates) {

            if (tweet.coordinates !== null){
                var geoLng = tweet.coordinates.coordinates[0];
                var geoLat = tweet.coordinates.coordinates[1];
            }
            else if(tweet.place){

                if(tweet.place.bounding_box === 'Polygon'){
                    // Calculate the center of the bounding box for the tweet
                    var coord, _i, _len;
                    var centerLat = 0;
                    var centerLng = 0;
                    for (_i = 0, _len = coords.length; _i < _len; _i++) {
                        coord = coords[_i];
                        centerLat += coord[0];
                        centerLng += coord[1];
                    }
                    geoLng = centerLat / coords.length;
                    geoLat = centerLng / coords.length;
                }
            }
            // print out the text of the tweet that came in
            console.log(tweet.text);

            var geoPoint = {lat: geoLat, lng: geoLng};
            console.log(geoLat + ' ' + geoLng);
            console.log();

            // send tweet event to client
            io.emit('tweetEvent', geoPoint, tweet);

            // insert tweet in database
            MongoClient.connect(uri, function(err, client) {
                if (err) throw err;
                const collection = client.db("test").collection("MVP");
                collection.insertOne(tweet, function(err, res) {
                    if (err) throw err;
                    console.log('doc inserted!');
                });
                client.close();
            });
        }
    });

    /* stream functions */
    stream.on('error', function(error) {
        console.log(error);
    });
    stream.on('limit', function(error) {
        console.log(error);
    });
    stream.on('warning', function(error) {
        console.log(error);
    });
    stream.on('disconnect', function(disconnect) {
        console.log(disconnect);
    });
});

// connect to localhost
http.listen(3000, function() {
    console.log('listening on localhost:3000');
});
