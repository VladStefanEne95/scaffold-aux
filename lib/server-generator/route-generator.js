'use strict';

var fs = require('fs');
var utils = require('./utils');

function serverGenerateRoute() {

var text = `var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index');
});`;

    var fileName = `routes/app.js`;
    fs.writeFile(fileName, text, function(err) {
    if(err) {
        return console.log(err);
    }
});

}

module.exports = {
  serverGenerateRoute: serverGenerateRoute
};
