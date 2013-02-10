(function () {
  var regexper = require('regexper');
  var debounce = require('matthewmueller-debounce');
  var base64 = require('ForbesLindesay-base64');

  var input = document.getElementById('regexp_input'),
    error = document.getElementById('error'),
    paper_container = document.getElementById('paper-container'),
    generateBTN = document.getElementById('generate_btn');

  var permalinkBTN = document.getElementById('permalinkBTN');
  var permalink = document.getElementById('permalink');


  updateFragment = debounce(function () {
    location.hash = base64.encode(JSON.stringify({pattern: input.value}));
  }, 1000);
  function readFragment() {
    try {
      return JSON.parse(base64.decode(location.hash.replace(/^#/, '')));
    } catch (ex) {
      return null;
    }
  }
  function onFragmentUpdated() {
    var match = readFragment();
    if (match && match.pattern) {
      input.value = match.pattern;
      render();
    }
  }
  onFragmentUpdated();
  window.onhashchange = onFragmentUpdated;

  permalinkBTN.onclick = function () {
    location.hash = base64.encode(JSON.stringify({pattern: input.value}));
    permalink.src = 'http://tinyurl.com/api-create.php?url=' + encodeURIComponent(location.href);
  };

  var prev_input = null;

  generateBTN.onclick = function() {
    paper_container.innerHTML = '';
    error.innerHTML = '';

    document.body.className = 'is-loading has-results';
    regexper(paper_container, input.value , function(e) {
      if (e) error.innerHTML = e.stack.replace(/\n/g,"<br>");
      document.body.className = 'has-results';
    });
  };

  var errTimeout;
  function render(keyboard) {
    paper_container.innerHTML = '';
    error.innerHTML = '';
    document.body.className = 'is-loading has-results';
    clearTimeout(errTimeout);



    regexper(paper_container, input.value, function(e) {
      if (e) {
        if (keyboard) errTimeout = setTimeout(display, 1000);
        else display();
        function display() {
          error.innerHTML = e.stack.replace(/\n/g,"<br>");
          document.body.className = 'error';
        }
      } else {
        updateFragment();
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
    prev_input = input.value;
    permalink.src = '';
    permalinkBTN.setAttribute('style', '');

    if (input.value.length === 0) {
      paper_container.innerHTML = '';
      error.innerHTML = '';
      document.body.className = '';
      permalinkBTN.setAttribute('style', 'display: none');
      generateBTN.setAttribute('style', 'display: none');
    } else if (input.value.length < 40) {
      generateBTN.setAttribute('style', 'display: none');
      renderKeyboard();
    } else {
      generateBTN.setAttribute('style', '');
      paper_container.innerHTML = '';
      error.innerHTML = '';
      document.body.className = '';
      if (e.keyCode === 13) { //enter
        render();
      }
    }
  };
}());