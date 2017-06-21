'use strict';

var fs = require('fs');
var utils = require('./utils');

function angGenerateModel(ang_scaffold) {
  var angProp;
  var angName;
  for (var key in ang_scaffold) {
        angName = key;
        angProp = ang_scaffold[key];
  }

  var angular_model = `export class ${angName} {
  _id: string;
  name: string;
`;

  for (var key in angProp) {
    if (key.toLowerCase() === "id" || key.toLowerCase() === "_id")
      continue;
    if (key.toLowerCase() === "name")
      continue;
    
    var line = `  ${key.toLowerCase()}: ${angProp[key].toLowerCase()};\r\n`;
    angular_model += line;

}
  angular_model +=`  createdAt: Date;
  updatedAt: Date;\r\n`
  angular_model += '}';

  if (!fs.existsSync('models'))
    fs.mkdirSync('models');
  if (!fs.existsSync(`models/${angName.toLowerCase()}`))
    fs.mkdirSync(`models/${angName.toLowerCase()}`);

  var fileName = `models/${angName.toLowerCase()}/${angName.toLowerCase()}.ts`
  fs.writeFile(fileName, angular_model, function(err) {
    if(err) {
        return console.log(err);
    }
});
}

module.exports = {
  angGenerateModel: angGenerateModel
};
