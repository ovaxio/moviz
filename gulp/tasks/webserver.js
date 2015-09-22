var gulp      = require('gulp'),
  GLOBVARS    = require('../vars'),
  plugins     = require('gulp-load-plugins')({
    rename: {
      'gulp-server-livereload' : 'server'
    }
  });

gulp.task('webserver', function() {
  gulp.src('app')
    .pipe(plugins.server({
      livereload: true,
      directoryListing: false,
      defaultFile: 'index.html',
      open: true,
      port: 1234
    }));
});