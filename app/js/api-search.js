var promise = require('bluebird'),
GLOBALS     = require('./inc/vars.js'),
moviez      = require('./lib.js'),
fs          = promise.promisifyAll(require('fs'));


fs.readFileAsync('./data/results.json', 'utf8')
.then(function (data) {
  return JSON.parse(data);
})
.then(function (data) {
  return moviez.search(data, search);
});

/**
 * globs must have these properties
 * {
 *   list        : {array},
 *   current     : {movieObject},
 *   index       : {int},
 *   context     : {ContextObject} / NULL
 * }
*
**/
function search(globs, result) {
  var query = {
    title : globs.current.title,
    year  : globs.current.year
  };

  // find movie by title and year
  var url = getUrl('omdb', query);
  console.log(url);
  // if no result, find movie only by title

  // if no result, find movie by searching similar title
}

function getUrl(api, query) {
  var api = GLOBALS.api[api];
  var url = api.endpoint;
  var params = '';
  var field;
  var keys = Object.keys(api.params);
  for (i = keys.length; i--;) {
    field = api.params[keys[i]];
    if (query[keys[i]] || field['default']) {
      if (params.length > 0) {
        params += '&';
      }

      params += field.field + '=' + ((query[keys[i]]) ? encodeURIComponent(query[keys[i]]) : encodeURIComponent(field['default']));
    }
  }

  return url + params;
}