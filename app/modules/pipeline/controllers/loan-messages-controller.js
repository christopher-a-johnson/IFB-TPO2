(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('LoanMessagesController', LoanMessagesController);
  function LoanMessagesController(PipelineDataStore, selectedLoanGUID, LoanMessagesService, modalWindowService) {
    var vm = this;
    vm.loanGuid = selectedLoanGUID;
    vm.loanMessagesData = PipelineDataStore.LoanMessagesData;
    vm.closePopup = closePopup;
    vm.loanMessagesGridOptions = {
      dataSource: vm.loanMessagesData.items,
      scrollable: true,
      columns: [
        {
          field: 'Description',
          title: 'Message'
        },
        {
          field: 'Source',
          title: 'Source'
        },
        {
          field: 'Timestamp',
          type: 'Date',
          title: 'Date',
          format: '{0:M/d/yyyy hh:mm tt}'
        }
      ],
      height: 280
    };
    function closePopup() {
      modalWindowService.closeLoanMessagesPopup();
    }
    /* Initialization code */
    function initialize() {
      var payload = {
        'LoanGuid': vm.loanGuid,
        'IsExternalOrganization': PipelineDataStore.CompanyViewDropdownData.selectedItem !== 'Internal'
      };
      LoanMessagesService.resolvePromise(payload);
    }

    initialize();
  }
}
());
