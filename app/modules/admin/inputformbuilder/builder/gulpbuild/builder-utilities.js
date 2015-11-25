module.exports = function (plugins) {
  'use strict';

  return {

    clean: function clean(log, path, done) {
      log('Input Form Builder: Clean path --' + plugins.util.colors.blue(path));
      plugins.del(path, done);
    },

    log: function log(msg, done) {
      if (typeof (msg) === 'object') {
        for (var item in msg) {
          if (msg.hasOwnProperty(item)) {
            plugins.util.log(plugins.util.colors.blue(msg[item]));
          }
        }
      } else {
        plugins.util.log(plugins.util.colors.blue(msg));
      }
    }
  };
};
