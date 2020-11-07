/* Primary file for the api
*/

//Requirements

const { stat } = require('fs');
var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = reqire('fs');
var https = require('https');

//The server must respond any request with a string

var httpServer = http.createServer(function(req,res){
    unifiedServer(req,res);
});

//Tell that the server is on 
httpServer.listen(config.httpPort, function(){
    console.log(`The server is listening on ${config.httpPort} now!`);
});

//Load the https docs
httpsOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

//Create an https port
httpsServer = https.createServer(httpsOptions,function(req,res){
    unifiedServer(req,res);
});

//listenHTTPS 
httpsServer.listen(config.httpsPort, function(){
    console.log(`The server is listening on port ${config.httpsPort} now!`);
});


//Unify the http and http ports

var unifiedServer = function(req,res){
    //get the url and parse it
    var parsedURL = url.parse(req.url, true);
    
    //get the path
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    //parse method
    var method = req.method.toLocaleLowerCase();

    //query params

    var queryparams = parsedURL.query;

    //headers

    var headers = req.headers;

    //get the payload
    //first, create a decoder with stringDecoder to utf-8
    var decoder = new stringDecoder('utf-8');

    var buffer  = '';

    //we want to capture everything the data is sending to our buffer
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    //Capture the end of the buffer
    req.on('end',function(){
        buffer += decoder.end();

        //send to a router
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?   router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to a handler

        var data = {
            'trimmedPath' : trimmedPath,
            'querystring' : queryparams,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        } 

        //Send to the chosenHandler

        chosenHandler(data, function(statusCode, payload){
            //StatusCode
            var statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            var payload = typeof(payload) == 'object' ? payload : {};
            var response = JSON.stringify(payload);
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(response);
            })
        
        //The response is on the end of the buffer because although we not allways get a payload data, we will allways get the end
        //send response
        //res.end("Hello World! \n");

        //log the request path
        console.log("The request is received in " + trimmedPath)

    });
};




//Define handlers for API Calls

var handlers = {};

//for each path, we will make a callback to take an HTTP status call and a payload object

handlers.ping = function(data, callback){
    callback(200);
};

handlers.notFound = function(data, callback){
    callback(404);

};

handlers.hello = function(data,callback){
    callback(200, {'handshake' : true, 'response' : 'Hi, how are you?'})
}




// define a router

var router = {
    'ping' : handlers.ping,
    'hello' : handlers.hello
};

