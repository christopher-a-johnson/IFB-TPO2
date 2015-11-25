(function () {
  'use strict';
  var fs = require('fs');
  var es = require('event-stream');
  var shell = require('shelljs');

  module.exports = function () {
    var tfs_path = resolve_tfs_path();
    return es.mapSync(function (file) {
      var tfs_command = tfs_path + ' checkout "' + file.path + '"';
      shell.exec(tfs_command, {
        silent: true,
        async: false
      });
      return file;
    });
  };

  // utility functions
  function resolve_tfs_path() {
    for (var version = 12; version > 8; version--) {
      var path32 = 'C:\\Program Files\\Microsoft Visual Studio ' + version + '.0\\Common7\\IDE\\TF.exe';
      var path64 = 'C:\\Program Files (x86)\\Microsoft Visual Studio ' + version + '.0\\Common7\\IDE\\TF.exe';
      if (fs.existsSync(path64)) {
        return '"' + path64 + '"';
      }
      if (fs.existsSync(path32)) {
        return '"' + path32 + '"';
      }
    }
  }
}());
