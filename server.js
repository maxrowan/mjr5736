/**
 * Senior Design Project 2017 - 2018
 * Max Rowan
 */

let Twit = require('twit');
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');

let ex = module.exports = {};

const db = require( './scripts/database' );
const nlu = require( './scripts/NLU' );

// resolve path to ui page
app.get('/', function(req, res) {
    res.sendFile(path.resolve('index.html'));
});

// import secret.json file
let secret = require("./secret");

// make a new Twitter object
let T = new Twit(secret);

/**
 * filter public stream by the lat/long bounded box of Pennsylvania and by the English language
 */
let us = [ -124.7844079,    // west long (left)
    -66.9513812,            // south lat (bottom)
    -66.9513812,            // esat long (right)
    49.3457868              // north lat (top)
];
let stream = T.stream('statuses/filter',  { locations: us, language: 'en' });
stream.on('tweet', onTweet);

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
 * executes when a tweet comes in from the stream (when we catch a wild tweet)
 * @param tweet
 */
function onTweet( tweet ) {

    // if tweet has coordinates
    if ( tweet.coordinates ) {

        // adds geoPoint var to tweet obj
        tweet.geoPoint = getCoords( tweet );
        nlu.classify( tweet, db.addTweetToDB, sendToClient );
    }
}

/**
 * gets the coordinates from a tweet
 * @param tweet
 * @returns {{lat: *, lng: *}}
 */
function getCoords ( tweet ) {

    let geoLng;
    let geoLat;

    if (tweet.coordinates !== null){
        geoLng = tweet.coordinates.coordinates[0];
        geoLat = tweet.coordinates.coordinates[1];
    }
    else if(tweet.place){

        if(tweet.place.bounding_box === 'Polygon'){
            // Calculate the center of the bounding box for the tweet
            let coord, _i, _len;
            let centerLat = 0;
            let centerLng = 0;
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
function sendToClient( tweet ) {
    io.emit('tweetEvent', tweet );
}

/**
 * connect
 */
http.listen(3000, function() {
    console.log('listening on localhost:3000');
});


/**
 * export functions for testing
 */
ex.sendToClient = sendToClient;
ex.onTweet = onTweet;