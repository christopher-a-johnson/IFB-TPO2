(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('PipelineViewController', PipelineViewController);

  /* @ngInject */
  function PipelineViewController(applicationLoggingService, encompass, PipelineConst, PipelineGetView, PipelineDataStore,
                                  modalWindowService, PipelineLoanMailCount, $timeout, $rootScope, $templateCache, PipelineEventsConst,
                                  PipelineGetLoans, SetMenuStateService, SetPipelineViewXmlService) {
    var windowInstance, vm = this;

    vm.pipelineViewButtonsData = PipelineDataStore;
    vm.pipelineViewDropdownData = PipelineDataStore.PipelineViewListDataStore;

    /* Loan mail box count service */
    vm.pipelineLoanMailCount = PipelineDataStore.PipelineLoanMailStore;

    /* Pipeline View dropdown databound event handler */
    vm.setPipelineViewName = function (e) {
      SetPipelineViewXmlService.setPipelineViewXml();
      e.sender.focus();
    };

    /**
     * @ngdoc method
     * @name loadView
     * @methodOf elli.encompass.web.pipeline.PipelineViewController
     * @description
     * Loads the selected view in the View Dropdown (Calls GetViewAPI for the selected view)
     */
    function loadView() {
      PipelineDataStore.AdvanceFilterShow = false;
      var objToPost = {
        ViewName: vm.pipelineViewDropdownData.selectedItem.ViewName,
        PersonaName: vm.pipelineViewDropdownData.selectedItem.PersonaName || ''
      };
      $rootScope.$broadcast(PipelineEventsConst.RESET_VIEW_EVENT);
      PipelineGetView.resolvePromise(JSON.stringify(objToPost)).then(function () {
        $rootScope.$broadcast(PipelineEventsConst.SET_VIEW_EVENT);
        PipelineGetLoans.resolvePromise();
      });
    }

    /* Pipeline View dropdown change event handler */
    vm.setPipelineViewNameOnChange = function (e) {
      try {
        if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
          PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION: 'VIEW CHANGED'};
        }
        vm.setPipelineViewName(e);
        loadView();
      }
      catch (ex) {
        applicationLoggingService.error('Pipelie View change failed: ' + ex.message);
      }
    };

    vm.pipelineViewDropdownOptions = {
      dataSource: vm.pipelineViewDropdownData.items,
      dataTextField: 'Name',
      dataValueField: 'Name',
      dataBound: vm.setPipelineViewName,
      change: vm.setPipelineViewNameOnChange,
      template: $templateCache.get('modules/pipeline/views/pipeline-view-dropdown-template.html')
    };

    /* Save Button */
    vm.saveButtonClicked = function () {
      if (vm.pipelineViewButtonsData.saveButtonDisabled) {
        return;
      }
      modalWindowService.showSavePipelineViewPopup(PipelineConst.SaveView);
    };

    /* Reset Button */
    vm.resetButtonClicked = function () {
      SetPipelineViewXmlService.setPipelineViewXml();
      //TODO : Need to optimize icon value for generic confirmation popup
      //vm.pipelineViewButtonsData.infoIconDisabled = true;
      windowInstance = modalWindowService.showConfirmationPopup(PipelineConst.ResetConfirmationMessage,
        PipelineConst.ResetTitle);
      windowInstance.result.then(function (result) {
        if (!result) {
          if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
            PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION: 'RESET VIEW'};
          }
          $timeout(function () {
            loadView();
          }, 0, false);
          setSaveResetButtonStatus(true); //disable the buttons/mainmenu
        }
      });
    };
    /* Manage View Button */
    vm.manageViewButtonDisable = false;
    vm.manageViewButtonClicked = function () {
      if (vm.manageViewButtonDisable) {
        return;
      }
      modalWindowService.showManageView();
    };

    /* Loan Mailbox Button */
    vm.openLoanMailBox = function ($event) {
      /*When button is clicked using mouse $event is undefined and when by enter key $event.keyCode is 13.*/
      if (typeof $event === 'undefined') {
        $timeout(function () {
          encompass.openLoanMailbox('', mailBoxCallback);
        }, 0, false);
      }
      else if ($event.keyCode === 13) {
        $timeout(function () {
          encompass.openLoanMailbox('', mailBoxCallback);
        }, 0, false);
      }
    };

    function mailBoxCallback(resp) {
      var param = JSON.parse(resp);
      if ((typeof param.errorCode !== 'undefined') && param.errorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.LoanMailBoxCallBackLog + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
      PipelineLoanMailCount.resolvePromise();
    }

    /**
     * @ngdoc method
     * @name setSaveResetButtonStatus
     * @methodOf elli.encompass.web.pipeline.PipelineViewController
     * @description
     * Enables or disables the save/reset buttons+main menus based on the input
     * @param {boolean} isDisabled
     */
    function setSaveResetButtonStatus(isDisabled) {
      PipelineDataStore.saveButtonDisabled = isDisabled;
      PipelineDataStore.resetButtonDisabled = isDisabled;
      var menuStates = [{
        MenuItemTag: 'PI_SaveView',
        Enabled: !PipelineDataStore.saveButtonDisabled,
        Visible: true
      }, {
        MenuItemTag: 'PI_ResetView',
        Enabled: !PipelineDataStore.resetButtonDisabled,
        Visible: true
      }];
      SetMenuStateService.setThickClientMenuState(menuStates);
    }

    /* Initialization code */
    function initialize() {
      PipelineLoanMailCount.resolvePromise();

      /*Event listener */
      $rootScope.$on(PipelineEventsConst.LOAD_VIEW_EVENT, function (event) {
        loadView();
        event.defaultPrevented = true;
      });
      $rootScope.$on(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT, function (event) {
        setSaveResetButtonStatus(false);
        event.defaultPrevented = true;
      });
      $rootScope.$on(PipelineEventsConst.MANAGE_VIEW_EVENT, function (event, data) {
        vm.manageViewButtonClicked();
        event.defaultPrevented = true;
      });
      $rootScope.$on(PipelineEventsConst.RESET_VIEW_MENU_EVENT, function (event, data) {
        vm.resetButtonClicked();
        event.defaultPrevented = true;
      });
      $rootScope.$on(PipelineEventsConst.SAVE_VIEW, function (event) {
        vm.saveButtonClicked();
        event.defaultPrevented = true;
      });
      /*End Event Listener */
    }

    initialize();
  }
}());
