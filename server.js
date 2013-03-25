var join = require('path').join;
var Stop = require('stop');

var js = require('uglify-js');
var css = require('css');

var Builder = require('component-builder');

var isStatic = process.argv[2] === '--compile' || process.argv[2] === '-c';
var app = new Stop(isStatic);

app.file('/', 'src/index.html');
app.file('/loader.gif', 'src/loader.gif');
app.file('/main.js', 'src/main.js');
app.favicon('src/favicon.ico');

function build(cb) {
  var builder = new Builder(join(__dirname, 'src'));
  builder.paths = [join(__dirname, 'src', 'components')];
  builder.build(function (err, obj) {
    if (err) return cb(err);
    cb(null, {
      css: obj.css,
      js: obj.require + obj.js
    });
  });
}

function compressJS(src) {
  return js.minify(src, {fromString: true}).code;
}
function compressCSS(src) {
  return css.stringify(css.parse(src), {compress: true});
}

app.get('/build/build.js', function (req, res, next) {
  build(function (err, obj) {
    if (err) return next(err);
    res.type('.js');
    res.send(process.env.NODE_ENV === 'production' ? compressJS(obj.js) : obj.js);
  });
});
app.get('/build/build.css', function (req, res, next) {
  build(function (err, obj) {
    if (err) return next(err);
    res.type('.css');
    res.send(process.env.NODE_ENV === 'production' ? compressCSS(obj.css) : obj.css);
  });
});

app.run('./output', 3000);
