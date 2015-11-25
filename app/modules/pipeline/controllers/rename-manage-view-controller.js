(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('RenameManageViewController', RenameManageViewController);

  function RenameManageViewController(customMessage, modalWindowService, PipelineConst, PipelineDataStore,
                                      RenameViewData, _, $timeout) {
    var vm = this;
    vm.renameValue = customMessage;

    vm.okClick = function () {
      if (vm.renameValue === '') {
        modalWindowService.popupInformation.open({message: PipelineConst.RenameRequiredMessage, title: PipelineConst.PopupTitle});
      } else if (vm.renameValue !== '' && vm.renameValue.length > 260) {
        modalWindowService.popupInformation.open({message: PipelineConst.RenameMaxLengthMessage, title: PipelineConst.PopupTitle});
      } else {
        var views = PipelineDataStore.PipelineViewListDataStore.items;
        if (customMessage !== vm.renameValue) {
          if (views.filter(function (e) {
              return angular.lowercase(e.ViewName) === angular.lowercase(vm.renameValue);
            }).length > 0) {
            modalWindowService.popupInformation.open({
              message: 'A view with the name "' + vm.renameValue + '" already exists. ' +
              'You must provide a unique name for this view',
              title: 'View Name Error'
            });
          }
          else {
            var renameViewPayload = {'Name': customMessage, 'Modified': vm.renameValue};
            RenameViewData.resolvePromise(renameViewPayload);
            vm.closePopUp();
          }
        } else {
          vm.closePopUp();
        }
      }
    };

    vm.closePopUp = function () {
      modalWindowService.closeRenameWindow();
    };

    /* This keydown handler for inputBox of rename pipeline view */
    vm.eventHandler = function (e) {
      /* for ESC & enter  button */
      if (e.keyCode === 27) {
        vm.closePopUp();
      } else if (e.keyCode === 13) {
        $timeout(function () {
          vm.okClick();
        }, 0);
      }
    };
  }
}());
