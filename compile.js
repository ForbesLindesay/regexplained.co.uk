var path = require('path');
var transform = require('transform');
var express = require('express');

var serve = process.argv[2] === '--serve';

var transformation = transform(path.join(__dirname, 'src'))
  .using(function (transform) {
    transform.add('component.json', 'build/build.js', ['component-js', {development: serve}]);
    transform.add('component.json', 'build/build.css', ['component-css', {development: serve}]);
    transform.add('index.html', 'index.html', 'copy');
    transform.add('loader.gif', 'loader.gif', 'copy');
    transform.add('favicon.ico', 'favicon.ico', 'copy');
    transform.add('main.js', 'main.js', 'copy');
    if (!serve) {
      transform.add('.js', '.js', 'uglify-js');
      transform.add('.css', '.css', 'uglify-css');
    }
  })
  .grep(/^[^\/]+$/);

if (serve) {
  var app = express();
  app.use(express.logger('dev'));
  app.use(transformation.dynamically());
  app.listen(3000);
} else {
  transformation.statically(path.join(__dirname, 'output'));
}

function ident(a) {
  return a;
}