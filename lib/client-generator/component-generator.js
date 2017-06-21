'use strict';

var fs = require('fs');
var pluralize = require('pluralize');

function angGenerateComponent(ang_scaffold) {

  var angProp;
  var angName;
  for (var key in ang_scaffold) {
        angName = key;
        angProp = ang_scaffold[key];
  }

  var topLevel = `import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { ${angName} }                from './${angName.toLowerCase()}';
import { ${angName}Service }         from './${angName.toLowerCase()}.service';

@Component({
  selector: 'my-${pluralize(angName).toLowerCase()}',
  templateUrl: './${pluralize(angName).toLowerCase()}.component.html',
  styleUrls: [ './${pluralize(angName).toLowerCase()}.component.css' ]
})
`;

var exportClass =  `export class ${pluralize(angName)}Component implements OnInit {
  ${pluralize(angName).toLowerCase()}: ${angName}[];
  selected${angName}: ${angName};

  constructor(
    private ${angName.toLowerCase()}Service: ${angName}Service,
    private router: Router) { }

  get${pluralize(angName)}(): void {
    this.${angName.toLowerCase()}Service
        .get${pluralize(angName)}()
        .then(${pluralize(angName).toLowerCase()} => this.${pluralize(angName).toLowerCase()} = ${pluralize(angName).toLowerCase()});
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.${angName.toLowerCase()}Service.create(name)
      .then(${angName.toLowerCase()} => {
        this.${pluralize(angName).toLowerCase()}.push(${angName.toLowerCase()});
        this.selected${angName} = null;
      });
  }

  delete(${angName.toLowerCase()}: ${angName}): void {
    this.${angName.toLowerCase()}Service
        .delete(${angName.toLowerCase()}._id)
        .then(() => {
          this.${pluralize(angName).toLowerCase()} = this.${pluralize(angName).toLowerCase()}.filter(h => h !== ${angName.toLowerCase()});
          if (this.selected${angName} === ${angName.toLowerCase()}) { this.selected${angName} = null; }
        });
  }

  ngOnInit(): void {
    this.get${pluralize(angName)}();
  }

  onSelect(${angName.toLowerCase()}: ${angName}): void {
    this.selected${angName} = ${angName.toLowerCase()};
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selected${angName}._id]);
  }
}`;

  if (!fs.existsSync('components'))
    fs.mkdirSync('components');
  if (!fs.existsSync(`components/${angName.toLowerCase()}`))
    fs.mkdirSync(`components/${angName.toLowerCase()}`);

  var fileName = `components/${angName.toLowerCase()}/${pluralize(angName.toLowerCase())}.component.ts`;
  fs.writeFile(fileName, topLevel + exportClass, function(err) {
    if(err) {
        return console.log(err);
    }
});

fileName = `components/${angName.toLowerCase()}/${pluralize(angName.toLowerCase())}.component.html`;
  fs.writeFile(fileName, "", function(err) {
    if(err) {
        return console.log(err);
    }
});

  fileName = `components/${angName.toLowerCase()}/${pluralize(angName.toLowerCase())}.component.css`;
  fs.writeFile(fileName, "", function(err) {
    if(err) {
        return console.log(err);
    }
});

}

module.exports = {
  angGenerateComponent: angGenerateComponent
};