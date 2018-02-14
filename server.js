//Express Basic module calling
var express = require('express')
    ,http = require('http')
    ,path = require('path')
//------------------------------------------
//express middle-ware calling
var bodyParser = require('body-parser')
    ,cookieParser = require('cookie-parser')
    ,static = require('serve-static')
    ,errorHandler = require('errorhandler')
//------------------------------------------
// Error handler
var expressErrorHandler = require('express-error-handler');

//session middleware handler
var expressionSession = require('express-session')

//express object Create
var app = express();

//method use() enables to call or enable to use body-parser,cookie-parser,express-session
//basic porpoerty set up
app.set('port',process.env.PORT ||3000);

//body-parser will be using applcation/x-ww-form-urlencoded parsing
app.use(bodyParser.urlencoded({extended:false}));

//body-parser will be used to parse applcation/json
app.use(bodyParser.json());

//public folder static, open
app.use('/public', static(path.join(__dirname,'public')));

//cookie -parser
app.use(cookieParser());

// session change
app.use(expressionSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));
//---------------------------------------------------------
var MongoClient = require ('mongoose');

//database object intialize
var database;

//connect to db

function connectDB()
{   console.log("connecting mongo database...");
//database connect info
//to change to database change to mongodb://(ip adress of db):(port # db)/db name
//var databaseUrl = 'mongodb://localhost:27017/local';
var databaseUrl = 'mongodb://jlee:456852@ds121456.mlab.com:21456/twm';
MongoClient.connection.on('open',function(ref){console.log('Connected to Mongo')});
MongoClient.connection.on('error',function(ref){console.log('Not Connected to Mongo')});
MongoClient.connect(databaseUrl,{useMongoClient:true},function(err,db){
MongoClient
    database = db;

});
}



var io = require('socket.io')(http);

/*

// logs message on connection
io.on('connection', function(socket){
    console.log('a user connected');

    // display message when 'chat message' event ids received from client
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});
*/
// listens to port 3000
//---------------------------------------------------------
/*
//404 error message handler
app.post('/request',function(req,res){
    console.log("request accepted");
    database.collection('twmsg').find({}, {_id: false}).toArray
    (function(err,dt){res.json(dt)});
}
);
app.get('/send',function(req,res){
    
    req.on('data',function(data)
    {   console.log("Data received");
        console.log(data);
        //value = JSON.parse(data);
    });
    console.log(value);
});
*/
//redriect to error page

//gets the request for tweets 
var myRequest = [];
app.post('/requestData',function(req,res){

    var key = Object.keys(req.body);
    
    var len = key.length;
    
    for(i = 0; i < len; i++)
    {
        myRequest.push(req.body[key[i]]);
    }
    console.log(myRequest);
    
   res.send("Request Received");

    
    
}
);

app.get('/callback',function(req,res)
{   //twmsg
    
   database.collection(myRequest[0]).find({}, {_id: false}).toArray
   (function(err,dt){res.json(dt)});
   myRequest = [];
}
);

var errorHandler = expressErrorHandler({
static:{
    '404':'./public/404.html'
}
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);
//exception handle end here
//---------------------------------------------------------
//server startup


var MyServer = http.createServer(app).listen(app.get('port'),function(){
console.log('Server Started at Port: ' + app.get('port'));
//connect to mongodt db
connectDB();
});

//open server 
//---------------------------------------------------------