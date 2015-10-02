module.exports = {
  websites : {
    'imdb' : "http://www.imdb.com/find?ref_=nv_sr_fn&q={{query}}&s=all"
  },
  config : {
    pattern : /{{query}}/gi
  }
}