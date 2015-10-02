;(function() {
  "use strict"

  module.exports = {
    process : function () {
      // 'this' is an instance of PhantomJS' WebPage as returned by require("webpage").create()
      return this.evaluate(function() {
        var results, list;
        list = $('.findResult');
        results = [];

        list.each(function (id) {
          var el, text;

          el = $(this);
          text = el.find('.result_text');

          results[id] = {
            'title' : text.text(),
            'link'  : window.location.origin + text.children('a').attr('href'),
            'image' : el.find('.primary_photo img').attr('src')
          };
        });

        return results;
      });
    }
  }//exports

})();
