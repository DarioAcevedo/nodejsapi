/* Primary file for the api
*/

//Requirements

const { stat } = require('fs');
var http = require('http');
var url = require('url');
var stringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

//The server must respond any request with a string

var server = http.createServer(function(req,res){
    
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

});

//Tell that the server is on 
server.listen(config.port, function(){
    console.log(`The server is listening on ${config.port} now!`);
});

//Define handlers for API Calls

var handlers = {};

//for each path, we will make a callback to take an HTTP status call and a payload object

handlers.sample = function(data, callback){
    callback(406, {'sample': 'sample handler'});
}

handlers.notFound = function(data, callback){
    callback(404);
}

// define a router

var router = {
    'sample' : handlers.sample
};

