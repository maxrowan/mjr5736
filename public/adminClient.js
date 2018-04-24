let socket = io();

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