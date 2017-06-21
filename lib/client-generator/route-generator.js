'use strict';

var fs = require('fs');
var utils = require('./utils');
var pluralize = require('pluralize');

function angGenerateRoute(ang_scaffold) {
  var angProp;
  var angName;
  for (var key in ang_scaffold) {
        angName = key;
        angProp = ang_scaffold[key];
  }

  var topLevel = `import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ${pluralize(angName)}Component }      from './${pluralize(angName).toLowerCase()}.component';
import { ${angName}DetailComponent }  from './${(angName).toLowerCase()}-detail.component';
`;

  var routes = `const routes: Routes = [
  { path: 'detail/:id', component: ${angName}DetailComponent },
  { path: '${pluralize(angName).toLowerCase()}',     component: ${pluralize(angName)}Component }
];
`;
  var exports = `@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
`;

  var result = topLevel + routes + exports;

  if (!fs.existsSync(`modules`))
    fs.mkdirSync(`modules`);
  if (!fs.existsSync(`modules/app-routing`))
    fs.mkdirSync(`modules/app-routing`);

  var fileName = `modules/app-routing/app-routing.module.ts`
  fs.writeFile(fileName, result , function(err) {
    if(err) {
        return console.log(err);
    }
});
}

module.exports = {
  angGenerateRoute: angGenerateRoute
};
