elli.builder.layoutCollapse = (function () {
  'use strict';
  var LAYOUT_EFFECT_CONST = {
    duration: 200,
    easingEffect: 'swing'
  };

  function expandPanel(pnl) {
    $(pnl.selector).removeClass(pnl.expandClass).addClass(pnl.collapseClass);
    if (pnl.hasEasingEffect) {
      $(pnl.elem).stop().slideDown(LAYOUT_EFFECT_CONST.duration, LAYOUT_EFFECT_CONST.easingEffect);
    } else {
      $(pnl.elem).stop().slideDown(LAYOUT_EFFECT_CONST.duration);
    }
  }

  function collapsePanel(pnl) {
    $(pnl.selector).removeClass(pnl.collapseClass).addClass(pnl.expandClass);
    if (pnl.hasEasingEffect) {
      $(pnl.elem).stop().slideUp(LAYOUT_EFFECT_CONST.duration, LAYOUT_EFFECT_CONST.easingEffect);
    } else {
      $(pnl.elem).stop().slideUp(LAYOUT_EFFECT_CONST.duration);
    }
  }

  return {
    expandPanel: expandPanel,
    collapsePanel: collapsePanel
  };

}(elli.builder.layoutCollapse || {}));
