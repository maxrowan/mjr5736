let map;
let inclementTweets = [],    // rgba( 0, 255, 0, 1)
    rainTweets = [],         // rgba( 255, 165, 0, 1)
    snowTweets = [],         // rgba( 0, 255, 255, 1)
    hailTweets = [],         // rgba( 219, 112, 147, 1)
    windTweets = [],         // rgba( 255, 20, 147, 1)
    iceTweets = [],          // rgba( 139, 0, 139, 1)
    fireTweets = [];         // rgba( 233, 150, 122, 1)

// initialize map
function initMap() {

    /* google map */
    let erieInsurance = { lat: 42.130601, lng: -80.083889 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: erieInsurance,
        gestureHandling: 'greedy'
    });

    retrieveFromDB();
}

let socket = io();

/**
 * add point to array and show it on map when it's received from the server
 */
socket.on('tweetEvent', function( tweet ) {
    console.log( tweet.text );
    showTweet( tweet, 'tweet-content-body' );
});

socket.on( 'getAllTweets', function( tweets ) {
    getAllTweets( tweets );
});

function getAllTweets( tweets ) {
    for ( let i = 0; i < tweets.length; i++ ) {
        showTweet( tweets[i], 'tweet-content-body' );
    }
}

function addToMap( tweet ) {

    let marker;

    console.log('setting marker');

    switch ( tweet.NLUEntity ) {
        case "INCLEMENT_WEATHER":
            marker = setMarker( 'lime', tweet );
            inclementTweets.push( marker );
            break;
        case "RAIN" :
            marker = setMarker( 'orange', tweet );
            rainTweets.push( marker );
            break;
        case "SNOW" :
            marker = setMarker( 'aqua', tweet );
            snowTweets.push( marker );
            break;
        case "HAIL" :
            marker = setMarker( 'MediumVioletRed', tweet );
            hailTweets.push( marker );
            break;
        case "WIND" :
            marker = setMarker( 'DeepPink ', tweet );
            windTweets.push( marker );
            break;
        case "ICE" :
            marker = setMarker( 'DarkMagenta ', tweet );
            iceTweets.push( marker );
            break;
        case "FIRE":
            marker = setMarker( 'DarkSalmon', tweet );
            fireTweets.push( marker );
            break;
    }
}

function setMarker( color, tweet ) {

    let mapIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 0.5,
        scale: 10,
        strokeColor: 'white',
        strokeWeight: 1
    };

    return new google.maps.Marker({
        position: {
            lat: tweet.geoPoint.lat,
            lng: tweet.geoPoint.lng
        },
        icon: mapIcon,
        map: map
    });
}

function addToSidebar( text ) {
    let li = document.createElement( 'li' );
    li.classList.add( 'list-group-item' );

    // TODO add left border to tweet with color to indicate type

    li.innerHTML = text;
    document.getElementById( 'tweet-list' ).appendChild( li );

    // sets timeout for markers (they're only visible for 5 minutes (300000 ms))
    //setTimeout(function () {
    //    tweets.removeAt(0);
    //}, 300000);
}

function showTweet( tweet ) {
    addToMap( tweet );
    addToSidebar( tweet.text );
}

function stopStream() {
    socket.emit( 'stopStream' );
}

function startStream() {
    socket.emit( 'startStream' );
}

function retrieveFromDB () {

    // remove data from real-time sidebar
    document.getElementById( 'tweet-list' ).innerHTML = '';

    // remove data from all heatmaps
    clearMarkers();

    // tell server to retrieve and send all tweets from DB
    socket.emit( 'retrieveAll' );
}

function clearAllTweets() {
    document.getElementById( 'tweet-list' ).innerHTML = '';

    clearMarkers();
}

function clearMarkers() {
    setMap( inclementTweets, null );
    setMap( rainTweets, null );
    setMap( snowTweets, null );
    setMap( hailTweets, null );
    setMap( windTweets, null );
    setMap( iceTweets, null );
    setMap( fireTweets, null );
}

function setMap(markers, map) {
    for ( let i = 0; i < markers.length; i++) {
        markers[i].setMap( map );
    }
}


