/**
 * Created by sam.benali on 01/03/2016.
 * This is the main Front end serverside file, it sets up all the express middleware
 * including all our routes as well as handling integration with passport
 */
var config = require('./server.config');
var fs = require('fs');
var passportSetup = require('./passport-setup');
var expressSetup = require('./express-setup');
var appSetup = require('./app-setup');
var appError = require('./app-error');
var http = require('http');
var https = require('https');
var express = require('express');


//actual express application object
var app = express();

//all express specific setup
expressSetup(app);

//all of the passport setup/hooks
passportSetup(app);

//setup either a http or https server, for prod it should be https, esp. if 
//using AD authentication since we dont want the client sending AD creds over http
var server = null;
if(config.SSL.enable===true){
    var options = {
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.pem'),
    };
    app.set('port', config.SSL.port);
    server=https.createServer(options,app);
    
}else{
    var port = config.appPort;
    app.set('port', port);
    server=server = http.createServer(app);
}

//setup socket io and all our routes
appSetup(app,server);


//handle 404/500
appError(app);

// /bin/www does not setup the server but rather its passed to it
//because we need to setup server in app so we can hook
//sockets io and more easily pass it to routes
module.exports = {app:app, server:server};