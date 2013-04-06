var regexplained = require('regexplained');
var $ = require('./lib/by-id');

var error = $('error');
var paperContainer = $('paper-container');

function render(value) {
  paperContainer.innerHTML = '';
  error.innerHTML = '';
  document.body.className = 'is-loading has-results';

  regexplained(paperContainer, value, function(e) {
    if (e) {
      if (keyboard) errTimeout = setTimeout(display, 1000);
      else display();
      function display() {
        error.innerHTML = e.stack.replace(/\n/g,"<br>");
        document.body.className = 'error';
      }
    } else {
      document.body.className = 'has-results';
    }
  });
}