
elli.builder.layoutfunctions = (function ($, kendo) {
  'use strict';

  //CONTROLS
  var formsWindow = null, propertyTooltip, modalWindow, builder = elli.builder;
  var template = builder.template,
    clipboard = builder.clipboard;

  //KENDO OBJECTS
  //var propertiesPanel = null;

  //GLOBAL VARS
  //var selectedFormId = 0;
  //var isDrawerExpanded = 0;
  var templateLoadArr = [
    'control.single',
    'control.advanced',
    'control.combined',
    'control.gridpanel',
    'control.list',
    'control.panel',
    'control.panelbox',
    'control.paragraph',
    'control.tt-property'
  ];
  /*
   function initFieldLabels() {
   $(':input[title]').each(function () {
   var $this = $(this);
   if ($this.val() === '') {
   $this.val($this.attr('title'));
   }
   $this.focus(function () {
   if ($this.val() === $this.attr('title')) {
   $this.val('');
   }
   });
   $this.blur(function () {
   if ($this.val() === '') {
   $this.val($this.attr('title'));
   }
   });
   });
   }

   function createFormList(obj, ds) {
   $(obj).kendoListView({
   dataSource: ds,
   selectable: true,
   navigatable: true,
   change: setSelectedFormListValue,
   template: '<li id=\'#:id#\'>#:name#</li>'
   });
   }

   function clearSelectedForms() {
   $('#openFormTabs .tab').children('ul').each(function () {
   $(this).data('kendoListView').clearSelection();
   });
   }

   function setSelectedFormListValue() {
   var data = this.dataSource.view(),
   selected = $.map(this.select(), function (item) {
   return data[$(item).index()].id;
   });
   selectedFormId = selected.join('');
   } */

  function initPropertyTooltip() {
    propertyTooltip = $('.gridListContainer').kendoTooltip({
      filter: '.gearButton',
      width: 400,
      position: 'right',
      autoHide: false,
      showOn: 'click',
      content: kendo.template($('#controlTemplate_ttProperty').html())
    }).data('kendoTooltip');
  }

  function initModalWindow() {
    modalWindow = $('#modalWindow').kendoWindow({
      width: 800,
      visible: false,
      modal: true,
      content: {
        template: kendo.template($('#controlTemplate_ttProperty').html())
      }
    });

    $('.gridListContainer').on('click', '.detailButton', function () {
      modalWindow.data('kendoWindow').center().open();
    });
  }

  function adjustElementSizes() {
    //ribbon
    //var controlPanels = $('.controlsPanel').length;
    //var ribbonWidth = $('#ribbon').outerWidth(true);
    //var ribbonHeight = $('#ribbon').outerHeight(true);
    //var ribbonHeadingHeight = $('.ribbonPanel header').outerHeight(true);
    //var ribbonLayoutWidth = $('#ribbonLayout').outerWidth(true);
    //var adjustedWidth = ((ribbonWidth - ribbonLayoutWidth)) / controlPanels;
    var standardControlWidth = $('#ribbonStandardControls').outerWidth(true);
    var standardControlParentWidth = $('#ribbonStandardControls').offsetParent().outerWidth(true);
    var standardControlwidthinPercent = 100 * standardControlWidth / standardControlParentWidth;
    var combinedControlWidth = $('#ribbonCombinedControls').outerWidth(true);
    var combinedControlParentWidth = $('#ribbonCombinedControls').offsetParent().outerWidth(true);
    var combinedControlwidthinPercent = 100 * (combinedControlWidth / combinedControlParentWidth);
    $('#ribbonStandardControlsHeader').width((standardControlwidthinPercent - 2) + '%');
    $('#ribbonCombinedControlsHeader').width((combinedControlwidthinPercent - 2) + '%');

    //var adjustedHeight = ribbonHeight - ribbonHeadingHeight;

    //tabs
    $('#openFormTabs').children('.k-content').height(290);
  }

  //Code for Hidden workspace ends here

  function setTooltip() {
    $('.propMode').kendoTooltip({
      autoHide: true,
      width: 280,
      show: function (e) {
        e.sender.popup.element.addClass('mode-tooltip');
      }
    });

    $('.moveMode').kendoTooltip({
      autoHide: true,
      width: 280,
      show: function (e) {
        e.sender.popup.element.addClass('mode-tooltip');
      }
    });
  }

  return {
    init: function () {
      clipboard.init();
      template.load(templateLoadArr);

      setTimeout(function () {
        initPropertyTooltip();
        initModalWindow();
        adjustElementSizes();
        setTooltip();
        ////BINDINGS
        $('#openFormButton').on('click', function () {
          var selectedTab = $('#openFormTabs').kendoTabStrip().data('kendoTabStrip').select();
          var selectedTabId = selectedTab[0].id;
          if (selectedTabId === 'standardFormsTab') {
            //open form
            formsWindow.data('kendoWindow').close();
          }
        });
        $('#windowCloseButton').on('click', function () {
          formsWindow.data('kendoWindow').close();
        });
      }, 500);
    }
  };

}(jQuery, kendo));

elli.builder.layoutfunctions.init();
