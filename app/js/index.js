var phridge = require('phridge'),
    Imdb = require('./inc/handlers/imdb.js'),
    GLOBALS = require('./inc/vars.js'),
    query, website, pattern, url;

query = 'i am a legend';
website = 'imdb';

url = GLOBALS.websites[website] || false;
url = url.replace(GLOBALS.config.pattern, encodeURIComponent(query));

phridge.spawn()
  .then(function (phantom) {
    return phantom.openPage(url);
  })
  .then(function (page) {
    return page.run(Imdb.process);
  })
  .finally(phridge.disposeAll)
  .done(function (results) {
    console.log(JSON.stringify(results));
  }, function (err) {
    throw err;
  });