(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline')
    .controller('DuplicateManageViewController', DuplicateManageViewController);

  function DuplicateManageViewController(modalWindowService, PipelineConst, PipelineViewListData,
                                         DuplicateViewService, currentViewName, PipelineDataStore) {
    var vm = this;
    vm.renameValue = '';
    vm.okClick = okClick;
    function okClick() {
      if (vm.renameValue === '' || (vm.renameValue.indexOf('\\') !== -1)) {
        modalWindowService.popupInformation.open({
          message: PipelineConst.DuplicateViewNameRequiredMessage,
          title: 'Provide View Name'
        });
      } else if (vm.renameValue !== '' && vm.renameValue.length <= 260) {
        var views = PipelineDataStore.PipelineViewListDataStore.items;

        if (views.filter(function (e) {
            return e.ViewName === vm.renameValue;
          }).length > 0) {
          /* items contains the element we're looking for */
          modalWindowService.popupInformation.open({
            message: 'A view with the name "' + vm.renameValue +
            '" already exists. You must provide a unique name for this view',
            title: 'View Name Error'
          });
        }
        else {
          //Todo duplicate Data here
          if (PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid !== null) {
            var personaName = PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0].PersonaName;
            if (personaName === null) {
              personaName = '';
            }
            var duplicateViewObj = {
              'NewViewName': vm.renameValue,
              'PersonaName': personaName,
              'ViewName': currentViewName
            };
            DuplicateViewService.resolvePromise(duplicateViewObj);
            vm.closePopUp();
          }
        }
      }
    }

    vm.closePopUp = closePopUp;
    function closePopUp() {
      PipelineViewListData.resolvePromise();
      modalWindowService.closeDuplicateWindow();
    }

    /* This keydown handler for inputBox of rename pipeline view */
    vm.eventHandler = function (e) {
      /* This for ESC button  */
      if (e.keyCode === 27) {
        vm.closePopUp();
      } else if (e.keyCode === 13 && vm.renameValue !== '' && vm.renameValue.length <= 260) {
        vm.okClick();
      }
    };
  }
}());
