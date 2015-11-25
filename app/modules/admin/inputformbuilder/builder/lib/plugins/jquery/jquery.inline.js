(function ($, document) {
  'use strict';
  /*
   Name:           Inline Edit jQuery Plugin
   Description:    Edit form elements in place by clicking on read only labels that represent form field values.
   Settings:
   action - specifies the mouse action to initiate editing
   fieldSelector - jQuery selector for child elements of the parent element
   hoverClass - CSS class assigned to field label when hovering over editable area
   labelClass - CSS class assigned to field label in read-only state
   editMode - controls whether all the elements in the parent are activated at once
   values: single|multiple
   Usage:          $('#form').inlineEdit();
   Created By:     Dave Madril
   Created On:     03/18/2015
   */
  $.fn.inlineEdit = function (options) {

    var settings = $.extend({
      action: 'click',
      fieldSelector: '.inline',
      hoverClass: 'formfield-label-hover',
      labelClass: 'formfield-label',
      editMode: 'single'
    }, options);

    var tempLabelClass = 'inline-field-label',
      fields = $(this).find(settings.fieldSelector);

    var checkFieldFocus = function () {
      var focusedElem = $(settings.fieldSelector + ':focus');
      var labels = getAllLabels();

      if (focusedElem.length === 0) {
        $.each(fields, function () {
          var thisId = $(this).attr('id');
          var labelElem = thisId + '-label';
          var  fieldElem = $(this);
          $('#' + labelElem).text( $(fieldElem).val());
        });
        fields.hide();
        labels.show();
      }
    };

    var getAllLabels = function () {
      return $('.' + tempLabelClass);
    };

    $.each(fields, function () {
      var thisId = $(this).attr('id'),
        labelElem = $('<span/>'),
        fieldElem = $(this);

      labelElem.addClass(settings.labelClass).addClass(tempLabelClass);
      labelElem.attr('id', thisId + '-label');
      labelElem.text($(this).val());

      fieldElem.hide();
      fieldElem.before(labelElem);

      //bindings
      labelElem.on(settings.action, function () {
        $(this).hide();
        fieldElem.show();
      });
      labelElem.on('click', function () {
        var labels = getAllLabels();

        if (settings.editMode === 'multiple') {
          fields.show();
          $(labels).hide();
        }
        $(this).next().focus();
      });
      labelElem.hover(function () {
        $(this).addClass(settings.hoverClass);
      }, function () {
        $(this).removeClass(settings.hoverClass);
      });

      fieldElem.on('blur', function () {
        if (settings.editMode === 'multiple') {
          setTimeout(function () {
            checkFieldFocus();
          }, 50);     //slightly delay the check for field focus before hiding fields
        } else {
          $('#' +labelElem).text($(this).val());
          $(this).hide();
          labelElem.show();
        }
      });

      $(document).on('click', function () {
        checkFieldFocus();
      });
    });
  };
}(jQuery, document));
