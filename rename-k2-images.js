var fs = require('fs');
var siteDirectory = '../../hugo-sites-manager/app/sites/mfw';
var sourceImagesRelativePath = '/k2'; //relative to /image directory
var destinationRelativePath = '/test'; //relative to /image directory
var contentDirectory = `${siteDirectory}/content`;
var sourceImagesAbsolutePath = `${siteDirectory}/static/images/${sourceImagesRelativePath}`;
var destinationAbsolutePath = `${siteDirectory}/static/images/${destinationRelativePath}`;
var imageNameRegex = new RegExp('[A-z0-9]{32}_(XS|S|M|L|XL).jpg');
var chalk = require('chalk');
var path = require('path');
var mkdirp = require('mkdirp');
var log = [];
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

function mkdirP(dirPath) {
  mkdirp.sync(dirPath, err => {
    if (err) {
      console.error(err);
    }
  });
}

function copyImage(contentFilePath) {
  var content = fs.readFileSync(contentFilePath, 'utf-8');
  if (content.match(imageNameRegex)) {
    var k2ImageName = content.match(imageNameRegex)[0];
    var currentImageFilePath = `${sourceImagesAbsolutePath}/${k2ImageName}`;
    var newFileRelPath = `${contentFilePath.replace(contentDirectory, '')}`.replace('//', '/').split('.').slice(0, -1).join('.') + '.jpg'
    var newImageFilePath = `${destinationAbsolutePath}/${newFileRelPath}`;
    mkdirP(path.dirname(newImageFilePath));
    fs.copyFileSync(currentImageFilePath, newImageFilePath, (err) => {
      if (err) throw err;
      console.log(`${currentImageFilePath} was copied to ${newImageFilePath}`);
    });
    var updatedContent = content.replace(`/media/k2/items/cache/${k2ImageName}`, `/images${destinationRelativePath}${newFileRelPath}`);
    console.log(chalk.green(`Created ${newImageFilePath}`));
    fs.writeFile(contentFilePath, updatedContent, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log(chalk.yellow(`Updated ${contentFilePath}`));
      log.push({
        old: `/media/k2/items/cache/${k2ImageName}`,
        new: `/images${destinationRelativePath}${newFileRelPath}`
      });
    });
  } 
}
var contentFilePaths = getFiles(contentDirectory);

contentFilePaths.forEach(file => {
  copyImage(file);
});
fs.writeFile(destinationAbsolutePath, JSON.stringify(log, null, 2), 'utf8', function (err) {
  if (err) return console.log(err);
  console.log(chalk.yellow(`Created log file.`));
});
