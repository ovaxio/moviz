var promise = require('bluebird'),
GLOBALS     = require('./inc/vars.js'),
moviez      = require('./lib.js'),
fs          = promise.promisifyAll(require('fs')),
http        = require('http'),
jsonData    = null;

fs.readFileAsync('./data/results.json', 'utf8')
.then(function (data) {
  jsonData = JSON.parse(data);
  return jsonData;
})
.then(function (data) {
  // moviez.search(data, search);
  return moviez.search(data, search);
})
.then(function () {
  console.log(jsonData);
});
// .finally(phridge.disposeAll) // close all phantomjs processes
// .done(function () {
//   moviez.saveFile(query);
// }, function (err) {
//   throw err;
// });

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
    title : globs.current.Title,
    year  : globs.current.Year
  };

  // find movie by title and year
  var url = getUrl('omdb', query);

  // var PromiseRequest = promise.method(function (url) {
    // return new promise(function (resolve, reject) { 
      http.get(url, function (res) {
        var body = '';
        console.log(url);

        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', function () {
          // try {
          //   var parsed = JSON.parse(body);
          // } catch (err) {
          //   console.error('Unable to parse response as JSON', err);
          //   return cb(err);
          // }

          // // pass the relevant data back to the callback
          // cb(null, {
          //   email: parsed.email,
          //   password: parsed.pass
          // });
        });
      }).on('error', function (e) {
        promise.reject("Got error: " + e.message);
      });
    // });
  // });

  // PromiseRequest(url)
  // .then(function (data) {
  //   jsonData[globs.index].results = data;
  //   promise.resolve();
  // });

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