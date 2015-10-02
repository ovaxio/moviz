var phridge = require('phridge'),
    Imdb = require('./inc/handlers/imdb.js'),
    query;

query = 'independance day';

phridge.spawn()
  .then(function (phantom) {
    return phantom.openPage("http://www.imdb.com/find?ref_=nv_sr_fn&q="+query+"&s=all");
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