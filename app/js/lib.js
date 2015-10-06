;(function() {
  "use strict"
  var promise = require('bluebird'),
  fs          = promise.promisifyAll(require('fs')),
  babyparse   = require('babyparse'),
  patterns    = {
    year      : /(19\d{2}|200\d|201\d)/,
    quality   : /(1080p|720p|480p|4k)/i,
    extra     : /(\[.*\]|\(.*\))/gi,
    trim      : /(\W)+/gi,
    space     : /[^\w\n ]+/gi,
    extension : /\.([\w\d]+)$/
  };

  var lib = {
    getYear : function (movie) {
      var matches = movie.match(patterns.year);
      if (null == matches) {
        return '';
      }
      return matches[1];
    },

    getExtension : function (movie) {
      var matches = movie.match(patterns.extension);
      if (null == matches) {
        return '';
      }
      return matches[1];
    },

    getTitle : function (movie) {
      movie = movie.replace(/(19\d{2}|200\d|201\d).*/, '');
      movie = movie.replace(patterns.quality, '');
      movie = movie.replace(patterns.extra, '');
      movie = movie.replace(patterns.trim, '$1');
      movie = movie.replace(patterns.space, ' ');
      return movie.trim();
    },
    getExtra : function (movie) {
      movie = movie.replace(this.getTitle(movie), '');
      movie = movie.replace(patterns.year, '');
      movie = movie.replace(patterns.quality, '');
      movie = movie.replace(patterns.trim, '$1');
      movie = movie.replace(patterns.space, ' ');
      return movie.trim();
    },
    getQuality : function (movie) {
      var matches = movie.match(patterns.quality);
      if (null == matches) {
        return '';
      }
      return matches[1];
    }
  };

  module.exports = {
    parseCSV : function (filename) {
      return fs.readFileAsync(filename, 'utf8')
      .then(function (data) {
        var results = [];
        var save = data;

        data = babyparse.parse(data, {
          delimiter: ';',
          encoding: 'utf8',
          step: function(data, parser) {
            var rawData = data.data[0][0];
            var movie = {
              title : lib.getTitle(rawData),
              query : null,
              year  : lib.getYear(rawData),
              quality  : lib.getQuality(rawData),
              extra : lib.getExtra(rawData),
              raw   : rawData,
              extension : lib.getExtension(rawData)
            };

            movie.query = movie.title + ' ' + movie.year;
            results.push(movie);
          }
        });
         return results;
      });
    }
  }//exports

})();
