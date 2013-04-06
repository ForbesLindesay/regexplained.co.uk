//dependencies
var url = require('url');
var base64 = require('./b64');
var $ = require('./by-id');

//elements
var permalinkBTN = $('permalinkBTN');
var permalink = $('permalink');

//parse url
var u = url.parse(location.href, true);
if ('search' in u) delete u.search;
u = {
  protocol: u.protocol,
  host: u.host,
  pathname: u.pathname,
  query: u.query || {}
};


//legacy "hash" based API
try {
  if (location.hash && /[^\#]+/.test(location.hash)) {
    u.query = JSON.parse(base64.decode(location.hash.replace(/^\#/, '')));
  }
} catch (ex) {
  if (typeof console !== 'undefined' &&  console && typeof console.error === 'function') {
    console.error(ex.stack || ex.message || ex);
  }
}
location.hash = '';

//permalink
permalinkBTN.addEventListener('click', function () {
  permalink.src = 'http://tinyurl.com/api-create.php?url=' + encodeURIComponent(url.format(u));
}, false);

//state
exports.get = function (key) {
  return u.query[key];
}
exports.set = function (key, value) {
  u.query[key] = value;
  permalink.src = '';
}

//if possible hide the query once we're loaded
if (window.history && window.history.pushState && typeof window.history.pushState === 'function') {
  window.history.pushState(null, null, url.format({
    protocol: u.protocol,
    host: u.host,
    pathname: u.pathname
  }));
}