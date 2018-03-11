const nlu = require ('../scripts/NLU');

test( 'splits string to see if weather is correctly recognized as such', () => {
    expect( nlu.isWeather( '/science/weather/natural disaster' )).toBe( true );
});

test( 'assert that weather tweets are classified correctly', done => {

    // mock tweet
    let mockTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'Ice storm...I had the day off, but most places are closed today.',
        geoPoint: {
            lat: 26.71903,
            lng: -80.05049
        },
        geo: { type: 'Point', coordinates: [ 26.71903, -80.05049 ] },
        coordinates: { type: 'Point', coordinates: [ -80.05049, 26.71903 ] },
        place:
            { id: '4de072969805ac41',
                url: 'https://api.twitter.com/1.1/geo/id/4de072969805ac41.json',
                place_type: 'city',
                name: 'West Palm Beach',
                full_name: 'West Palm Beach, FL',
                country_code: 'US',
                country: 'United States',
                bounding_box: { type: 'Polygon', coordinates: [Array] },
                attributes: {} },
    };

    // mock callbacks
    function dontAddToDB( tweet ) {}
    function mockClientCallback( tweet ) {

        /*
        console.log('\\********************************************************\\\n' +
            '\\************************************************\\\n\n' +
            //console.log('\n' + JSON.stringify(response, null, 2) + '\n') +
            tweet.NLULabel + '\n' +
            tweet.NLUEntity + '\n' +
            tweet.text + '\n\n' +
            '\\************************************************\\\n' +
            '\\********************************************************\\');
        */

        expect( tweet ).toBe( mockTweet );

        let isWeatherLabel = nlu.isWeather( tweet.NLULabel );
        expect( isWeatherLabel ).toBe( true );

        done();
    }

    // test getClassification
    nlu.classify( mockTweet, dontAddToDB, mockClientCallback);
});

test( 'assert that non-weather tweets are classified correctly', done => {

    // mock data
    let mockTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'I think I\'m going to go ice skating this weekend!',
        geoPoint: {
            lat: 26.71903,
            lng: -80.05049
        },
        geo: { type: 'Point', coordinates: [ 26.71903, -80.05049 ] },
        coordinates: { type: 'Point', coordinates: [ -80.05049, 26.71903 ] },
        place:
            { id: '4de072969805ac41',
                url: 'https://api.twitter.com/1.1/geo/id/4de072969805ac41.json',
                place_type: 'city',
                name: 'West Palm Beach',
                full_name: 'West Palm Beach, FL',
                country_code: 'US',
                country: 'United States',
                bounding_box: { type: 'Polygon', coordinates: [Array] },
                attributes: {} },
    };

    // mock callbacks
    function dontAddToDB( tweet ) {}
    function mockClientCallback( tweet ) {
        done();
    }

    // mock isWeather
    nlu.isWeather = jest.fn().mockImplementation( ( label ) => {

        let labels = label.split('/');
        let w = labels.includes( 'weather' );

        expect( w ).toBe( false );

        done();
    });

    // test getClassification
    nlu.classify( mockTweet, dontAddToDB, mockClientCallback);
});

