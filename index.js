var fs = require('fs');

var pathToFilesToConvert = '../../../../Dropbox/class-castle/site-templates/mfww-responsive/less/zz-default-variables/';

var pathToFilesToCheckAgainst = '../../hugo-sites-manager/app/sites/mfw/themes/mfw/assets/scss/_shared/variables/';

var filesToConvert = ['variables-bits-and-pieces.less','variables-bootstrap-navbar-979.less','variables-bootstrap-navbar-pc.less','variables-general-site-layout.less'];

var filesToCheckAgainst = ['_variables-bits-and-pieces.scss', '_variables-blog-layout.scss', '_variables-general-site-layout.scss', '_variables-main-nav.scss'];

function returnLines(pathToFiles, fileNames) {
  acc = [];
  fileNames.forEach(file => {
    var lines = fs.readFileSync(`${pathToFiles}/${file}`.replace('//', '/'), 'utf-8').split(/\r?\n/);
    acc = acc.concat(lines);
  });
  return acc;
}

var variablesToConvert = returnLines(pathToFilesToConvert, filesToConvert);
var variablesToCheckAgainst = returnLines(pathToFilesToCheckAgainst, filesToCheckAgainst);

console.log(variablesToConvert.length);
console.log(variablesToCheckAgainst.length);