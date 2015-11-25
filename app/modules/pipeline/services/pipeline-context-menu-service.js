(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineContextMenu', function (Restangular, $q) {
      var service = {loanData: {}};
      service.resolvePromise = function pipelineGetLoanPromise(loanGuid) {
        var defer = $q.defer();
        var payload = {LoanGUID: loanGuid};

        if (!service.loanData[loanGuid]) {
          return Restangular.all('pipeline/loan/getcontextmenu').post(payload).then(function (response) {
            service.loanData[loanGuid] = Restangular.stripRestangular(response);
          });
        } else {
          /* resolving with service.loanData[loanGuid] is right think to do technically, but we use global data store anyways */
          defer.resolve();
          return defer.promise;
        }
      };
      return service;
    }
  );
})();
