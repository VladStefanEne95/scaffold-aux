#!/usr/bin/env node

'use strict';

var fs = require('fs');
var pluralize = require('pluralize');
var modelGenerator = require('../lib/server-generator/model-generator');
var serverAppGenerator = require('../lib/server-generator/app-generator');
var serverRouteGenerator = require('../lib/server-generator/route-generator');
var packageAppGenerator = require('../lib/server-generator/package-generator');
var serverBinGenerator = require('../lib/server-generator/bin-generator');
var angModelGenerator = require('../lib/client-generator/angularModelGenerator');
var angDetailGenerator = require('../lib/client-generator/detail-generator');
var angServiceGenerator = require('../lib/client-generator/service-generator');
var angRouteGenerator = require('../lib/client-generator/route-generator');
var angAppGenerator = require('../lib/client-generator/app-generator');
var angComponentGenerator = require('../lib/client-generator/component-generator');
var controllerGenerator = require('../lib/server-generator/controller-generator');
var viewsGenerator = require('../lib/server-generator/view-generator');
var capitalize = require('../lib/client-generator/utils').capitalize;


var allowedTypes_server = ['string', 'number', 'date', 'boolean', 'array'];
var allowedTypes_client = ['string', 'number', 'date', 'boolean', 'array', 'any'];
var colors = require('colors');


  /* check if models folder exists */
    if (!fs.existsSync('models')) {
        console.log("ERROR! You need to have a folder named models in the root directory of the project".red);
        return;
    }

  /* check if the folder is empty */
    fs.readdir("models", function(err, files) {
        ; 
    });

  /* create and write the index.js file, used to search the current directory
      for javascript files */
    var index_file =`require('fs').readdirSync(__dirname + '/').forEach(function(file) {
        if (file.match(/\.js(on)?$/) !== null && file !== 'index.js') {
            var name = file.replace('.js', '');
            try {
            exports[name] = require('./' + file);
            }
            catch(err) {
                console.log("invalid input in the file".red + file.red);
                console.log("example of valid input: var obj = { Hero : { name: 'String', id: 'String'}}; module.exports = obj;".green);

            }
        }
    });`
    fs.writeFileSync('models/index.js', index_file);

    /* execute npm init --yes */  
    var exec = require('child_process').exec;
    var current_dirrectory;
    exec('npm init --yes');
    exec('pwd', 
    function (error, stdout, stderr) {
        current_dirrectory = stdout;
        var position1 = 0;
        var position2;
        /* get the models folder from current project */
        for(var i = 0; i < current_dirrectory.length && position1 < 2; i++){
            if(current_dirrectory.charAt(i) == '/'){
                position1++;
                position2 = i;
            }
        }
        current_dirrectory = current_dirrectory.substring(position2, current_dirrectory.length - 1).concat('/models');
        
        var inputul = require(current_dirrectory);
        var client_input = require(current_dirrectory);

        /* client - frontend
        server - backend */
        if (!fs.existsSync('client'))
            fs.mkdirSync('client');
        if (!fs.existsSync('server'))
            fs.mkdirSync('server');

        process.chdir('client');
        if (!fs.existsSync('src'))
            fs.mkdirSync('src');
        process.chdir('src');
        if (!fs.existsSync('app'))
            fs.mkdirSync('app');
        
        process.chdir('app');
        /* generate client side files */
        for (var aux in client_input) {

            var ang_scaffold = client_input[aux];
            angModelGenerator.angGenerateModel(ang_scaffold);
            angDetailGenerator.angGenerateDetail(ang_scaffold);
            angServiceGenerator.angGenerateService(ang_scaffold);
            angComponentGenerator.angGenerateComponent(ang_scaffold);
        }

        angRouteGenerator.angGenerateRoute(ang_scaffold);
        angAppGenerator.angGenerateApp(ang_scaffold);

        /* go back to root directory*/
        process.chdir('..');
        process.chdir('..');
        process.chdir('..');

        
        /* remove created index.js file */
        fs.unlink('models/index.js');

        /* change cwd to server and generate the folders */
        process.chdir('server');
        if (!fs.existsSync('models'))
            fs.mkdirSync('models');
        if (!fs.existsSync('controllers'))
            fs.mkdirSync('controllers');
        if (!fs.existsSync('views'))
            fs.mkdirSync('views');
         if (!fs.existsSync('routes'))
            fs.mkdirSync('routes');
        if (!fs.existsSync('bin'))
            fs.mkdirSync('bin');

        if (!fs.existsSync('public'))
            fs.mkdirSync('public');
        if (!fs.existsSync('public/stylesheets'))
            fs.mkdirSync('public/stylesheets');

        fs.closeSync(fs.openSync('public/stylesheets/style.css', 'a'));
        
        serverRouteGenerator.serverGenerateRoute();
        serverAppGenerator.serverGenerateApp();
        packageAppGenerator.serverGeneratePackage();
        viewsGenerator.serverGenerateViews();
        serverBinGenerator.serverGenerateBin();

        for (var aux in inputul) {
            /*  aux is the file name */
            var input, modelName, pluralName;
            var obj_prop;
            var types = [];
            /* input holds the object name */
            input = inputul[aux];

            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    /*  key -> object name
                        obj_prop -> object properties */
                    modelName = key;
                    pluralName = pluralize.plural(modelName);
                    obj_prop = input[key];
                }
            }


            for (var key in obj_prop) {
                 /*  key -> properties name
                        obj_prop[key] -> property type */
                if (allowedTypes_server.indexOf(obj_prop[key].toLowerCase()) === -1) {
                    showUsage("Property type" + obj_prop[key] + "not allowed");
                    process.exit(1);
                }
                if (obj_prop.hasOwnProperty(key)) {
                    types.push({
                    name: key,
                    type: obj_prop[key]
                    });
                }
            }


            modelGenerator.generateModel(modelName, pluralName, types, function(err) {
                if (err) {
                    showUsage('There was a problem generating the model file.');
                }
                console.log('Model file generated.');
                });

            controllerGenerator.generateController(modelName, pluralName, types, function(err) {
                if (err) {
                    showUsage('There was a problem generating the controller file.');
                }
                console.log('Generated controller');
                });
        }
    });
   
function showUsage(err) {

  if (err)
    console.log('Error: ', err + '\r\n');

  console.log('Example:\r\n    ' + process.argv[1].substr(process.argv[1].lastIndexOf('/') + 1) +
    ' user firstName lastName age:Number\r\n');
  console.log('Supported data types (case insensitive): String, Boolean, Number, Date, Array.');
  console.log('The script will overwrite any existing file content for target files.\r\n');

  if (err)
    process.exit(1);
  else
    process.exit(0);

}


