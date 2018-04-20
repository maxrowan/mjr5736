/**
 * Functions for the Natural Language Understanding service
 */
const NaturalLanguageUnderstandingV1 = require( 'watson-developer-cloud/natural-language-understanding/v1.js' );
const natural_language_understanding = new NaturalLanguageUnderstandingV1( {
	'username': 'cfb54b2a-e1f3-4fb0-a565-5ff229f20f67',
	'password': 'fFdDZIwG2QUQ',
	'version_date': '2017-02-27'
} );
const wks_model_id = '10:40ec8277-7949-49c9-8ffc-1f7b1a53e546';

let ex = module.exports = {};

/**
 * check with the natural language understanding to see if the tweet's text is weather-related
 */
function classify( tweet, addTweetToDB, clientCallback ) {

	let parameters = {
		'text': tweet.text,
		'features': {
			'entities': {
				"model": wks_model_id
			},
			'categories': {
				"model": wks_model_id
			}
		}
	};

	natural_language_understanding.analyze( parameters, function ( err, response ) {

		if ( err )
			console.log( 'error:', err );
		else {
			try {
				let label = getLabel( response.categories );
				let entity = getEntity( response.entities );

				let isAWeatherTweet = ex.isWeather( label );
				let isAnInclementTweet = ex.isInclement( entity );

				// add highest matching label and most specific entity to tweet
				tweet.NLULabel = label;
				tweet.NLUEntity = entity;
				ex.printInfo( tweet, response.entities, isAWeatherTweet, isAnInclementTweet );

				if ( isAWeatherTweet && isAnInclementTweet ) {
					// convert to ISO date
					formatDate( tweet );

					// add tweet to database
					addTweetToDB( tweet );

					// send data to client
					clientCallback( tweet );
				}
			} catch ( err ) {
				console.log( err );
			}
		}
	} );
}

/**
 * split the label that's returned by understanding to see if a category is weather
 * @param label
 * @returns {boolean}
 */
function isWeather( label ) {
	let labels = label.split( '/' );
	return labels.includes( 'weather' );
}

/**
 * determins if the weather is an inclement subtype or not
 * @param entity
 * @returns {boolean}
 */
function isInclement( entity ) {
	return (
		entity === "INCLEMENT_WEATHER" ||
		entity === "RAIN" ||
		entity === "SNOW" ||
		entity === "HAIL" ||
		entity === "WIND" ||
		entity === "ICE"
	);
}

/**
 * returns primary category label
 * @param categories
 * @returns {string}
 */
function getLabel( categories ) {
	let label = '';
	if ( categories.length > 0 ) {
		label = categories[ 0 ].label.toString();
	}
	return label;
}

/**
 * returns primary entity type or subtype of first weather entity encountered
 * @param entities
 * @returns {*}
 */
function getEntity( entities ) {

	let entity = 'Could not Classify';

	if ( entities !== undefined && entities[0] !== undefined ) {

		// TODO: get most common entity


		entity = entities[ 0 ].type;

		let subtype = '';
		let subtypes = [];

		// create array of weather subtypes
		for ( let i = 0; i < entities.length; i++ ) {
			if ( isWeatherEntity( entities[ i ] ) ) {
				subtype = entities[ i ].disambiguation.subtype[ 0 ];

				if ( subtype ) {
					subtypes.push( subtype );
				}
			}
		}

		return getMostCommonSubtype( subtypes );
	}
	return entity;
}

function getMostCommonSubtype( subtypes ) {
	return subtypes.sort( ( a, b ) =>
		subtypes.filter( v => v === a ).length
		- subtypes.filter( v => v === b ).length
	).pop();
}

function isWeatherEntity( entity ) {
	let type = entity.type;
	return (type === 'WEATHER')
}

/**
 * prints info about the returned NLU JSON object and corresponding tweet
 */
function printInfo( tweet, entities, weather, inclement ) {

	let label = tweet.NLULabel;
	let entity = tweet.NLUEntity;
	let text = tweet.text;

	if ( !weather || !inclement ) {
		console.log(
			'******* NLU Top Label *******\n' +
			label + '\n' +
			'******* WKS-NLU Entities *******\n' +
			entity + '\n' +

			'/******* Tweet Text *******\n' +
			text + '\n\n'
		);
	} else {
		let ents = '';

		for ( let i = 0; i < entities.length; i++ ) {
			ents += entities[ i ].disambiguation.subtype[ 0 ] + '\n';
		}


		console.log(
			'\\********************************************************\\\n' +
			'\\************************************************\\\n\n' +
			//'******* Response from NLU *******\n' +
			//JSON.stringify(response, null, 2) + '\n\n' +

			'******* NLU Top Label *******\n' +
			label + '\n\n' +

			'******* WKS-NLU Entities *******\n' +
			ents +

			'/******* Tweet Text *******\n' +
			text + '\n\n' +
			'\\************************************************\\\n' +
			'\\********************************************************\\\n'
		);
	}
}

function formatDate( tweet ) {
	let date = new Date( tweet.created_at );
	tweet.created_at = date.toISOString();
}

ex.classify = classify;
ex.isWeather = isWeather;
ex.isInclement = isInclement;
ex.printInfo = printInfo;

