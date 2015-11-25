//Top level name space for the builder
var elli = elli || {};
elli.builder = elli.builder || {};
elli.builder.json = elli.builder.json || {};
//var restful = require ('lib/vendor/restful.min');

elli.builder.panel = elli.builder.panel || {};
elli.builder.panel.load = elli.builder.panel.load || {};
elli.builder.config = (function () {
  'use strict';

  var configurations = {};
  elli.encompass = elli.encompass || {};
  elli.encompass.web = elli.encompass.web || {};
  window.IFB_NAMESPACE = elli.encompass.web;
  var builderRestBaseURL = 'http://encompass-ea.dev.dco.elmae/v2';

  configurations.getRestBaseURL = function () {
    return builderRestBaseURL;
  };

  return configurations;

}());
