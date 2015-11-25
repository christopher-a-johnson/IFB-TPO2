var kendo = window.kendo;
elli.builder.responsive = (function () {
  'use strict';

  var showBottomDrawer = false;
  var drawerTop = 0;
  var isDrawerExpanded;

  function resizeDrawer(bottomDrawer) {
    var footerHeight, stickFooterPush;
    if (bottomDrawer) {
      footerHeight = $('#bottomDrawer').outerHeight();
      stickFooterPush = $('.drawerPusher').height(footerHeight);
      $('#siteWrapper').css({'marginBottom': '-' + footerHeight + 'px'});
    }
  }

  function adjustBodyContentWidth() {
    var tabContentWidth = $('#siteTabs > .k-state-active').width();
    var sidebarWidth = $('#sidebarContainer').outerWidth(true);
    var contentWidth;
    if (tabContentWidth > 0 && sidebarWidth > 0) {
      contentWidth = tabContentWidth - sidebarWidth - 10;
    }
    else {
      contentWidth = '100%';
    }
    $('#content').width(contentWidth);
  }

  function adjustDrawerPosition(scrollPosition) {
    var adjustedTop = 0;

    if (showBottomDrawer) {
      if (isDrawerExpanded) {
        var bottomDrawerAdjust = $('#bottomDrawer').height() - parseInt($('#bottomDrawer').css('margin-bottom').replace('px'), '10') * -1;
        adjustedTop = (drawerTop - $('#bottomDrawer').height()) + bottomDrawerAdjust + scrollPosition;
      }
      else {
        adjustedTop = drawerTop + scrollPosition;
      }

      var wrapperAdjust = $('#siteWrapper').outerHeight() - parseInt($('#siteWrapper').css('margin-bottom').replace('px'), '10') * -1;

      if (adjustedTop <= wrapperAdjust) {
        $('#bottomDrawer').css('top', adjustedTop);
      }
    }
  }

  var res = {
    setDrawerTop: function (bottomDrawer) {
      if (bottomDrawer) {
        drawerTop = $('#bottomDrawer').position().top;      //Get position at page load
      }
    },
    onWindowResize: function (bottomDrawer) {
      resizeDrawer(bottomDrawer);
      adjustBodyContentWidth();
    },
    onWindowScroll: function () {
      var scrollPosition = $(window).scrollTop();
      adjustDrawerPosition(scrollPosition);
    },
    ///Added for unit testing Pusrpose to check the value of drawerTop after calling setDrawerTop
    drawerTopPosition: function () {
      return drawerTop;
    }

  };

  return {
    init: function () {
      res.setDrawerTop(showBottomDrawer);
      setTimeout(function () {
        res.onWindowResize(showBottomDrawer);
      }, 90);

      $(window).resize(res.onWindowResize(showBottomDrawer)).scroll(res.onWindowScroll);

      var navigationVisible = true;
      var navigationCollapse = kendo.fx($('#sidebarNaviation')).slideIn('right');
      var originalSidebarWidth = $('#sidebarContainer').width();
      var newSidebarWidth = 30;

      $('#sidebarNaviation').on('click', '#sidebarCollapse', function (e) {
        if (navigationVisible) {
          navigationCollapse.reverse();
          $('#sidebarCollapse').addClass('openBar').removeClass('closeBar');
          $('#sidebarContainer').width(newSidebarWidth).addClass('collapsed');
          adjustBodyContentWidth();
        } else {
          navigationCollapse.play();
          $('#sidebarCollapse').addClass('closeBar').removeClass('openBar');
          $('#sidebarContainer').width(originalSidebarWidth).removeClass('collapsed');
          adjustBodyContentWidth();
        }
        navigationVisible = !navigationVisible;
        e.preventDefault();
      });
    },
    //Added to get res obj for testing
    getObj: function () {
      return res;
    }
  };
}());

elli.builder.responsive.init();

