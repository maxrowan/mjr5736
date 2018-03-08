let map;
let inclementTweets,
    rainTweets,
    snowTweets,
    sleetTweets,
    hailTweets,
    windTweets,
    iceTweets,
    fireTweets;
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

    /* Inclement heatmap */
    inclementTweets = new google.maps.MVCArray();
    inclementHeatmap = new google.maps.visualization.HeatmapLayer({
        data: inclementTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]
    });

    rainTweets = new google.maps.MVCArray();
    rainHeatmap = new google.maps.visualization.HeatmapLayer({
        data: rainTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]
    });

    snowTweets = new google.maps.MVCArray();
    snowHeatmap = new google.maps.visualization.HeatmapLayer({
        data: snowTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]
    });

    sleetTweets = new google.maps.MVCArray();
    sleetHeatmap = new google.maps.visualization.HeatmapLayer({
        data: sleetTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]
    });

    hailTweets = new google.maps.MVCArray();
    hailHeatmap = new google.maps.visualization.HeatmapLayer({
        data: hailTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]
    });

    windTweets = new google.maps.MVCArray();
    windHeatmap = new google.maps.visualization.HeatmapLayer({
        data: windTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]
    });

    iceTweets = new google.maps.MVCArray();
    iceHeatmap = new google.maps.visualization.HeatmapLayer({
        data: iceTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ]
    });

    fireTweets = new google.maps.MVCArray();
    fireHeatmap = new google.maps.visualization.HeatmapLayer({
        data: fireTweets,
        map: map,
        radius: 16,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
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