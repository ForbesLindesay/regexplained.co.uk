var join = require('path').join;

var express = require('express');
var ugcss = require('css');
var browserify = require('browserify-middleware');
var rfile = require('rfile');

browserify.settings('basedir', __dirname);
var app = express();

app.use(express.favicon(__dirname + '/src/favicon.ico'));

var staticPath = '/static/' + require('./package.json').version;
app.get('/', page('./src/index.html'));

app.get(staticPath + '/img/cc.png', file('./src/img/cc.png'));
app.get(staticPath + '/img/loader.gif', file('./src/img/loader.gif'));
app.get(staticPath + '/img/fork.png', file('./src/img/fork.png'));

app.get(staticPath + '/main.js', browserify('./src/main.js'));
app.get(staticPath + '/main.css', css(['./src/style/font.css', './src/style/normalize.css', './src/style/main.css']));
app.get(staticPath + '/bangers.woff', file('./src/style/bangers.woff'));


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
  };
}
function page(path) {
  return function (req, res, next) {
    res.send(rfile(path).replace(/\{\{STATIC\}\}/g, staticPath));
  };
}
function file(path) {
  return function (req, res, next) {
    res.sendfile(rfile.resolve(path));
  };
}

app.listen(3000);
