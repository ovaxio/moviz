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
  },
  resultPath  = './data',
  resultFile  = resultPath + '/results.json';

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
    parseCSV: function (filename) {
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
              Title     : lib.getTitle(rawData),
              Query     : null,
              Year      : lib.getYear(rawData),
              Quality   : lib.getQuality(rawData),
              Extra     : lib.getExtra(rawData),
              Raw       : rawData,
              Extension : lib.getExtension(rawData)
            };

            movie.Query = movie.Title + ' ' + movie.Year;
            results.push(movie);
          }
        });
         return results;
      });
    },

    saveFile: function (data) {
      fs.mkdirAsync(resultPath).catch(function (err) {
        if (err.code === 'EEXIST') {
          return true;
        }
        throw err;
      })
      .then(function () {
        console.log('Save results...');
        return fs.writeFileAsync(resultFile, JSON.stringify(data));
      })
      .then(function () {
        console.log('Results is saved in ' + resultFile + ' !');
      })
      .catch(function(err) {
          throw err
      });
    },

    search: function (data, context, cb) {
      if ('undefined' === typeof cb) {
        cb = context;
        context = null;
      }
      return data.reduce(function (prev, current, index) { // first time prev = promise.resolve() (see line 118)
        return prev.then(cb.bind(this, {
          list        : data,
          current     : current,
          index       : index,
          context     : context
        }));
      }, promise.resolve());
    }
  }//exports

})();
