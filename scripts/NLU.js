/**
 * Functions for the Natural Language Understanding service
 */

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username': '8860f42b-746f-4caf-a8f1-644e818edff1',
    'password': 'YcyrpHN1hyw6',
    'version_date': '2017-02-27'
});




/**
 * check with the natural language understanding to see if the tweet's text is weather-related
 */
var nluFunctions = {
    getClassification: function ( data, dbCallback, clientCallback) {

        var tweet = data.tweet;
        var text = tweet.text;
        var geoPoint = data.geoPoint;

        var parameters = {
            'text': text,
            'features': {
                'entities': {
                    "model": "10:3f2420ec-329d-49d9-bfb2-6ed7a54337ed"
                },
                'categories': {
                    "model": "10:3f2420ec-329d-49d9-bfb2-6ed7a54337ed"
                }
            }
        };


        natural_language_understanding.analyze(parameters, function (err, response) {
            if (err)
                console.log('error:', err);
            else {
                try {
                    //console.log(JSON.stringify(response, null, 2));
                    var label = response.categories[0].label.toString();
                    //var entity = response.entities[0].label.toString();

                    if ( isWeather( label )) {

                        console.log( '\n\\********************************************************\\\n' );
                        console.log( '\n' + JSON.stringify(response, null, 2) + '\n' );
                        console.log( '\n' + label + '\n' );
                        console.log( '\n' + parameters.text + '\n' );
                        console.log( '\n\\********************************************************\\\n' );

                        // add tweet to database
                        dbCallback( tweet );

                        // send data to client
                        clientCallback( geoPoint, tweet );

                    } else {
                        console.log(label);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }
};

function isWeather (label) {
    var labels = label.split('/');

    for (var i = 0; i < labels.length; i++) {
        if (labels[i] === 'weather') {
            return true;
        }
    }
    return false;
}

module.exports = nluFunctions;

