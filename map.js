
    // declare map and heatmap
    var map;
    var heatmap;
    var liveTweets;
    var tweetCount = 0;

    // initialize map
    function initMap() {
        liveTweets = new google.maps.MVCArray();
        var behrend = {lat: 42.119308, lng: -79.983714};
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: behrend
        });

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: liveTweets,
            map: map,
            radius: 16
        });
    }

    var socket = io();//'http://localhost:3000');

    // add point to array and show it on map when it's received from the server
    socket.on('tweetEvent', function(geoPoint, tweet) {
        var text = tweet.text;
        tweetCount++;
        console.log('tweet #' + tweetCount + ': ' + text
                   + '\n\n' + geoPoint.lat + ' ' + geoPoint.lng);
        var marker = new google.maps.LatLng(geoPoint.lat, geoPoint.lng);

        liveTweets.push(marker); //add marker to heatmap

        // sets timeout for markers (they're only visible for 5 minutes)
        setTimeout(function () {
            liveTweets.removeAt(0);
        }, 300000);
    });
