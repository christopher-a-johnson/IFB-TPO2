(function () {
  'use strict';
  angular.module('elli.encompass.web.fieldsearch').directive('fieldSearchSplitter', fieldSearchSplitter);
  /* @ngInject */
  function fieldSearchSplitter(FSCONSTANTS) {
    return {
      link: function (scope) {
        scope.$on(FSCONSTANTS.SPLITTEREVENT, function () {
          var rightUpperSection = angular.element('.analysisrightupper-kendo')[0];
          if (rightUpperSection && rightUpperSection.offsetHeight > 0) {
            angular.element('#upperGrid1').css('height', rightUpperSection.offsetHeight - 24);
          }

          var upperGrid = angular.element('#upperGrid1')[0];
          if (upperGrid && upperGrid.offsetHeight > 0) {
            angular.element('.fs-search-history').css('height', upperGrid.offsetHeight - 191);

            var upperGridHeader = angular.element('#upperGrid1 div.k-grid-header')[0];
            if (upperGridHeader && upperGridHeader.offsetHeight > 0) {
              angular.element('#upperGrid1 div.k-grid-content')
                .css('height', upperGrid.offsetHeight - upperGridHeader.offsetHeight);
            }
          }

          var searchHistoryGrid = angular.element('.fs-search-history')[0];
          if (searchHistoryGrid && searchHistoryGrid.offsetHeight > 0) {
            angular.element('#searchHistoryGrid1 div.k-grid-content').css('height', searchHistoryGrid.offsetHeight - 2);
          }

          var lowerSection = angular.element('.fs-detail-results-section')[0];
          if (lowerSection && lowerSection.offsetHeight > 0) {
            angular.element('.analysislowerleft').css('height', lowerSection.offsetHeight - 28);
            angular.element('.analysislowerleft-inline').css('height', lowerSection.offsetHeight - 40);
            angular.element('.analysislowerright-kendo').css('height', lowerSection.offsetHeight - 26);

            var lowerRightTabStripHeader = angular.element('.ngen-lower-right-tab-strip')[0];
            if (lowerRightTabStripHeader && lowerRightTabStripHeader.offsetHeight > 0) {
              angular.element('.ngen-fs-tabstrip-grid')
                .css('height', lowerSection.offsetHeight - lowerRightTabStripHeader.offsetHeight - 30);
              angular.element('#fs-lower-right-grid')
                .css('height', lowerSection.offsetHeight - lowerRightTabStripHeader.offsetHeight - 40);
              angular.element('#fs-lower-right-grid div.k-grid-content')
                .css('height', lowerSection.offsetHeight - lowerRightTabStripHeader.offsetHeight - 59);
            }
          }
        });
      }
    };
  }
})();
