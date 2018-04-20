/**
 * Senior Design Project 2017 - 2018
 * Max Rowan
 */

let Twit = require('twit');
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let path = require('path');

let debug = require( 'debug' )( 'http' );

let ex = module.exports = {};

const db = require( './scripts/database' );
const nlu = require( './scripts/NLU' );

// resolve path to ui page
app.get('/', function(req, res) {
    res.sendFile(path.resolve('index.html'));
});
app.use(express.static(__dirname + '/public'));

// import secret.json file
let secret = require("./secret");

// make a new Twitter object
let T = new Twit(secret);

/**
 * filter public stream by the lat/long bounded box of Pennsylvania and by the English language
 */
let stream;
startStream();

/**
 * starts twitter stream
 */
function startStream() {
    /**
     * state bounding boxes ( data from "https://boundingbox.klokantech.com" )
     * @type {[number,number,number,number]}
     */
    let PA = [
        -80.519895,
        39.7197989,
        -74.6895018,
        42.516072
    ];
    let NY = [
        -79.7625901,
        40.4773991,
        -71.777491,
        45.015865
    ];
    let OH = [
        -84.8203049,    // west long (left)
        38.4034229,     // south lat (bottom)
        -80.5182,       // east long (right)
        42.327132       // north lat (top)
    ];
    stream = T.stream('statuses/filter', {locations: [ PA, NY, OH ], /*track: 'thunderstorm,storm,rain,snow,sleet,hail',*/ language: 'en'});

    /**
     * stream functions
     */
    stream.on('tweet', onTweet);
    stream.on('error', displayMessage );
    stream.on('limit', displayMessage );
    stream.on('warning', displayMessage );
    stream.on('disconnect', displayMessage );
}

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
 * sends multiple tweets to client from the database
 */
function sendTweets( result, socket ) {
    socket.emit( 'getTweets', result );
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

function displayMessage ( msg ) {
    console.log( msg );
}

/**
 * socket functions
 * TODO: fix socket emission (currently broadcasts)
 */
io.on( 'connection', function( socket ) {

    socket.on( 'stopStream', function() {
        stream.stop();
    });

    socket.on( 'startStream', function() {
        stream.start();
    });

    socket.on( 'searchEvent', function( searchVars ) {
        db.getSearchResults( searchVars, sendTweets, socket );
    });

    /**
     * retrieveFromDB event -> get all tweets from the DB
     */
    socket.on( 'retrieveAll', function () {
        db.getAllTweetsFromDB( sendTweets, socket );
    });
});

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