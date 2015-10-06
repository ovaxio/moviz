;(function() {
  "use strict"

  module.exports = {
    process : function (searched) {
      this.onConsoleMessage = function (msg) { console.log(msg); };

      return this.evaluate(function (searched) {// 'this' is an instance of PhantomJS' WebPage as returned by require("webpage").create()
        var multiResult, results, list, resultsTmp = [];
        list = $('.findResult');
        results = [];
        list.each(function (id) {
          var el, title, href, text;
          el = $(this);
          title = el.find('.result_text');
          text = title.text().trim();
          href = title.children('a').attr('href');

          if (-1 === text.search(/\((Short|Video|Video Game|TV Episode|TV Series|TV Movie|TV Special|TV Mini-Series|in development)\)/i) && -1 !== href.search(/^\/title/)){
            thumb = el.find('.primary_photo img').attr('src');
            img = thumb.replace(/(_V1_\w{2}32_CR0,0,32,44_AL_.jpg)$/, '_V1_SX214_AL_.jpg');
            results.push({
              'title' : text,
              'link'  : window.location.origin + title.children('a').attr('href'),
              'thumb' : thumb,
              'image' : img
            });

          }
        });

        if (results.length > 1 && searched != '') {
          resultsTmp = results.filter(function (current, idx, arr) {
            // console.log(searched, current.title, current.title.indexOf(searched));
            return current.title.indexOf(searched) > -1 ;
          });
        }

        if (resultsTmp.length > 0) {
          results = resultsTmp;
        }

        return results;
      }, searched);
    }
  }//exports

})();
