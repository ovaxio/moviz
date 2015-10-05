;(function() {
  "use strict"
  var promise = require('bluebird'),
      fs      = promise.promisifyAll(require('fs'));

  module.exports = {
    clean : function () {
      return fs.readFileAsync('./app/assets/movies.csv', 'utf8')
      .then(function (data) {
         // data = data.replace(/(\d{3,4}p|.mp4|.avi|.mkv|blueray|bluray|dvdrip|brrip|4k|\dcd|[xh]\d{3}|aac|dts|web|dd5|hd|3d|xvid|etrg|rarbg|yify|jyk|hevc|ddr|extended|remux|avc|mafiaking|m2tv|mp3)/gi, '');
         data = data.replace(/(19\d{2}|200\d|201\d).*/gi, ''); // all the things after the year
         data = data.replace(/(1080p|720p|4k).*/gi, ''); //all the thing after 720p / 1080p / 4k
         data = data.replace(/(\[.*\]|\(.*\))/gi, ''); // all the things between [] or ()
         data = data.replace(/(\W)+/gi, '$1'); // deduplicate the non word char
         data = data.replace(/[^\w\n ]+/gi, ' '); // transform all the non word char ( except \n and space) into space
         return data;
      });
    }
  }//exports

})();
