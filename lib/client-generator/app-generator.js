'use strict';

var fs = require('fs');
var pluralize = require('pluralize');

function angGenerateApp(ang_scaffold) {

  var angProp;
  var angName;
  for (var key in ang_scaffold) {
        angName = key;
        angProp = ang_scaffold[key];
  }

  var topLevel = `import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { ${pluralize(angName)}Component }      from './${pluralize(angName.toLowerCase())}.component';
import { ${angName}DetailComponent }  from './${angName.toLowerCase()}-detail.component';
import { ${angName}Service }          from './${angName.toLowerCase()}.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    ${angName}DetailComponent,
    ${pluralize(angName)}Component
  ],
  providers: [ ${angName}Service ]
})
export class AppModule { }`;

  if (!fs.existsSync(`modules`))
    fs.mkdirSync(`modules`);
  if (!fs.existsSync(`modules/app`))
    fs.mkdirSync(`modules/app`);

  var fileName = `modules/app/app.module.ts`;
  fs.writeFile(fileName, topLevel, function(err) {
    if(err) {
        return console.log(err);
    }
});

}

module.exports = {
  angGenerateApp: angGenerateApp
};