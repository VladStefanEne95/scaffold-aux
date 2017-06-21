'use strict';

var fs = require('fs');
var pluralize = require('pluralize');

function angGenerateService(ang_scaffold) {

  var angProp;
  var angName;
  for (var key in ang_scaffold) {
        angName = key;
        angProp = ang_scaffold[key];
  }


var imports = `import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { ${angName} } from './${angName.toLowerCase()}';

@Injectable()
`;
 var geter = `get${pluralize(angName)}(): Promise<${angName}[]> {
   return this.http.get(this.${pluralize(angName.toLowerCase())}Url)
               .toPromise()
               .then(response => response.json().data as ${angName}[])
               .catch(this.handleError);
  }

  get${angName}(_id: string): Promise<${angName}> {
    const url =` + " `${this." + `${pluralize(angName.toLowerCase())}Url}/` + "${_id}`;" + `
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as ${angName})
      .catch(this.handleError);
  }`;

  var del = `delete(_id: string): Promise<void> {
    const url =` + " `${this." + `${pluralize(angName.toLowerCase())}Url}/` + "${_id}`;" + `
    return this.http.delete(url, {headers: this.headers})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }`;

   var create =  `create(${angName.toLowerCase()}: ${angName}): Promise<${angName}> {
    return this.http
      .post(this.${pluralize(angName.toLowerCase())}Url, JSON.stringify({name: name}), {headers: this.headers})
      .toPromise()
      .then(res =>
      res.json().data as ${angName})
      .catch(this.handleError);
  }`

  var update = `update(${angName.toLowerCase()}: ${angName}): Promise<${angName}> {
    const url =` + " `${this." + `${pluralize(angName.toLowerCase())}Url}/` + "${" + `${angName.toLowerCase()}` + "._id}`;" + `
    return this.http
      .put(url, JSON.stringify(hero), {headers: this.headers})
      .toPromise()
      .then(() => ${angName.toLowerCase()})
      .catch(this.handleError);
  }`;

  var handleError = `private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }`


  var classDeclaration = `${imports} export class ${angName}Service {

  private headers = new Headers({'Content-Type': 'application/json'});
  private ${pluralize(angName.toLowerCase())}Url = 'api/${pluralize(angName.toLowerCase())}';

  constructor(private http: Http) { }

  ${geter}

  ${del}

  ${create}

  ${update}

  ${handleError}
}`;

  if (!fs.existsSync(`services`))
    fs.mkdirSync(`services`);
  if (!fs.existsSync(`services/${angName.toLowerCase()}`))
    fs.mkdirSync(`services/${angName.toLowerCase()}`);

  

  var fileName = `services/${angName.toLowerCase()}/${angName.toLowerCase()}.service.ts`; 
  fs.writeFile(fileName, classDeclaration, function(err) {
    if(err) {
        return console.log(err);
    }
});
}

module.exports = {
  angGenerateService: angGenerateService
};
