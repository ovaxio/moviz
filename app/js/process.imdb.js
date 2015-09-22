var page = require('webpage').create(),
    query;

query = 'independance day';

page.onConsoleMessage = function(msg) {
  console.log('CONSOLE: ' + msg);
};

page.open("http://www.imdb.com/find?ref_=nv_sr_fn&q="+query+"&s=all", function (status) {
  var results = [];

  if (status !== "success") {
    console.log("Unable to access network");
  } else {
    results = page.evaluate(function() {
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
    console.log(JSON.stringify(results));

  }

  phantom.exit();
});

