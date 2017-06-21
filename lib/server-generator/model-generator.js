'use strict';

var fs = require('fs');
var utils = require('./utils');

// writes down schema content.
function createFileContent(fd, name, pluralName, types, cb) {

  var header = `'use strict';\r\n\r\n
var mongoose = require('mongoose'),\r\n
Schema = mongoose.Schema;\r\n\r\n`;

  var schemaName = pluralName + 'Schema';
  var schema = `var ${schemaName} = new Schema({\r\n`;

  for (var i = 0; i < types.length; i++) {
    var current = types[i];
    var line = `  ${current.name} : `;

    if (current.type === 'Array') {
      line = `${line}[]`;
    } else {
      line = `${line}${current.type}`;
    }
    if (i < types.length - 1) {
      line = line + ',';
    }
    line = line + '\r\n';
    schema = schema + line;
  }
  schema = schema + '});\r\n\r\n';

  var exportLine = 'module.exports = mongoose.model(\'' + pluralName + '\', ' + schemaName + ');';
  var buf = new Buffer(header  + schema + exportLine);
  fs.write(fd, buf, 0, buf.length, null, cb);
}

function generateModel(name, pluralName, types, cb) {
  utils.generateDirectory('models', function(err) {
    if (err) {
      return cb(err);
    }
    var fileName = 'models/model-' + pluralName + '.js';
    console.log(fileName);
    utils.createOrClearFile(fileName, function(err, fd) {
      if (err) {
        return cb(err);
      }
      createFileContent(fd, name, pluralName, types, function(err) {
        if (err) {
          return (cb(err));
        }
        fs.close(fd, cb);
      });
    });
  });
}

module.exports = {
  generateModel: generateModel
};
