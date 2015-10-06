var phridge = require('phridge'),
promise     = require('bluebird'),
handlers    = require('./inc/handlers/index.js'),
GLOBALS     = require('./inc/vars.js'),
moviez      = require('./lib.js'),
fs          = promise.promisifyAll(require('fs')),
query       = null,
website     = 'imdb',
resultPath  = './data',
phantom     = null,
babyparse   = require('babyparse');

// initialize json with a list of movies
// var moviezP = moviez.parseCSV('./app/assets/movies.csv')
// .then(function (jsonData) {
//   saveResult(jsonData);
//   return jsonData;
// });


fs.readFileAsync('./data/results.json', 'utf8')
.then(function (data) {
  query = JSON.parse(data);
  return phridge.spawn()
})
.then(function (p) {
  phantom = p
  return fetchMovies(query);
})
.then(function (result) {
  if (result) {
    query[query.length-1].results = result;
  }
})
.finally(phridge.disposeAll) // close all phantomjs processes
.done(function () {
  saveResult(query);
}, function (err) {
  throw err;
});

// functions
function saveResult(data) {
  fs.mkdirAsync(resultPath).catch(function (err) {
    if (err.code === 'EEXIST') {
      return true;
    }
    throw err;
  })
  .then(function () {
    console.log('Save results...');
    return fs.writeFileAsync(resultPath + '/results.json', JSON.stringify(data));
  })
  .then(function () {
    console.log('Results is saved in ' + resultPath + '/results.json !');
  })
  .catch(function(err) {
      throw err
  });
}

function fetchMovies(data) {
  return data.reduce(function (promise, q, idx) {// promise = valeur precedente, q = valeur courante
    return promise.then(function (result) {
      var searchUrl = GLOBALS.websites[website],
          line      = data[0];

      if (idx > 0) { // first loop finished
        line = data[idx];
        query[idx-1].results = result;
      }

      if (line.results && line.results != null) {
        return line.results;
      }

      title     = line.title;
      searchUrl = searchUrl.replace(GLOBALS.config.pattern, encodeURIComponent(q.query));

      return phantom.openPage(searchUrl)
        .then(function (page) {
          console.log(title, searchUrl);
          return page.run(title, handlers[website].process); // page.evaluate
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
