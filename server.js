var express = require('express');
var path = require('path');
var http = require('http');
var https = require('https');
var util = require('util');

// uncaught exception stuff
process.on('uncaughtException', function (exception) {
    console.log(util.format('Unexpected error: %s', JSON.stringify(exception)));
});

// app view engines settings
var setupViewEngines = function(app) {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
};

// middleware setup
var setupMiddleware = function(app) {
    app.use(express.static(path.join(__dirname, 'public')));
    // routes
    app.get('/', function(req, res) {
        res.render('weather', {});
    });
};

// let's go
var app = express();
setupViewEngines(app);
setupMiddleware(app);
app.listen(8080);
module.exports.app = app;
