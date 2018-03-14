let map;
let inclementTweets,    // rgba( 0, 255, 0, 1)
    rainTweets,         // rgba( 255, 165, 0, 1)
    snowTweets,         // rgba( 0, 255, 255, 1)
    hailTweets,         // rgba( 219, 112, 147, 1)
    windTweets,         // rgba( 255, 20, 147, 1)
    iceTweets,          // rgba( 139, 0, 139, 1)
    fireTweets;         // rgba( 233, 150, 122, 1)
let inclementHeatmap,
    rainHeatmap,
    snowHeatmap,
    hailHeatmap,
    windHeatmap,
    iceHeatmap,
    fireHeatmap;

// initialize map
function initMap() {

    /* google map */
    let erieInsurance = { lat: 42.130601, lng: -80.083889 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: erieInsurance
    });

    /* Heat maps */
    inclementTweets = new google.maps.MVCArray();
    inclementHeatmap = new google.maps.visualization.HeatmapLayer({
        data: inclementTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba( 0, 255, 0, 0)',
            'rgba( 0, 255, 0, 0.6)',
            'rgba( 0, 255, 0, 1)'
        ]
    });

    rainTweets = new google.maps.MVCArray();
    rainHeatmap = new google.maps.visualization.HeatmapLayer({
        data: rainTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba( 255, 165, 0, 0)',
            'rgba( 255, 165, 0, 0.6)',
            'rgba( 255, 165, 0, 1)'
        ]
    });

    snowTweets = new google.maps.MVCArray();
    snowHeatmap = new google.maps.visualization.HeatmapLayer({
        data: snowTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba( 0, 255, 255, 0)',
            'rgba( 0, 255, 255, 0.6)',
            'rgba( 0, 255, 255, 1)'
        ]
    });

    hailTweets = new google.maps.MVCArray();
    hailHeatmap = new google.maps.visualization.HeatmapLayer({
        data: hailTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba( 219, 112, 147, 0)',
            'rgba( 219, 112, 147, 0.6)',
            'rgba( 219, 112, 147, 1)'
        ]
    });

    windTweets = new google.maps.MVCArray();
    windHeatmap = new google.maps.visualization.HeatmapLayer({
        data: windTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba( 255, 20, 147, 0)',
            'rgba( 255, 20, 147, 0.6)',
            'rgba( 255, 20, 147, 1)'
        ]
    });

    iceTweets = new google.maps.MVCArray();
    iceHeatmap = new google.maps.visualization.HeatmapLayer({
        data: iceTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba( 139, 0, 139, 0)',
            'rgba( 139, 0, 139, 0.6)',
            'rgba( 139, 0, 139, 1)'
        ]
    });

    fireTweets = new google.maps.MVCArray();
    fireHeatmap = new google.maps.visualization.HeatmapLayer({
        data: fireTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba( 233, 150, 122, 0)',
            'rgba( 233, 150, 122, 0.6)',
            'rgba( 233, 150, 122, 1)'
        ]
    });
}

let socket = io();

/**
 * add point to array and show it on map when it's received from the server
 */
socket.on('tweetEvent', function( tweet ) {
    console.log( tweet.text );
    showTweet( tweet, 'cardRT' );
});

socket.on( 'getAllTweets', function( tweets ) {

    for ( let i = 0; i < tweets.length; i++ ) {
        showTweet( tweets[i], 'cardSearch' );
    }

});

function addToMap( tweet, marker ) {
    switch ( tweet.NLUEntity ) {
        case "INCLEMENT_WEATHER":
            inclementTweets.push( marker );
            break;
        case "RAIN" :
            rainTweets.push( marker );
            break;
        case "SNOW" :
            snowTweets.push( marker );
            break;
        case "HAIL" :
            hailTweets.push( marker );
            break;
        case "WIND" :
            windTweets.push( marker );
            break;
        case "ICE" :
            iceTweets.push( marker );
            break;
        case "FIRE":
            fireTweets.push( marker );
            break;
    }
}

function addToSidebar( text, id ) {
    let p = document.createElement( 'p' );
    p.innerHTML = text;
    document.getElementById( id ).appendChild( p );

    // sets timeout for markers (they're only visible for 5 minutes (300000 ms))
    //setTimeout(function () {
    //    tweets.removeAt(0);
    //}, 300000);
}

function showTweet( tweet, id ) {

    let marker = new google.maps.LatLng(
        tweet.geoPoint.lat,
        tweet.geoPoint.lng
    );

    addToMap( tweet, marker );
    addToSidebar( tweet.text, id );
}

function stopStream() {
    socket.emit( 'stopStream' );
}

function startStream() {
    socket.emit( 'startStream' );
}

function retrieveFromDB () {

    // remove data from real-time sidebar
    document.getElementById( 'cardRT' ).innerHTML = '';

    // remove data from all heatmaps
    clearHeatmaps();

    // tell server to retrieve and send all tweets from DB
    socket.emit( 'retrieveAll' );
}

function clearHeatmaps() {
    inclementTweets.clear();
    rainTweets.clear();
    snowTweets.clear();
    hailTweets.clear();
    windTweets.clear();
    iceTweets.clear();
    fireTweets.clear();
}