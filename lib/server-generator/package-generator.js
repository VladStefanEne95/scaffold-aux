'use strict';

var fs = require('fs');
var pluralize = require('pluralize');

function serverGeneratePackage() {

  var topLevel = `{
  "name": "-",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.17.1",
    "cookie-parser": "~1.4.3",
    "debug": "~2.6.3",
    "express": "~4.15.2",
    "jade": "~1.11.0",
    "morgan": "~1.8.1",
    "serve-favicon": "~2.4.2"
  }
}
`;

  var fileName = `package.json`;
  fs.writeFile(fileName, topLevel, function(err) {
    if(err) {
        return console.log(err);
    }
});

}

module.exports = {
  serverGeneratePackage: serverGeneratePackage
};


