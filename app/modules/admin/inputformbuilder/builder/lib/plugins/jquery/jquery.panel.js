(function ($) {
  'use strict';
  $.fn.contentPanel = function (options) {
    var panel = $(this);

    var defaults = {
      wrapperClassName: 'panel-wrapper',
      controllerClassName: 'panel-controller',
      tabControllerClassName: 'panel-tab-controller',
      zIndex: 10000
    };

    var settings = $.extend({
      defaultState: 'closed',
      toggleClass: {closed: 'Close Panel', open: 'Open Panel'},
      toggleText: {closed: 'closed', open: 'open'},
      duration: 650,
      effect: 'linear',
      tab: $('<span/>'),
      position: 'bottom'
    }, options);

    var isVisible = settings.visible;

    var panelWrapper = $('<div/>');
    panelWrapper.addClass(defaults.wrapperClassName);

    var panelController = $('<div/>');
    panelController.addClass(defaults.controllerClassName);

    var panelTabController = $('<div/>');
    panelTabController.addClass(defaults.tabControllerClassName);
    var tab = settings.tab.addClass(settings.toggleClass[settings.defaultState]);
    panelTabController.html(tab);

    panelController.append(panelTabController);
    panelWrapper.append(panelController);
    panelWrapper.append(panel);

    var panelWrapperClass = elementClassSelector(defaults.wrapperClassName);
    //var panelControllerClass = elementClassSelector(defaults.controllerClassName);
    var panelTabControllerClass = elementClassSelector(defaults.tabControllerClassName);

    var tabCloseClass = panelTabControllerClass + ' ' + settings.toggleClass.closed;
    var tabOpenClass = panelTabControllerClass + ' ' + settings.open.selector;

    function elementClassSelector(cl) {
      return '.' + cl;
    }

    $(document).on('click', panelTabController, function () {
      this.togglePanel();
    });

    this.togglePanel = function () {
      ((this.isVisible) ? this.hidePanel : this.showPanel)();
    };

    this.hidePanel = function () {
      var position = settings.position;
      var opts = {};
      opts[position] = (position === 'bottom' ? panel.height() * -1 : panel.height());

      $(panelWrapperClass).animate({
        bottom: -(this.getAnimationOffset())
      }, settings.duration, settings.effect, function () {
        isVisible = false;
        this.updateTab();
      });
    };

    this.showPanel = function () {
      $(panelWrapperClass).animate({
        bottom: 0
      }, settings.duration, settings.effect, function () {
        isVisible = true;
        this.updateTab();
      });
    };

    this.horizontalOpen = function () {

    };

    this.updateTab = function () {

      if (this.isVisible) {
        tab.removeClass(tabCloseClass).addClass(tabOpenClass);
        tab.text(settings.open.text);
      } else {
        tab.removeClass(tabOpenClass).addClass(tabCloseClass);
        tab.text(settings.close.text);
      }
    };

    return this;
  };
}(jQuery));
