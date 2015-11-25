module.exports = function (gulp, plugins, config) {
  'use strict';
  return function () {
    var spritesmith = require('gulp.spritesmith'),
      sprite = gulp.src(config.spriteImages)
        .pipe(plugins.rename(function (path) {
          path.basename = path.basename.replace(/\s+|@/g, '');
          path.basename = path.basename.toLowerCase();
          path.basename = path.basename.replace(/-disabled$/, '-dis:disabled');
          path.basename = path.basename.replace(/-dis$/, '-dis:disabled');
          path.basename = path.basename.replace(/-hover$/, '-hov:hover:not([disabled])');
          path.basename = path.basename.replace(/-over$/, '-hov:hover:not([disabled])');
          path.basename = path.basename.replace(/-ovr$/, '-hov:hover:not([disabled])');
          path.basename = path.basename.replace(/-hover2x$/, '-hov2x:hover:not([disabled])');
          /* worst case replace hover even if you dont have hyphen in filename */
          path.basename = path.basename.replace(/hover$/, '-hov:hover:not([disabled])');
          path.basename = path.basename.replace(/hover2x$/, '-hov2x:hover:not([disabled])');
        }))
        .pipe(gulp.dest(config.tmp))
        .pipe(spritesmith({
          imgName: '../images/ngen-sprite.png',
          cssName: 'ngen-sprite.css',
          cssTemplate: config.spriteTemplate,
          algorithm: 'binary-tree'
        }));
    sprite.img
      .pipe(gulp.dest(config.app + 'images/'));
    return sprite.css
      .pipe(gulp.dest(config.app + 'styles/'));
  };
};
