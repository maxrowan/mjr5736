let map;

let entityContainers = [
    {
        entityType: 'INCLEMENT_WEATHER',
        color: '#76ff03',
        markers: [],
        idIndexMapping: []
    },
    {
        entityType: 'RAIN',
        color: '#ff9800',
        markers: [],
        idIndexMapping: []
    },
    {
        entityType: 'SNOW',
        color: '#2962ff',
        markers: [],
        idIndexMapping: []
    },
    {
        entityType: 'HAIL',
        color: '#9c27b0',
        markers: [],
        idIndexMapping: []
    },
    {
        entityType: 'WIND',
        color: '#ffff00',
        markers: [],
        idIndexMapping: []
    },
    {
        entityType: 'ICE',
        color: '#18ffff',
        markers: [],
        idIndexMapping: []
    }
];

function getContainerByEntity( entity, callback ) {
    for ( let i = 0; i < entityContainers.length; i++ ) {
        if ( entityContainers[i].entityType === entity ) {
            callback( entityContainers[i] );
            return;
        }
    }
}

function getContainerMappingIndex( container, id, callback ) {
    for ( let i = 0; i < container.idIndexMapping.length; i++ ) {
        if ( container.idIndexMapping[i].id == id ) {
            callback( container.idIndexMapping[i] );
        }
    }
}

let live = true;

// initialize map
function initMap() {

    /* google map */
    let erieInsurance = { lat: 42.130601, lng: -80.083889 };
    map = new google.maps.Map( document.getElementById( 'map' ), {
        zoom: 6,
        center: erieInsurance,
        gestureHandling: 'greedy'
    } );

    /* legend */
    let legend = document.getElementById( 'legend' );
    map.controls[ google.maps.ControlPosition.RIGHT_BOTTOM ].push( legend );

    /* search bar */
    let searchBar = document.getElementById( 'search-bar' );
    map.controls[ google.maps.ControlPosition.TOP ].push( searchBar );

    // TODO: enable retrieve
    retrieveFromDB();
}

let socket = io();

/**
 * add point to array and show it on map when it's received from the server
 */
socket.on( 'tweetEvent', function ( tweet ) {
    if ( live )
        showTweet( tweet, 'tweet-content-body' );
} );

socket.on( 'getTweets', function ( tweets ) {
    console.log( 'got tweet' );
    showTweets( tweets );
} );

/**
 ***** search functions *****
 */
function search() {
    let keywords = getKeywords();
    let cities = getCities();
    let states = getStates();
    let startDate = getStartDate();
    let endDate = getEndDate();

    let searchVars = {
        keywords: keywords,
        cities: cities,
        states: states,
        startDate: startDate,
        endDate: endDate
    };

    if ( live ) {
        liveSearch( keywords );
    } else {
        eraseAll();
        socket.emit( 'searchEvent', searchVars );
    }
}

function getKeywords() {
    let keywords = document.getElementById( 'keyword-search' ).value;
    return keywords.split( ' ' );
}

