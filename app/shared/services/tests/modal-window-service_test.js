(function () {
  'use strict';
  describe('modal window service', function () {
    // The variables that we need in each unit test.
    var rootScope, $document, httpBackend, env;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($rootScope, _$document_, $httpBackend, ENV) {
      rootScope = $rootScope;
      $document = _$document_;
      httpBackend = $httpBackend;
      env = ENV;
    }));

    beforeEach(function () {
      jasmine.addMatchers({
        toHaveModalsOpen: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              var modalDomEls = actual.find('div.k-window-content');
              var result = {};
              result.pass = modalDomEls.length === expected;
              return result;
            }
          };
        }
      });
    });

    it('should open and dismiss information modal pop up ', inject(function (modalWindowService) {
      var modalInstance;
      modalInstance = modalWindowService.popupInformation.open({title: 'Hi', message: 'Test'});
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);

      modalWindowService.popupInformation.close();
      expect($document).toHaveModalsOpen(0);
    }));

    it('should open and dismiss warning modal pop up ', inject(function (modalWindowService) {
      var modalInstance;
      modalInstance = modalWindowService.showWarningPopup('Hi', 'Test');
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);

      modalWindowService.closeWarningModalWindow();
      expect($document).toHaveModalsOpen(0);
    }));

    it('should open and dismiss error modal pop up ', inject(function (modalWindowService) {
      var modalInstance;
      modalInstance = modalWindowService.showErrorPopup('Hi', 'Test');
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);

      modalWindowService.closeErrorModalWindow();
      expect($document).toHaveModalsOpen(0);
    }));

    it('should open and dismiss duplicate modal pop up ', inject(function (modalWindowService) {
      var modalInstance;
      httpBackend.when('GET', '/api/v1/loanFolderDropdownData.json').respond('');
      httpBackend.when('GET', env.restURL + '/pipeline/loan/duplicatetemplate').respond('');
      modalInstance = modalWindowService.modalDuplicateLoan.open();
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);

      modalWindowService.modalDuplicateLoan.close();
      expect($document).toHaveModalsOpen(0);
    }));

    it('should open and dismiss customize column modal pop up ', inject(function (modalWindowService) {
      var modalInstance;
      //httpBackend.when('GET', '/api/v1/CustomizeColumnData.json').respond('');
      httpBackend.when('GET', env.restURL + '/pipeline/loan/getpipelinecolumns').respond({PipelineColumns: []});
      modalInstance = modalWindowService.modalCustomizeColumns.open();
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);
      //
      modalWindowService.modalCustomizeColumns.close(true);
      expect($document).toHaveModalsOpen(0);
    }));

    it('should open and dismiss duplicate view popup', inject(function (modalWindowService) {
      var modalInstance;
      modalInstance = modalWindowService.showDuplicateViewPopup('Hi', 'Duplicate View');
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);
      modalWindowService.closeDuplicateWindow();
      expect($document).toHaveModalsOpen(0);
    }));

    it('should open and dismiss manage view popup', inject(function (modalWindowService) {
      var modalInstance;
      modalInstance = modalWindowService.showManageView('Hi', 'Manage View');
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);
      modalWindowService.closeManageView();
      expect($document).toHaveModalsOpen(0);
    }));

    describe('Test Help target for move loan folder popup', function () {

      beforeEach(inject(function (encompass) {
        encompass.setHelpTargetName =
          jasmine.createSpy('encompass.setHelpTargetName').and.callFake(
            function (jsonParams, callBack) {
              return 'test';
            }
          );
      }));
      it('should open and dismiss move loan to folder pop up', inject(function (modalWindowService) {
        var modalInstance;
        modalInstance = modalWindowService.showMoveToFolderPopup();
        rootScope.$digest();
        expect($document).toHaveModalsOpen(1);
        modalWindowService.closeMoveToFolderWindow();
        expect($document).toHaveModalsOpen(0);
      }));

      it('should check if setHelpTargetName method is called with parameter value as MoveDialog ' +
        'when move loan to folder pop up is opened',
        inject(function (modalWindowService, encompass) {
          var modalInstance;
          modalInstance = modalWindowService.showMoveToFolderPopup();
          rootScope.$digest();
          expect($document).toHaveModalsOpen(1);
          expect(encompass.setHelpTargetName).toHaveBeenCalledWith('{HelpTargetName: "MoveDialog"}', '');
          modalWindowService.closeMoveToFolderWindow();
          expect($document).toHaveModalsOpen(0);
        }));

      it('should check if setHelpTargetName method is called with parameter value as PipelinePage ' +
        'when move loan to folder pop up is closed',
        inject(function (modalWindowService, encompass) {
          var modalInstance;
          modalInstance = modalWindowService.showMoveToFolderPopup();
          rootScope.$digest();
          expect($document).toHaveModalsOpen(1);
          modalWindowService.closeMoveToFolderWindow();
          expect($document).toHaveModalsOpen(0);
          expect(encompass.setHelpTargetName).toHaveBeenCalledWith('{HelpTargetName: "PipelinePage"}', '');
        }));
    });
  });
})();
