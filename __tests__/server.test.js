const nlu = require ('../scripts/NLU');
const mockServer = require('mock-socket').Server;
const socketIO = require('mock-socket').SocketIO;
const mockWebSocket = require('mock-socket').WebSocket;


describe('Client Unit Test', () => {
    it('basic test', (done) => {
        const mockServer = new Server('http://localhost:8080');
        mockServer.on('connection', server => {
            mockServer.emit('chat-message', 'test message 1');
            mockServer.emit('chat-message', 'test message 2');
        });

        /*
          This step is very important! It tells our chat app to use the mocked
          websocket object instead of the native one. The great thing
          about this is that our actual code did not need to change and
          thus is agnostic to how we test it.
        */
        window.io = SocketIO;

        // Now when Chat tries to do io() or io.connect()
        // it will use MockSocketIO object
        var chatApp = new Chat();

        setTimeout(() => {
            const messageLen = chatApp.messages.length;
            assert.equal(messageLen, 2, '2 messages where sent from the server');
            mockServer.stop(done);
        }, 100);
    });
});









//test( 'assert that weather tweets are classified correctly', done => {
//
//    // mock tweet
//    let mockTweet = {
//        created_at: "Mon Jan 1 00:00:00 +0000 2018",
//        id: 999999999999999999,
//        id_str: "999999999999999999",
//        text: 'Ice storm...I had the day off, but most places are closed today.',
//        geoPoint: {
//            lat: 26.71903,
//            lng: -80.05049
//        },
//        geo: { type: 'Point', coordinates: [ 26.71903, -80.05049 ] },
//        coordinates: { type: 'Point', coordinates: [ -80.05049, 26.71903 ] },
//        place:
//            { id: '4de072969805ac41',
//                url: 'https://api.twitter.com/1.1/geo/id/4de072969805ac41.json',
//                place_type: 'city',
//                name: 'West Palm Beach',
//                full_name: 'West Palm Beach, FL',
//                country_code: 'US',
//                country: 'United States',
//                bounding_box: { type: 'Polygon', coordinates: [Array] },
//                attributes: {} },
//    };
//
//    // mock callbacks
//    function dontAddToDB( tweet ) {}
//    function mockClientCallback( tweet ) {
//
//        /*
//        console.log('\\********************************************************\\\n' +
//            '\\************************************************\\\n\n' +
//            //console.log('\n' + JSON.stringify(response, null, 2) + '\n') +
//            tweet.NLULabel + '\n' +
//            tweet.NLUEntity + '\n' +
//            tweet.text + '\n\n' +
//            '\\************************************************\\\n' +
//            '\\********************************************************\\');
//        */
//
//        expect( tweet ).toBe( mockTweet );
//
//        let isWeatherLabel = nlu.isWeather( tweet.NLULabel );
//        expect( isWeatherLabel ).toBe( true );
//
//        done();
//    }
//
//    // test getClassification
//    nlu.classify( mockTweet, dontAddToDB, mockClientCallback);
//});
