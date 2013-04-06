var regexplained = require('regexplained');

var debounce = require('./lib/debounce');
var $ = require('./lib/by-id');
var state = require('./lib/state');

var input = $('regexp_input');
var error = $('error');
var paperContainer = $('paper-container');
var generateBTN = $('generate_btn');

if (state.get('pattern')) {
  input.value = state.get('pattern');
  render();
}

var prev_input = null;

generateBTN.onclick = function() {
  paperContainer.innerHTML = '';
  error.innerHTML = '';

  document.body.className = 'is-loading has-results';
  regexplained(paperContainer, input.value , function(e) {
    if (e) error.innerHTML = e.stack.replace(/\n/g,"<br>");
    document.body.className = 'has-results';
  });
};

var errTimeout;
function render(keyboard) {
  paperContainer.innerHTML = '';
  error.innerHTML = '';
  document.body.className = 'is-loading has-results';

  regexplained(paperContainer, input.value, function(e) {
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
var renderKeyboard = debounce(function () {
  render(true);
}, 200);
input.onkeyup = function(e) {
  if (input.value === prev_input && e.keyCode !== 13) {
    return; // key hasn't changed text
  }
  if (errTimeout) clearTimeout(errTimeout);
  prev_input = input.value;
  state.set('pattern', input.value);

  if (input.value.length === 0) {
    paperContainer.innerHTML = '';
    error.innerHTML = '';
    document.body.className = '';
    generateBTN.setAttribute('style', 'display: none');
    updateFragment();
  } else if (input.value.length < 40) {
    generateBTN.setAttribute('style', 'display: none');
    renderKeyboard();
  } else {
    generateBTN.setAttribute('style', '');
    paperContainer.innerHTML = '';
    error.innerHTML = '';
    document.body.className = '';
    if (e.keyCode === 13) { //enter
      render();
    }
  }
};