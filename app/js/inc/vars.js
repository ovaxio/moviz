module.exports = {
  websites : {
    imdb : "http://www.imdb.com/find?ref_=nv_sr_fn&q={{query}}&s=all"
  },
  api : {
    omdb : {
      endpoint : 'http://www.omdbapi.com/?',
      params : {
        id     : {
          field: 'i',
          'default' : '',
        },
        title  : {
          field: 't',
          'default' : '',
        },
        similar  : {
          field: 's',
          'default' : '',
        },
        type   : {
          field: 'type',
          'default' : 'movie'
        },
        year   : {
          field: 'y',
          'default' : ''
        },
        plot   : {
          field: 'plot',
          'default' : 'short'
        },
        format : {
          field: 'r',
          'default' : 'json'
        }
      }
    }
  },
  config : {
    pattern : /{{query}}/gi
  }
};