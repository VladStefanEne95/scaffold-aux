'use strict';

var fs = require('fs');
var pluralize = require('pluralize');

function angGenerateDetail(ang_scaffold) {

  var angProp;
  var angName;
  for (var key in ang_scaffold) {
        angName = key;
        angProp = ang_scaffold[key];
  }

  var topLevel = `import 'rxjs/add/operator/switchMap';
import { Component, OnInit }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { ${angName} }        from './${angName.toLowerCase()}';
import { ${angName}Service } from './${angName.toLowerCase()}.service';

@Component({
  selector: '${angName.toLowerCase()}-detail',
  templateUrl: './${angName.toLowerCase()}-detail.component.html',
  styleUrls: [ './${angName.toLowerCase()}-detail.component.css' ]
})
`;

  var exportClass = `export class ${angName}DetailComponent implements OnInit {
  ${angName.toLowerCase()}: ${angName};

  constructor(
    private ${angName.toLowerCase()}Service: ${angName}Service,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.${angName.toLowerCase()}Service.get${angName}(params['_id']))
      .subscribe(${angName.toLowerCase()} => this.${angName.toLowerCase()} = ${angName.toLowerCase()});
  }

  save(): void {
    this.${angName.toLowerCase()}Service.update(this.hero)
      .then(() => this.goBack());
  }

  goBack(): void {
    this.location.back();
  }
}`

  if (!fs.existsSync('components'))
    fs.mkdirSync('components');
  if (!fs.existsSync(`components/${angName.toLowerCase()}`))
    fs.mkdirSync(`components/${angName.toLowerCase()}`);

  var fileName = `components/${angName.toLowerCase()}/${angName.toLowerCase()}-detail.component.ts`;
  fs.writeFile(fileName, topLevel + exportClass, function(err) {
    if(err) {
        return console.log(err);
    }
});

}

module.exports = {
  angGenerateDetail: angGenerateDetail
};