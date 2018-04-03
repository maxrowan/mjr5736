const nlu = require ('../scripts/NLU');

test( 'splits string to see if weather is correctly recognized as such', () => {
    expect( nlu.isWeather( '/science/weather/natural disaster' )).toBe( true );
});

describe( 'Asserts that weather-related tweets are classified correctly', () => {

    // mock tweets
    let mockInclementTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'When theres really bad weather and they start announcing all of the sports that are canceled over the loud speaker',
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
    let mockRainTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'Good dreary, rainy, foggy, drizzly, misty, stormy morning everyone.',
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
    let mockSnowTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'Wednesday - Snow showers. Snow accumulation 3 to 5 inches. Highs in the 30s.',
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
    let mockHailTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'covered in hail earlier tonight.',
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
    let mockWindTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'It\'s super windy out today',
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
    let mockIceTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: 'Ice build-up from minor ice storm last week',
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
    let mockStationTweet = {
        created_at: "Mon Jan 1 00:00:00 +0000 2018",
        id: 999999999999999999,
        id_str: "999999999999999999",
        text: '#WEATHER:  11:56 pm: 69.0F. Feels F. 29.69% Humidity. 5.8MPH South Wind.',
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

    // dummy database callback
    function dummyAddToDB( tweet ) {}

    function logFail( label, entity, text ) {
        console.log(
            '******* NLU Top Label *******\n' +
            label + '\n' +
            '******* WKS-NLU Entities *******\n' +
            entity + '\n' +

            '/******* Tweet Text *******\n' +
            text + '\n\n'
        );
    }
    function logPass( label, entity, text ) {
        console.log(
            '\\********************************************************\\\n' +
            '\\************************************************\\\n\n' +

            '******* NLU Top Label *******\n' +
            label + '\n\n' +

            '******* WKS-NLU Entities *******\n' +
            entity+ '\n' +

            '/******* Tweet Text *******\n' +
            text + '\n\n' +
            '\\************************************************\\\n' +
            '\\********************************************************\\\n'
        );
    }

    test( 'assert that INCLEMENT_WEATHER tweets are classified correctly', done => {

        /**
         * printInfo mock
         */
        nlu.printInfo = jest.fn().mockImplementation(( tweet, weather, inclement ) => {
            expect( weather ).toBe( true );
            expect( inclement ).toBe( true );

            let label = tweet.NLULabel;
            let entity = tweet.NLUEntity;
            expect( entity ).toBe( 'INCLEMENT_WEATHER' );

            let text = tweet.text;

            if ( !weather || !inclement ) {
                logFail( label, entity, text );
                done();
            } else {
                logPass( label, entity, text );
            }
        });

        function dummyClientCallback( tweet ) {
            done();
        }

        // test getClassification
        nlu.classify( mockInclementTweet, dummyAddToDB, dummyClientCallback);
    });

    test( 'assert that RAIN tweets are classified correctly', done => {

        /**
         * printInfo mock
         */
        nlu.printInfo = jest.fn().mockImplementation(( tweet, weather, inclement ) => {
            expect( weather ).toBe( true );
            expect( inclement ).toBe( true );

            let label = tweet.NLULabel;
            let entity = tweet.NLUEntity;
            expect( entity ).toBe( 'RAIN' );

            let text = tweet.text;

            if ( !weather || !inclement ) {
                logFail( label, entity, text );
                done();
            } else {
                logPass( label, entity, text );
            }
        });

        function dummyClientCallback( tweet ) {
            done();
        }

        // test getClassification
        nlu.classify( mockRainTweet, dummyAddToDB, dummyClientCallback);
    });

    test( 'assert that SNOW tweets are classified correctly', done => {

        /**
         * printInfo mock
         */
        nlu.printInfo = jest.fn().mockImplementation(( tweet, weather, inclement ) => {
            expect( weather ).toBe( true );
            expect( inclement ).toBe( true );

            let label = tweet.NLULabel;
            let entity = tweet.NLUEntity;
            expect( entity ).toBe( 'SNOW' );

            let text = tweet.text;

            if ( !weather || !inclement ) {
                logFail( label, entity, text );
                done();
            } else {
                logPass( label, entity, text );
            }
        });

        function dummyClientCallback( tweet ) {
            done();
        }

        // test getClassification
        nlu.classify( mockSnowTweet, dummyAddToDB, dummyClientCallback);
    });

    test( 'assert that HAIL tweets are classified correctly', done => {

        /**
         * printInfo mock
         */
        nlu.printInfo = jest.fn().mockImplementation(( tweet, weather, inclement ) => {
            expect( weather ).toBe( true );
            expect( inclement ).toBe( true );

            let label = tweet.NLULabel;
            let entity = tweet.NLUEntity;
            expect( entity ).toBe( 'HAIL' );

            let text = tweet.text;

            if ( !weather || !inclement ) {
                logFail( label, entity, text );
                done();
            } else {
                logPass( label, entity, text );
            }
        });

        function dummyClientCallback( tweet ) {
            done();
        }

        // test getClassification
        nlu.classify( mockHailTweet, dummyAddToDB, dummyClientCallback);
    });

    test( 'assert that WIND tweets are classified correctly', done => {

        /**
         * printInfo mock
         */
        nlu.printInfo = jest.fn().mockImplementation(( tweet, weather, inclement ) => {
            expect( weather ).toBe( true );
            expect( inclement ).toBe( true );

            let label = tweet.NLULabel;
            let entity = tweet.NLUEntity;
            expect( entity ).toBe( 'WIND' );

            let text = tweet.text;

            if ( !weather || !inclement ) {
                logFail( label, entity, text );
                done();
            } else {
                logPass( label, entity, text );
            }
        });

        function dummyClientCallback( tweet ) {
            done();
        }

        // test getClassification
        nlu.classify( mockWindTweet, dummyAddToDB, dummyClientCallback);
    });

    test( 'assert that ICE tweets are classified correctly', done => {

        /**
         * printInfo mock
         */
        nlu.printInfo = jest.fn().mockImplementation(( tweet, weather, inclement ) => {
            expect( weather ).toBe( true );
            expect( inclement ).toBe( true );

            let label = tweet.NLULabel;
            let entity = tweet.NLUEntity;
            expect( entity ).toBe( 'ICE' );

            let text = tweet.text;

            if ( !weather || !inclement ) {
                logFail( label, entity, text );
                done();
            } else {
                logPass( label, entity, text );
            }
        });

        function dummyClientCallback( tweet ) {
            done();
        }

        // test getClassification
        nlu.classify( mockIceTweet, dummyAddToDB, dummyClientCallback);
    });

    test( 'assert that STATION tweets are classified correctly', done => {
        /**
         * printInfo mock
         */
        nlu.printInfo = jest.fn().mockImplementation(( tweet, weather, inclement ) => {
            expect( weather ).toBe( true );
            expect( inclement ).toBe( false );

            let entity = tweet.NLUEntity;
            expect( entity ).toBe( 'STATION' );

            done();
        });

        function dummyClientCallback( tweet ) {
            done();
        }

        // test getClassification
        nlu.classify( mockStationTweet, dummyAddToDB, dummyClientCallback);
    });
});

describe( 'Asserts that non-weather (or weather station tweets are classified correctly', () => {



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
});