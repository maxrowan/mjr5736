/**
 * connect to database and insert tweet
 */
let MongoClient = require( 'mongodb' ).MongoClient;
let uri = "mongodb://mjr5736:sen!0rDesign@seniordesign-shard-00-00-hiyas.mongodb.net:27017,seniordesign-shard-00-01-hiyas.mongodb.net:27017,seniordesign-shard-00-02-hiyas.mongodb.net:27017/test?ssl=true&replicaSet=SeniorDesign-shard-0&authSource=admin";
let ex = module.exports = {};


//Global Variable for ssearch

let keyForDB, cityStateForDB,sDate,eDate;

function addTweetToDB( tweet ) {
	MongoClient.connect( uri, function ( err, db ) {
		if ( err ) throw err;

		let database = db.db( "test" );
		let collection = database.collection( "test" );
		collection.createIndex( { id: tweet.id }, { unique: true } );   // checks for tweet uniqueness
		collection.insertOne( tweet, function ( err, res ) {
			if ( err ) throw err;
			console.log( '\n\nInserted in database!\n\n' );
		} );

		db.close();
	} );
}

function getAllTweetsFromDB( sendTweets, socket ) {
	MongoClient.connect( uri, function ( err, db ) {
		if ( err ) throw err;

		let database = db.db( "test" );
		let collection = database.collection( "test" );
		collection.find().toArray( function ( err, result ) {
			sendTweets( result, socket );
			db.close();
		} );
	} );
}

function getSearchResults( searchVars, sendTweets, socket ) {
	printRes( searchVars );
	let key = keyForDB;
	let city = cityStateForDB
	let start = sDate;
	let end = eDate;
	MongoClient.connect( uri, function ( err, db ) {

		if ( err ) throw err;
		let any = ".*";
		//let tempDate = new Date("Sun Apr 1 21:46:15 +0000 2017".toISOString())
		let database = db.db( "test" );
		let collection = database.collection( "test" );
		if ( city == "" )
			city = any;
		if ( key == "" )
			key = any;
		collection.find(
			//{"text":{$regex: "(.*snow*.|rain)"}},

			{
				$and:
					[       // search for key word
						//{"place.full_name":{$regex:any}},
						//text search regext snow or rain or fire
						//{"text":{$regex: "(.*snow*.)"}},
						//{"place.place_type":{$regex:"city"}}

						// find place by its location

						{ "place.full_name": { $regex: city } },
						// text search regext snow or rain or fire
						{ "text": { $regex: key } },
						{ "place.place_type": { $regex: "city" } },
						/*{
							created_at: {
								$gte: ISODate(start),
								$lt: ISODate(end)
							}
						}*/

					]

			}
		).toArray( function ( err, result ) {
			//Wconsole.log(result);
			sendTweets( result, socket );
			db.close();
		} );
	} );
	keyForDB = "" , cityStateForDB = "", sDate0 = "", eDate;

}
function printRes( searchVars ) {

	let keywords = searchVars.keywords,
		cities = searchVars.cities,
		states = searchVars.states,
		startDate = searchVars.startDate,
		endDate = searchVars.endDate;
	let k = '',
		c = '',
		s = '';

	if ( keywords !== undefined )
	{
		k = keywords;
		keyForDB = splitWord(k , ' ');
		console.log(keyForDB+ " Key For DB");
	}
	else
		k = 'couldn\'t get keywords';
	if ( states !== undefined )
	{
		s = states;
		if(s.length != 0 )
			cityStateForDB = splitWord(s , ',')
	}
	else
	{
		s = 'couldn\'nt get states';
	}
	if ( cities !== undefined )
	{
		c = cities;
		if(s.length != 0 )
			cityStateForDB += "|" + c +")";

	}
	else{
		c = 'couldn\'t get cities';
		if(s.length != 0 )
			cityStateForDB += ")";
	}/*
    console.log( '\n\n' +
        k.toString() + '\n' +
        c.toString() + '\n' +
        s.toString() + '\n' +
        startDate.toString() + '\n' +
        endDate.toString() + '\n\n'
    );*/
	return null;
}
function splitWord(str, splitVal)
{   var returnStr = "(";

	//for state
	if(splitVal == ',')
	{var temparray = str;
		temparray.forEach(function(e,i,array)
		{  if(i == 0)
		{   var temp = e.toUpperCase();
			returnStr += e;
			returnStr += "|" +temp
		}
		else
		{   var temp = e.toUpperCase();
			returnStr += "|"+e;
			returnStr += "|" +temp
		}
		})
	}
	else if (splitVal == ' ')
	{
		console.log(str)
		var temparray = str;
		temparray.forEach(function(e,i,array)
		{  if(i == 0)
		{
			returnStr += ".*"+e;
		}
		else
		{
			returnStr += "|.*"+e;
		}
		})
		returnStr+= ")"
	}
	return returnStr;
}

ex.addTweetToDB = addTweetToDB;
ex.getAllTweetsFromDB = getAllTweetsFromDB;
ex.getSearchResults = getSearchResults;