"use strict"
exports.process = function () {
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
        'link'  : text.children('a').attr('href'),
        'image' : el.find('.primary_photo img').attr('src')
      };
    });

    return results;
  });
}

