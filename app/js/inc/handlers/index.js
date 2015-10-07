;(function() {
  "use strict"
  var imdbHandler;

  imdbHandler = require('./imdb.js');

  module.exports = {
    imdb : imdbHandler
  };
})();