function getCities() {
    let cities = document.getElementById( 'city-search' ).value;
    return cities.split( ' ' );
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

function getStartDate() {
    return document.getElementById( 'start-date-search' ).value;
}

function getEndDate() {
    return document.getElementById( 'end-date-search' ).value;
}

function liveSearch( keywords ) {
    let ul = document.getElementById( 'tweet-list' );
    let tweetItems = ul.getElementsByTagName( 'li' );

    let expression = new RegExp( buildRegExpression( keywords ), 'i' );

    for ( let i = 0; i < tweetItems.length; i++ ) {                             // for each tweet in the ul
        let li = tweetItems[ i ];
        let text = li.getElementsByClassName( 'card-text' )[ 0 ].innerHTML;

        if ( !expression.test( text ) ) {                                       // if the text does not contain the keyword
            let entity = getLiEntity( li );                                     // get entity type of id
            hideBySearch( li, entity );                                         // hide list and map element
        }
    }

    // TODO: reset lists
    // TODO: add filter to incoming tweets
}

function buildRegExpression( keywords ) {
    let expression = '';

    for ( let i = 0; i < keywords.length; i++ ) {
        if ( i === 0 ) {
            expression += '(' + keywords[ i ];
        } else {
            expression += keywords[ i ];
        }

        try {
            if ( keywords[ i + 1 ] !== undefined ) {
                expression += '|'
            }
        } catch ( e ) {
            console.error( 'regEx', e.message );
        }

        if ( i === keywords.length - 1 ) {
            expression += ')';
        }
    }

    return expression;
}

function getLiEntity( li ) {
    let classes = li.classList;

    for ( let i = 0; i < classes.length; i++) {
        for ( let j = 0; j < entityContainers.length; j++ ) {
            if ( classes[i] === entityContainers[j].entityType ) {
                return classes[i];
            }
        }
    }

    return '';
}

function hideBySearch( li, entity ) {
    let id = li.id;

    hideTweetListItem( id );                                                    // set sidebar li with corresponding id to hidden

    getContainerByEntity( entity, function( container ) {
        getContainerMappingIndex( container, id, function( map ) {
            hideMarker( container.markers[ map.index ] );
            map.searchHidden = true;
        } );
    });
}

function hideMarker( marker ) {
    marker.setMap( null );
}

function hideTweetListItem( id ) {
    let li = document.getElementById( id );
    if ( li.classList.contains( 'hide_by_search' ) ) {
        li.classList.remove( 'hide_by_search' );
    } else {
        li.classList.add( 'hide_by_search' );
    }
}

/**
 ***** ***** *****
 */


/**
 ***** post functions *****
 */
function showTweets( tweets ) {
    for ( let i = 0; i < tweets.length; i++ ) {
        showTweet( tweets[ i ] );
    }
}

function showTweet( tweet ) {
    getContainerByEntity( tweet.NLUEntity, function( container ) {
        let color = container.color;
        addToMap( tweet, container );
        addToSidebar( tweet, color );
    } );
}

/**
 *** post to map functions ***
 */
function addToMap( tweet, container ) {
    let marker = createMarker( tweet.geoPoint, container.color );
    container.markers.push( marker );

    // maps tweet id (li id) to list position
    container.idIndexMapping.push( {
        id: tweet.id,
        index: container.markers.indexOf( marker ),
        searchHidden: false,
        toggleHidden: false
    } );
}

function createMarker( geoPoint, color ) {

    let mapIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 0.5,
        scale: 10,
        strokeColor: 'white',
        strokeWeight: 1
    };

    return new google.maps.Marker( {
        position: {
            lat: geoPoint.lat,
            lng: geoPoint.lng
        },
        icon: mapIcon,
        map: map
    } );
}
/**
 *** *** ***
 */


/**
 *** post to sidebar functions ***
 */
function addToSidebar( tweet, color ) {

    let classEntity = tweet.NLUEntity;
    let id = tweet.id;
    let image = addImage( tweet.entities );
    let user = tweet.user;
    let profilePic = user.profile_image_url;
    let name = user.name;
    let handle = user.screen_name;
    let header = addHeader( profilePic, name, handle );
    let text = tweet.text;
    let timestamp = getTimestamp( tweet.created_at );

    let tweetList = document.getElementById( 'tweet-list' );

    tweetList.innerHTML +=
        '<li id="' + id + '" class="list-group-item p-0 unhighlighted onclick=highlight(this) ' + classEntity + '">' +
        '<div class="card" style="border-left: 6px solid' + color + '">' +

        <!-- Tweet Image -->
        image +

        <!-- Tweet Text Content -->
        '<div class="card-body">' +
        <!-- Header -->
        header +
        <!--Text-->
        '<p class="card-text">' + text + '</p>' +
        // TODO: add Timestamp
        '</div>' +
        '</div>' +
        '</li>';

    scrollToBottom();
}

