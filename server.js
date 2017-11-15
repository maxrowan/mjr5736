var TwitterPackage = require('twitter');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// resolve path 
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
                var geo_lng = tweet.coordinates.coordinates[0];
                var geo_lat = tweet.coordinates.coordinates[1];
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
                    geo_lng = centerLat / coords.length;
                    geo_lat = centerLng / coords.length;
                }
            }
            // print out the text of the tweet that came in
            console.log(tweet.text);
                
            var geoPoint = {lat: geo_lat, lng: geo_lng};
            console.log(geo_lat + ' ' + geo_lng);
            console.log();
            
            // send tweet event to client
            io.emit('tweetEvent', geoPoint);
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