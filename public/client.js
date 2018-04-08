let map;
let inclementTweets = [],    // rgba( 0, 255, 0, 1)
    rainTweets = [],         // rgba( 255, 165, 0, 1)
    snowTweets = [],         // rgba( 0, 255, 255, 1)
    hailTweets = [],         // rgba( 219, 112, 147, 1)
    windTweets = [],         // rgba( 255, 20, 147, 1)
    iceTweets = [];          // rgba( 139, 0, 139, 1)
let live = true,
    inclement = true,
    rain = true,
    snow = true,
    hail = true,
    wind = true,
    ice = true;

// initialize map
function initMap() {

    /* google map */
    let erieInsurance = { lat: 42.130601, lng: -80.083889 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: erieInsurance,
        gestureHandling: 'greedy'
    });

    /* legend */
    let legend = document.getElementById( 'legend' );
    map.controls[ google.maps.ControlPosition.RIGHT_BOTTOM ].push( legend );

    /* search bar */
    let searchBar = document.getElementById( 'search-bar' );
    map.controls[ google.maps.ControlPosition.TOP ].push( searchBar );

    // TODO: enable retrieve
    //retrieveFromDB();
}

let socket = io();

/**
 * add point to array and show it on map when it's received from the server
 */
socket.on('tweetEvent', function( tweet ) {
    if ( live )
        showTweet( tweet, 'tweet-content-body' );
});

socket.on( 'getTweets', function( tweets ) {
    console.log( 'got tweet' );
    showTweets( tweets );
});

/**
 ***** search functions *****
 */
function search() {
    let keywords = getKeywodrs();
    let cities = getCities();
    let states = getStates();

    let searchVars = {
        keywords: keywords,
        cities: cities,
        states: states
    };

    clearAllTweets();
    socket.emit( 'searchEvent', searchVars );
}

function getKeywodrs() {
    let keywords = document.getElementById( 'keyword-search' ).value;
    keywords.split( ' ' );

    console.log( keywords.toString() );

    return keywords;
}

function getCities() {
    let cities = document.getElementById( 'city-search' ).value;
    cities.split( ' ' );

    console.log( cities.toString() );

    return cities;
}

function getStates() {

    let pa = document.getElementById( 'dropdown-pa' ).classList.contains( 'active' );
    let ny = document.getElementById( 'dropdown-ny' ).classList.contains( 'active' );
    let oh = document.getElementById( 'dropdown-oh' ).classList.contains( 'active' );

    let states = [];

    if ( pa )
        states.push( 'pa' );
    if ( ny )
        states.push( 'ny' );
    if ( oh )
        states.push( 'oh' );

    return states;
}
/**
 ***** ***** *****
 */

function showTweets( tweets ) {
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

function addToSidebar( tweet, color ) {

    let image = addImage( tweet );
    let user = tweet.user;

    let profilePic = user.profile_image_url;
    let name = user.name;
    let handle = user.screen_name;
    let header = addHeader( profilePic, name, handle );

    let text = tweet.text;

    let tweetContent = document.getElementById( 'tweet-content' );
    let tweetList = document.getElementById( 'tweet-list' );

    tweetList.innerHTML +=
        '<li class="list-group-item p-0 unhighlighted onclick=highlight(this)">' +
            '<div class="card" style="border-left: 6px solid' + color +'">' +

            <!-- Tweet Image -->
            image +

            <!-- Tweet Text Content -->
            '<div class="card-body">' +
                <!-- Header -->
                header +
                <!--Text-->
                '<p class="card-text">' + text + ' </p>' +
                '</div>' +
            '</div>' +
        '</li>';

    scrollToBottom();
}

function scrollToBottom() {
    let tweetContent = document.getElementById( 'tweet-content' );
    tweetContent.scrollTop = tweetContent.scrollHeight;
}

function addImage() {
    return '';//'<img class="img-fluid" src="https://mdbootstrap.com/img/Photos/Others/images/43.jpg" alt="Card image cap">';
}

function addHeader( profilePic, name, handle ) {

    return (
        '<div class="card-title">' +
            '<div class="row pl-3">' +
                '<img src="' + profilePic + '" onerror="this.src=\'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png\';" alt class="profile-pic mr-2" >' +
                '<div>' +
                    '<div class="twitter-name mb-0"><strong>' + name + '</strong></div>' +
                    '<div class="twitter-handle">' + '@' + handle + '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
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
    }
}

function showTweet( tweet ) {
    let color = getColor( tweet.NLUEntity );
    addToMap( tweet, color );
    addToSidebar( tweet, color );
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