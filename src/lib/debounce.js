module.exports = debounce;
function debounce(func, threshold, execAsap){
  var wasDebounced = false;
  var timeout;
  execAsap = execAsap || false;

  return function debounced(){
    var obj = this, args = arguments;

    function delayed () {
      if (!execAsap || wasDebounced) func.apply(obj, args);
      timeout = null;
      wasDebounced = false;
    };

    if (timeout) {
      wasDebounced = true;
      clearTimeout(timeout);
    } else if (execAsap) {
      func.apply(obj, args);
    }

    timeout = setTimeout(delayed, threshold || 100);
  };
}