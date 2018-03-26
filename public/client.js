let map;
let inclementTweets = [],    // rgba( 0, 255, 0, 1)
    rainTweets = [],         // rgba( 255, 165, 0, 1)
    snowTweets = [],         // rgba( 0, 255, 255, 1)
    hailTweets = [],         // rgba( 219, 112, 147, 1)
    windTweets = [],         // rgba( 255, 20, 147, 1)
    iceTweets = [],          // rgba( 139, 0, 139, 1)
    fireTweets = [];         // rgba( 233, 150, 122, 1)
let live = true,
    inclement = true,
    rain = true,
    snow = true,
    hail = true,
    wind = true,
    ice = true,
    fire = true;

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
    if ( live )
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

function addToMap( tweet, color ) {
    let marker = setMarker( tweet.geoPoint, color );
    addToList( tweet.NLUEntity, marker );
}

function addToList( entity, marker ) {
    switch ( entity ) {
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
    }
}

function setMarker( geoPoint, color ) {

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
            lat: geoPoint.lat,
            lng: geoPoint.lng
        },
        icon: mapIcon,
        map: map
    });
}

function addToSidebar( text, color ) {
    let li = document.createElement( 'li' );
    li.classList.add( 'list-group-item' );
    li.style.borderLeft = '4px solid ' + color;
    li.innerHTML = text;
    document.getElementById( 'tweet-list' ).appendChild( li );

    // sets timeout for markers (they're only visible for 5 minutes (300000 ms))
    //setTimeout(function () {
    //    tweets.removeAt(0);
    //}, 300000);
}

function getColor( entity ) {
    switch ( entity ) {
        case "INCLEMENT_WEATHER":
            return '#76ff03';
        case "RAIN" :
            return '#ff9800';
        case "SNOW" :
            return '#2962ff';
        case "HAIL" :
            return '#9c27b0';
        case "WIND" :
            return '#ffff00';
        case "ICE" :
            return '#18ffff';
        case "FIRE":
            return '#f44336';
    }
}

function showTweet( tweet ) {
    let color = getColor( tweet.NLUEntity );
    addToMap( tweet, color );
    addToSidebar( tweet.text, color );
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

function setMap( markers, map) {
    for ( let i = 0; i < markers.length; i++) {
        markers[i].setMap( map );
    }
}

/** button functions **/
function setLive() {
    live = !live;
}

function setInclement() {
    inclement = !inclement;
    setMap( inclementTweets, inclement ? map : null );
}
function setRain() {
    rain = !rain;
    setMap( rainTweets, rain ? map : null );
}
function setSnow() {
    snow = !snow;
    setMap( snowTweets, snow ? map : null );
}
function setHail() {
    hail = !hail;
    setMap( hailTweets, hail ? map : null );
}
function setWind() {
    wind = !wind;
    setMap( windTweets, wind ? map : null );
}
function setIce() {
    ice = !ice;
    setMap( iceTweets, ice ? map : null );
}
function setFire() {
    fire = !fire;
    setMap( fireTweets, fire ? map : null );
}