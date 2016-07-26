var flash = require('connect-flash');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var hbs=require('hbs');

function processExpressSetup(app){
    
    // view engine setup, using handlebars because its light and powerful
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hbs');
    app.use(favicon(path.join(__dirname, 'public/fav', 'favicon.ico')));
    hbs.registerPartials(__dirname + '/views/partials');
    
    app.use(logger('dev'));
    app.use(compress());
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(session({
    secret:'ULTRA16LATPROJ',
    resave:true,
    saveUninitialized:false
    }));
    app.use(flash());
    app.use(express.static(path.join(__dirname, 'public')));
    
    
}


module.exports = processExpressSetup;