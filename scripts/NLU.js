/**
 * Functions for the Natural Language Understanding service
 */
let format = require( 'string-format' );
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const natural_language_understanding = new NaturalLanguageUnderstandingV1({
    'username': '8860f42b-746f-4caf-a8f1-644e818edff1',
    'password': 'YcyrpHN1hyw6',
    'version_date': '2017-02-27'
});

let ex = module.exports = {};

/**
 * check with the natural language understanding to see if the tweet's text is weather-related
 */
function classify ( tweet, addTweetToDB, clientCallback) {

    let parameters = {
        'text': tweet.text,
        'features': {
            'entities': {
                "model": "10:bfa6aa14-6fb6-4bc0-8e94-0c44020b680c"
            },
            'categories': {
                "model": "10:bfa6aa14-6fb6-4bc0-8e94-0c44020b680c"
            }
        }
    };

    natural_language_understanding.analyze(parameters, function ( err, response ) {

        if ( err )
            console.log( 'error:', err );
        else {
            try {
                let label = response.categories[0].label.toString();
                let entities = [];
                if ( response.entities.length > 0 ) {
                    entities = response.entities;
                }

                let isAWeatherTweet = ex.isWeather( label );

                // add highest matching label and entities to tweet
                tweet.NLULabel = label;
                tweet.NLUEntities = entities;
                printInfo( tweet, isAWeatherTweet );

                if ( isAWeatherTweet ) {
                    // add tweet to database
                    addTweetToDB( tweet );

                    // send data to client
                    clientCallback( tweet );
                }
            } catch ( err ) {
                console.log( err );
            }
        }
    });
}

/**
 * split the label that's returned by understanding to see if a category is weather
 * @param label
 * @returns {boolean}
 */
function isWeather (label) {
    let labels = label.split('/');
    return labels.includes( 'weather' );
}

/**
 * prints info about the returned NLU JSON object and corresponding tweet
 */
function printInfo( tweet, isAWeatherTweet ) {

    let entities = tweet.NLUEntities;
    let entitiesString = '';
    if ( entities.length > 0 ) {
        for (let i = 0; i < entities.length; i++) {
            entitiesString += format('Type: {0} | Subtype: {1}\n',
                entities[i].type,
                entities[i].disambiguation.subtype);
        }
    } else {
        entitiesString = 'Could not define entities\n';
    }

    if ( !isAWeatherTweet ) {
        console.log(
            '******* NLU Top Label *******\n' +
            tweet.NLULabel + '\n' +
            '******* WKS-NLU Entities *******\n' +
            entitiesString +

            '/******* Tweet Text *******\n' +
            tweet.text + '\n\n'
        );
        return;
    }

    console.log(
        '\\********************************************************\\\n' +
        '\\************************************************\\\n\n' +
        //'******* Response from NLU *******\n' +
        //JSON.stringify(response, null, 2) + '\n\n' +

        '******* NLU Top Label *******\n' +
        tweet.NLULabel + '\n\n' +

        '******* WKS-NLU Entities *******\n' +
        entitiesString + '\n' +

        '/******* Tweet Text *******\n' +
        tweet.text + '\n\n' +
        '\\************************************************\\\n' +
        '\\********************************************************\\\n');
}

ex.classify = classify;
ex.isWeather = isWeather;

