var Twit = require('twit');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var watson = require('watson-developer-cloud');
var natural_language_classifier = watson.natural_language_classifier({
    username: '0780be29-7459-493a-aaaa-0ce2773d41a4',
    password: '3Grq4DtGw3aR',
    version: 'v1'
});


//var MongoClient = require('mongodb').MongoClient;
//var assert = require('assert');
//
//
//
//var uri = "mongodb://mjr5736:seni0rDes!gn@cluster0-shard-00-00-hiyas.mongodb.net:27017,cluster0-shard-00-01-hiyas.mongodb.net:27017,cluster0-shard-00-02-hiyas.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
//
//


// resolve path to ui page
app.get('/', function(req, res) {
    res.sendFile(path.resolve('index.html'));
});

// import secret.json file
var secret = require("./secret");

// make a new Twitter object
var T = new Twit(secret);

/**
 * filter public stream by the lat/long bounded box of the US and by the English language
 */
var top = 49.3457868;       //north lat
var left = -124.7844079;    // west long
var right = -66.9513812;    // east long
var bottom =  24.7433195;   // south lat

var us = [ left, bottom, right, top ];
var stream = T.stream('statuses/filter',  { locations: us, language: 'en' });
stream.on('tweet', function ( tweet ) {

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

         var geoPoint = {lat: geoLat, lng: geoLng};

         /**
          * check with the natural language classifier to see if the tweet's text is weather-related
          */
         //natural_language_classifier.classify({
         //        text: tweet.text,
         //        classifier_id: '33c2fbx273-nlc-8618' },
         //    function(err, response) {
         //        if (err)
         //            console.log('error:', err);
         //        else {
                     console.log(tweet.text);
         //            console.log(response.top_class);
         //            console.log('\n\n')
//
         //            if ( response.top_class === 'weather') {
                         io.emit('tweetEvent', geoPoint, tweet);
                         console.log();

         //                /**
         //                 * connect to database and insert tweet
         //                 */
         //                //MongoClient.connect(uri, function(err, client) {//
         //                //    if (err) throw err;
         //                //    const collection = client.db("test").collection("MVP");
         //                //    collection.insertOne(tweet, function(err, res) {
         //                //        if (err) throw err;
         //                //        console.log('doc inserted!');
         //                //    });
         //                //    client.close();
         //                //});
         //            }
         //        }
         //    });
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


// connect to localhost
http.listen(3000, function() {
    console.log('listening on localhost:3000');
});
