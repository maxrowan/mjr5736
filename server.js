var Twit = require('twit');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const dbFunctions = require( './scripts/database' );
const nluFunctions = require( './scripts/NLU' );

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

         var geoPoint = getCoords( tweet );

         // passes geoPoint and tweet as data for callback
         var data = { geoPoint: geoPoint, tweet: tweet };
         nluFunctions.getClassification( data, dbFunctions.addTweetToDB, sendToClient );

     }
 });

/**
 * stream functions
 */
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


/**
 * connect
 */
http.listen(3000, function() {
    console.log('listening on localhost:3000');
});

/**
 * gets the coordinates from a tweet
 * @param tweet
 * @returns {{lat: *, lng: *}}
 */
function getCoords (tweet) {

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

    return {lat: geoLat, lng: geoLng};
}

/**
 * sends a data object with geoPoint and tweet vars
 */
function sendToClient( geoPoint, tweet ) {
    io.emit('tweetEvent', geoPoint, tweet );
}
