let map;
let inclementTweets,    // rgba( 0, 255, 0, 1)
    rainTweets,         // rgba( 255, 165, 0, 1)
    snowTweets,         // rgba( 0, 255, 255, 1)
    sleetTweets,        // rgba( 123, 104, 238, 1)
    hailTweets,         // rgba( 219, 112, 147, 1)
    windTweets,         // rgba( 255, 20, 147, 1)
    iceTweets,          // rgba( 139, 0, 139, 1)
    fireTweets;         // rgba( 233, 150, 122, 1)
let inclementHeatmap,
    rainHeatmap,
    snowHeatmap,
    sleetHeatmap,
    hailHeatmap,
    windHeatmap,
    iceHeatmap,
    fireHeatmap;
let tweetCount = 0;

// initialize map
function initMap() {

    /* google map */
    let behrend = {lat: 42.119308, lng: -79.983714};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: behrend
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
        radius: 16
    });

    sleetTweets = new google.maps.MVCArray();
    sleetHeatmap = new google.maps.visualization.HeatmapLayer({
        data: sleetTweets,
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

    tweetCount++;
    let geoPoint = tweet.geoPoint;
    let text = tweet.text;
    let key = geoPoint.lat.toFixed(5) + ' ' + geoPoint.lng.toFixed(5);
    console.log('tweet #' + tweetCount + ': ' + text
        + '\n\n' + key);
    let marker = new google.maps.LatLng(geoPoint.lat, geoPoint.lng);

    /* put tweet in according heatmap */
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
        case "SLEET" :
            sleetTweets.push( marker );
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

    // sets timeout for markers (they're only visible for 5 minutes (300000 ms))
    //setTimeout(function () {
    //    mainTweets.removeAt(0);
    //}, 300000);

    // add tweet to sidebar feed
    let p = document.createElement("P");
    p.innerHTML = text;
    p.id = key;


    document.getElementById("cardOne").appendChild(p);
});