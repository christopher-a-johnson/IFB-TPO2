elli.builder.template = (function ($, host) {
  'use strict';

  var appRoot = '';

  var hostname = $(location).attr('hostname');
  if (hostname === 'localhost') {
    appRoot = '/app/modules/admin/inputformbuilder/builder';
  } else {
    appRoot = '/builder';
  }

  var templateDir = '/templates/',
    loaded = 'TEMPLATE_LOADED';

  return {
    setDirectory: function (tmplDir) {
      templateDir = tmplDir;
    },

    load: function (tmpls) {

      if (!$.isArray(tmpls)) {
        tmpls = tmpls.split(',');
      }

      $.each(tmpls, function () {
        var tmpl,
          path,
          tmplLoader;

        tmpl = (this.indexOf('.html') === -1) ? this + '.html' : this;
        path = appRoot + templateDir + $.trim(tmpl);

        tmplLoader = $.get(path)
          .success(function (result) {
            $('body').append(result);
          })
          .error(function (result) {
            //console.log("Error Loading Template: " + tmpl);
          });

        tmplLoader.complete(function (tmpl) {
          $(host).trigger(loaded, [path]);
        });
      });
    },

    bind: function (tmplId) {
      $(host).bind(loaded, function (e, path) {
        //Enable when there is an usage for itemTemplate. Otherwise, JSHint complains
        // var itemTemplate = kendo.template($(tmplId).html(), {useWithBlock: false});
      });
    }
  };

}(jQuery, document));
