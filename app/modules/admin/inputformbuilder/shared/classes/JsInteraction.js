IFB_NAMESPACE.JsInteraction = (function () {
  'use strict';
  var jsInteraction = {};

  jsInteraction.PropertyCollapseTextChange = {
    changeSwitchContainerBorder: function () {
      if ($('.km-switch-container').length >= 1) {
        if ($('.km-switch').hasClass('km-switch-off')) {
          $('.km-switch-handle').removeClass('changeSwitchOn').addClass('changeSwitchOff');
          $('.km-switch-container').removeClass('switchBorderBlue').addClass('switchBorderGrey');
        } else {
          $('.km-switch-handle').removeClass('changeSwitchOff').addClass('changeSwitchOn');
          $('.km-switch-container').removeClass('switchBorderGrey').addClass('switchBorderBlue');
        }
      } else {
        setTimeout(function () {
          if ($('.km-switch').hasClass('km-switch-off')) {
            $('.km-switch-handle').removeClass('changeSwitchOn').addClass('changeSwitchOff');
            $('.km-switch-container').removeClass('switchBorderBlue').addClass('switchBorderGrey');
          } else {
            $('.km-switch-handle').removeClass('changeSwitchOff').addClass('changeSwitchOn');
            $('.km-switch-container').removeClass('switchBorderGrey').addClass('switchBorderBlue');
          }
        }, 100);
      }
    },
    getImageBasePath: function () {
      var hostname = $(location).attr('hostname');
      if (hostname === 'localhost') {
        return 'modules/admin/inputformbuilder/builder';
      }
      else {
        return '../builder';
      }
    },
    //This function handle the placeholder for input and textarea
    inputPlaceholder: function () {
      $('input[type="text"], textarea').each(function () {
        var $this = $(this);
        if ($this.val() === '') {
          $this.val($this.attr('placeholder'));
        }
        $this.focus(function () {
          if ($this.val() === $this.attr('placeholder')) {
            $this.val('');
          }
        });
        $this.blur(function () {
          if ($this.val() === '') {
            $this.val($this.attr('placeholder'));
          }
        });
      });
    }
  };
  return jsInteraction;
}(IFB_NAMESPACE.JsInteraction || {}));
