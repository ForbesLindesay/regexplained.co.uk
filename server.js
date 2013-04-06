var rimraf = require('rimraf');
var Stop = require('stop');

var isStatic = process.argv[2] === '--compile' || process.argv[2] === '-c';
if (isStatic) rimraf.sync(__dirname + '/output');
var app = new Stop(isStatic);

var join = require('path').join;

var ugcss = require('css');
var browserify = require('browserify-middleware');
var rfile = require('rfile');



var staticPath = '/static/' + (Date.now());
app.get('/', page('./src/index.html'));

app.file(staticPath + '/img/cc.png', './src/img/cc.png');
app.file(staticPath + '/img/loader.gif', './src/img/loader.gif');
app.file(staticPath + '/img/fork.png', './src/img/fork.png');

app.get(staticPath + '/main.js', browserify('./src/main.js'));
app.get(staticPath + '/main.css', css(['./src/style/font.css', './src/style/normalize.css', './src/style/main.css']));
app.file(staticPath + '/bangers.woff', './src/style/bangers.woff');

app.favicon('./src/favicon.ico');

function compressCSS(src) {
  return ugcss.stringify(ugcss.parse(src), {compress: true});
}
function css(files) {
  return function (req, res, next) {
    var style = files.map(function (f) { return rfile(f); })
      .join('\n')
      .replace(/\{\{STATIC\}\}/g, staticPath);
    res.type('.css');
    res.send(process.env.NODE_ENV === 'production' ? compressCSS(style) : style);
  }
}
function page(path) {
  return function (req, res, next) {
    res.send(rfile(path).replace(/\{\{STATIC\}\}/g, staticPath));
  };
}

app.run('./output', 3000);
