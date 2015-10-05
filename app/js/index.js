var phridge = require('phridge'),
promise     = require('bluebird'),
handlers    = require('./inc/handlers/index.js'),
GLOBALS     = require('./inc/vars.js'),
moviez      = require('./lib.js'),
fs          = promise.promisifyAll(require('fs')),
query       = ['i am a legend', 'big hero 6'],
website     = 'imdb',
resultPath  = './data',
results     = {},
page        = null,
phantom     = null;

var babyparse = require('babyparse');

moviez.clean()
.then(function (data) {
  query = babyparse.parse(data).data;
  return phridge.spawn()
})
.then(function (p) {
  phantom = p
  return fetchMovies(query);
})
.then(function (result) {
  if (result) {
    console.log(query[query.length-1])
    results[query[query.length-1]] = result;
  }
})
.finally(phridge.disposeAll) // close all phantomjs processes
.done(function () {
  saveResult(results);
}, function (err) {
  throw err;
});

// functions
function saveResult(results) {
  fs.mkdirAsync(resultPath).catch(function (err) {
    if (err.code === 'EEXIST') {
      return true;
    }
    throw err;
  })
  .then(function () {
    console.log('Save results...');
    return fs.writeFileAsync(resultPath + '/results.json', JSON.stringify(results));
  })
  .then(function () {
    console.log('Results is saved in ' + resultPath + '/results.json !');
  })
  .catch(function(err) {
      throw err
  });
}

function fetchMovies(query) {
  return query.reduce(function (promise, q, idx) {// promise = valeur precedente, q = valeur courante
    return promise.then(function (result) {
      var tmp = GLOBALS.websites[website];
      if (idx > 0) {
        console.log(query[idx-1])
        results[query[idx-1]] = result;
      }

      url = tmp.replace(GLOBALS.config.pattern, encodeURIComponent(q));

      return phantom.openPage(url)
        .then(function (page) {
          console.log(url);
          return page.run(handlers[website].process); // page.evaluate
        });
    });
  }, promise.resolve());
}

function getUrls(query) {
  var urls = [],
      tmp;
  for (var i = query.length - 1; i >= 0; i--) {
    tmp = url;
    urls[i] = tmp.replace(GLOBALS.config.pattern, encodeURIComponent(query[i]));
  };
  return urls;
}
