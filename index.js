var fs = require('fs');

var pathToFilesToConvert = '../../../../Dropbox/class-castle/site-templates/russel-wasserfal/less/';

var pathToFilesToCheckAgainst = '../../hugo-sites-manager/app/sites/russel-wasserfall/themes/russel-wasserfall/assets/scss/_shared/variables/';


function getFiles(dir, files_) {
  files_ = files_ || [];
  var files;
  try {
    files = fs.readdirSync(dir);
    for (var i in files) {
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
    return files_;
  } catch (err) {
    console.log(err);
  } 
}

var filesToConvert = getFiles(pathToFilesToConvert);
var filesToCheckAgainst = getFiles(pathToFilesToCheckAgainst);

function returnLines(fileNames) {
  acc = [];
  fileNames.forEach(file => {
    var allLines = fs.readFileSync(`${file}`.replace('//', '/'), 'utf-8').split(/\r?\n/);
    var lines = [];
    allLines.forEach(line => {
      
      lineParts = line.trim().replace(/  /g, ' ').split(':');
      if (lineParts[0] && lineParts[1]) {
        lines.push({
          varName: lineParts[0],
          value: lineParts[1]
        });
      }
    });
    acc = acc.concat(lines);
  });
  return acc;
}

function lessTransorms(varName) {
  return varName
    .replace('@', '$')
    .replace('page-header', 'main-header')
    .replace('!default', '')
    .replace('k2-blog-cat-list-item', 'blog-item')
    .replace('pc', 'desktop')
    .replace('979', 'mobile')
    .replace('general-button', 'button');
}

var variablesToConvert = returnLines(filesToConvert);
var variablesToCheckAgainst = returnLines(filesToCheckAgainst);

var newSCSS = [];
variablesToCheckAgainst.forEach(scss => {
  var corresponding = variablesToConvert.find(less => {
    return lessTransorms(less.varName) === scss.varName && less.value !== lessTransorms(scss.value);
  });
  if (corresponding) {
    newSCSS.push(`${lessTransorms(corresponding.varName)}: ${lessTransorms(corresponding.value)}`);
  }
});

var final = newSCSS.join('\n');

fs.writeFile('output.scss', final, function(err) {
  if(err) {
    return console.log(err);
  }
  console.log(`Succes! output.scss was saved!`);
});
