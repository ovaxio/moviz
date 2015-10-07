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

// // initialize json with a list of movies
// var moviezP = moviez.parseCSV('./app/assets/movies.csv')
// .then(function (jsonData) {
//   moviez.saveFile(jsonData);
//   return jsonData;
// });


fs.readFileAsync('./data/results.json', 'utf8')
.then(function (data) {
  query = JSON.parse(data);
  return phridge.spawn()
})
.then(function (phantom) {
  return moviez.search(query, phantom, search);
})
.then(function (result) {
  if (result) {
    query[query.length-1].results = result;
  }
})
.finally(phridge.disposeAll) // close all phantomjs processes
.done(function () {
  moviez.saveFile(query);
}, function (err) {
  throw err;
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
  var searchUrl = GLOBALS.websites[website],
      line      = globs.list[0];

  if (null === globs.context) {
    throw 'You must provide a phantomjs object as context';
  }

  if (globs.index > 0) { // first loop finished
    line = globs.list[globs.index];
    globs.list[globs.index-1].results = result;
  }

  if (line.results && line.results != null) {
    return line.results;
  }

  title     = line.title;
  searchUrl = searchUrl.replace(GLOBALS.config.pattern, encodeURIComponent(globs.current.query));

  return globs.context.openPage(searchUrl)
  .then(function (page) {
    console.log(title, searchUrl);
    return page.run(title, handlers[website].process); // page.evaluate
  });
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
