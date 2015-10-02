var phridge = require('phridge'),
handlers    = require('./inc/handlers/index.js'),
GLOBALS     = require('./inc/vars.js'),
fs          = require('fs'),
query       = 'i am a legend',
website     = 'imdb',
url         = GLOBALS.websites[website] || false;

url = url.replace(GLOBALS.config.pattern, encodeURIComponent(query));

phridge.spawn()
  .then(function (phantom) {
    return phantom.openPage(url);
  })
  .then(function (page) {
    return page.run(handlers[website].process);
  })
  .finally(phridge.disposeAll)
  .done(function (results) {
    console.log(JSON.stringify(results));
    fs.writeFile('results.json', JSON.stringify(results), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  }, function (err) {
    throw err;
  });