function addImage( entities ) {

    let img = '';
    if ( entities.media !== undefined ) {
        img = '<img class="img-fluid" src="' + entities.media[ 0 ].media_url + '" alt="Card image cap">';
    }
    return img;
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

function getTimestamp( date ) {
    return (
        '<div>' +
        // TODO: finish Timestamp
        '</div>'
    );
}
/**
 *** *** ***
 ***** ***** *****
 */

function retrieveFromDB() {
    eraseAll();                                             // remove all data

    socket.emit( 'retrieveAll' );                           // tell server to retrieve and send all tweets from DB
}

function eraseAll() {
    eraseMap();
    eraseSidebar();
}

function eraseMap() {

    for ( let i = 0; i < entityContainers.length; i++ ) {
        setMap( entityContainers[i].markers, null );
        entityContainers[i].markers = [];
    }
}

function eraseSidebar() {
    document.getElementById( 'tweet-list' ).innerHTML = '';
}

function setMap( markers, map ) {
    for ( let i = 0; i < markers.length; i++ ) {
        markers[ i ].setMap( map );
    }
}

function scrollToBottom() {
    let tweetContent = document.getElementById( 'tweet-content' );
    tweetContent.scrollTop = tweetContent.scrollHeight;
}

/**
 ***** options menu functions *****
 */
function setLive() {
    live = !live;
}

function hideInclement() {
    toggleEntityHidden( 'INCLEMENT_WEATHER' );
}

function hideRain() {
    toggleEntityHidden( 'RAIN' );
}

function hideSnow() {
    toggleEntityHidden( 'SNOW' );
}

function hideHail() {
    toggleEntityHidden( 'HAIL' );
}

function hideWind() {
    toggleEntityHidden( 'WIND' );
}

function hideIce() {
    toggleEntityHidden( 'ICE' );
}

function toggleEntityHidden( entity ) {
    getContainerByEntity( entity, function( container ) {
        for ( let i = 0; i < container.idIndexMapping.length; i++ ) {
            toggleMarker( container.markers, container.idIndexMapping[i] );
        }
    });
}

function toggleMarker( markers, mapping ) {
    if ( !mapping.searchHidden ) {
        if ( !mapping.toggleHidden ) {
            markers[ mapping.index ].setMap( null );
        } else {
            markers[ mapping.index ].setMap( map );
        }

        mapping.toggleHidden = !mapping.toggleHidden;
    }
}

/**
 ***** ***** *****
 */

$( document ).ready( function () {
    $( "#live-btn" ).click( function () {
        $( this ).toggleClass( 'btn-blue-grey btn-outline-blue-grey' );
        if ( $( this ).text() === "Live" ) {
            $( this ).text( "Historical" );
        } else {
            $( this ).text( "Live" );
        }
    } );

    /* state drop-down toggles */
    $( '.dropdown-menu' ).click( function ( e ) {
        e.stopPropagation();
    } );
    $( "#dropdown-pa" ).click( function () {
        $( this ).toggleClass( 'active' );
    } );
    $( "#dropdown-ny" ).click( function () {
        $( this ).toggleClass( 'active' );
    } );
    $( "#dropdown-oh" ).click( function () {
        $( this ).toggleClass( 'active' );
    } );

    /* entity type toggles */
    $( '#inclement-toggle' ).click( function () {
        $( '#inclement-box' ).toggleClass( 'empty' );
        $( '.INCLEMENT_WEATHER' ).toggleClass( 'hide_by_entity' );
    } );
    $( '#rain-toggle' ).click( function () {
        $( '#rain-box' ).toggleClass( 'empty' );
        $( '.RAIN' ).toggleClass( 'hide_by_entity' );
    } );
    $( '#snow-toggle' ).click( function () {
        $( '#snow-box' ).toggleClass( 'empty' );
        $( '.SNOW' ).toggleClass( 'hide_by_entity' );
    } );
    $( '#hail-toggle' ).click( function () {
        $( '#hail-box' ).toggleClass( 'empty' );
        $( '.HAIL' ).toggleClass( 'hide_by_entity' );
    } );
    $( '#wind-toggle' ).click( function () {
        $( '#wind-box' ).toggleClass( 'empty' );
        $( '.WIND' ).toggleClass( 'hide_by_entity' );
    } );
    $( '#ice-toggle' ).click( function () {
        $( '#ice-box' ).toggleClass( 'empty' );
        $( '.ICE' ).toggleClass( 'hide_by_entity' );
    } );
} );


/*******************
 * ADMIN FUNCTIONS *
 *******************/
function stopStream() {
    socket.emit( 'stopStream' );
}

function startStream() {
    socket.emit( 'startStream' );
}

/*******************
 *******************
 *******************/