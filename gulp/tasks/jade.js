var gulp      = require('gulp'),
  GLOBVARS    = require('../vars'),
  plugins     = require('gulp-load-plugins')();

  gulp.task('jade:dev', function () {
  gulp.src(GLOBVARS.src.jade)
  .pipe(plugins.plumber({errorHandler: plugins.notify.onError(GLOBVARS.onError)}))
  .pipe(plugins.jade({pretty: true}))
  .pipe(plugins.size({showFiles: true}))
  .pipe(gulp.dest(GLOBVARS.prod.html));
  return
});