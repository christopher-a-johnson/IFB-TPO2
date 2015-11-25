IFB_NAMESPACE.Utility = (function () {

  'use strict';

  var utility = {};

  utility.MapJson = {
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

  utility.Position = {
    adjustObject: function (obj, dir, px) {
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

  utility.TimeConversion = {
    convertToTimestamp: function (inputDate) {
      return Math.floor((new Date(inputDate).getTime()) / 1000);
    }
  };
  utility.Capitalize = function (string) {
    return (!string || string === '') ? '' : string.charAt(0).toUpperCase() + string.slice(1);
  };
  return utility;

}(IFB_NAMESPACE.Utility || {}));
