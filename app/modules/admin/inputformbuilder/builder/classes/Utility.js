elli.builder.utility = (function () {
  'use strict';

  var builder = elli.builder;

  var config = builder.config,
    restfulservices = IFB_NAMESPACE.restfulservices,
    sessionManagement = IFB_NAMESPACE.SessionManagement;

  var position = {
    set: function (obj, dir, px) {
      var objPos = obj.position();
      var size = 0;

      switch (dir) {
        case 'left':
          size = objPos.left + px;
          break;
        case 'right':
          size = objPos.left - px;
          break;
        case 'top':
          size = objPos.top + px;
          break;
        case 'bottom':
          size = objPos.top - px;
          break;
        default:
          size = 0;
      }

      if (size > 0) {
        obj.css(dir, size);
      }
    }
  };

  var map = {
    gridSchema: function (json) {
      var schema = {model: {}};

      schema.model.id = json.id;
      schema.model.fields = {};
      $.each(schema.fields, function (fIndex, fValue) {
        schema.model.fields[fValue.field] = fValue.params;
      });
      return schema;
    }
  };

  var utility = {};

  utility.generateGUID = function () {
    function randomize(s) {
      var p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }

    var guidStr = randomize() + randomize(true) + randomize(true) + randomize();
    guidStr = guidStr.replaceAt(14, '4'); //Make compliant with guidStandard
    return guidStr;
  };

  utility.getArrayDifference = function (assets, inputFormAssets) {
    var assetIds = {};
    var n;
    assets.forEach(function (obj) {
      assetIds[obj.AssetId] = obj;
    });

    inputFormAssets = inputFormAssets.filter(function (asset) {
      return !(asset.AssetId in assetIds);
    });

    for (n = 0; n < assets.length; n++) {
      inputFormAssets.push(assets[n]);
    }

    return inputFormAssets;
  };

  utility.createStyleString = function (keys, panelProperties) {
    var style = '';
    var i;
    for (i = 0; i < keys.length; i++) {
      style += keys[i] + ':' + panelProperties[keys[i]] + ';';
    }

    return style;
  };

  utility.getKeys = function (properties) {
    return Object.keys(properties);
  };

  utility.recurseElement = function ($node, array) {
    $node.children().each(function () {
      array.push(this);
      //TODO: where is this function?
      // recursiveIterate($(this), array);
    });
  };

  //Objects
  utility.mapJson = function (type, json) {
    var obj = map[type];
    return obj(json);
  };

  utility.setPosition = function (obj, dir, px) {
    position.set(obj, dir, px);
  };

  utility.findTotalRows = function (panelData) {
    var rows = 0;
    for (var i = 0; i < panelData.length; i++) {
      if (panelData[i].row > rows) {
        rows = panelData[i].row;
      }
    }
    return rows;
  };

  utility.findTotalCols = function (panelData) {
    var cols = 0;
    for (var i = 0; i < panelData.length; i++) {
      if (panelData[i].col > cols) {
        cols = panelData[i].row;
      }
    }
    return cols;
  };

  utility.sortByRow = function (a, b) {
    if (a.row < b.row) {
      return -1;
    }
    if (a.row > b.row) {
      return 1;
    }
    return 0;
  };

  /**
   * Get the value of a querystring
   * @param  {String} field The field to get the value of
   * @param  {String} url   The URL to get the value from (optional)
   * @return {String}       The field value
   */
  utility.getQueryString = function (field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
  };

  utility.getSessionId = function () {
    return sessionManagement.getSessionId();
  };

  utility.getRestfulServices = function () {
    var sessionId = this.getSessionId();
    var restfulServices = restfulservices.setBaseURL(config.getRestBaseURL(), sessionId);

    return restfulServices;
  };

  utility.formatDate = function (rawDate) {
    var date = new Date(rawDate);
    var year = date.getFullYear(),
      month = date.getMonth() + 1, // months are zero indexed
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
      minuteFormatted = minute < 10 ? '0' + minute : minute,
      morning = hour < 12 ? 'am' : 'pm';
    var result = month + '/' + day + '/' + year + ' ' + hourFormatted + ':' +
      minuteFormatted + morning;
    return result;
  };

  utility.removePrefix = function (pre, str) {
    return str.replace(pre, '');
  };

  utility.initSlider = function (id, min, max, spacing) {
    $(id).slider({
      create: function (event, ui) {
        var counter, noOfTicks = parseInt(max / spacing, 10);
        $(id).find('.ui-slider-tick-mark').remove();
        for (counter = 0; counter <= noOfTicks; counter++) {
          $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * counter) + '%').appendTo($(this));
        }
      },
      min: 0,
      max: 100
    });
    return $(id).slider();
  };

  utility.getIndexOf = function (jsonSchema, id) {
    return $.map(jsonSchema, function (obj, index) {
      if (obj.cid === id) {
        return index;
      }
    });
  };
  return utility;

})();
