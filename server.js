var join = require('path').join;
var Stop = require('stop');

var css = require('css');

var browserify = require('browserify-middleware');
var rfile = require('rfile');

var isStatic = process.argv[2] === '--compile' || process.argv[2] === '-c';
var app = new Stop(isStatic);


app.file('/', 'src/index.html');
app.file('/loader.gif', 'src/loader.gif');
app.get('/main.js', browserify('./src/main.js'));
app.favicon('./src/favicon.ico');

function compressCSS(src) {
  return css.stringify(css.parse(src), {compress: true});
}

app.get('/build/build.css', function (req, res, next) {
  var style = rfile('./src/style/normalize.css') + '\n' +
              rfile('./src/style/main.css');
  res.type('.css');
  res.send(process.env.NODE_ENV === 'production' ? compressCSS(style) : style);
});

app.run('./output', 3000);
