(function () {
  'use strict';
  describe('Test pipeline manage view controller ', function () {
    var ctrl, scope, setDefaultViewData, env, pipelineViewListData, pipelineDataStore, modalService;
    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($compile, $rootScope, $controller, $httpBackend, SetDefaultViewData, ENV,
                                PipelineViewListData, PipelineDataStore, modalWindowService) {
      scope = $rootScope.$new();
      setDefaultViewData = SetDefaultViewData;
      pipelineViewListData = PipelineViewListData;
      pipelineDataStore = PipelineDataStore;
      modalService = modalWindowService;
      spyOn(SetDefaultViewData, 'resolvePromise').and.callThrough();
      env = ENV;
      spyOn(modalWindowService, 'closeManageView');
      spyOn(modalWindowService, 'showRenameViewPopup');
      spyOn(modalWindowService, 'showDuplicateViewPopup');
      $httpBackend = $httpBackend;
      var response = [{
        'ViewName': 'Default View',
        'PersonaName': 'Loan Officer',
        'IsDefault': true,
        'Type': 'System'
      }];
      $httpBackend.when('GET', env.restURL + '/pipeline/view/getlistofviews').respond(response);
      ctrl = $controller('PipelineManageViewController', {
        $scope: scope,
        SetDefaultViewData: SetDefaultViewData
      });

      // $compile(element)($rootScope);
    }));

    it('Default Buttons status should be disabled ', function () {
      expect(ctrl.isDuplicateDisabled).toBe(true);
      expect(ctrl.isDeleteDisabled).toBe(true);
      expect(ctrl.isRenameDisabled).toBe(true);
      expect(ctrl.isSetAsdefaultDisabled).toBe(true);
    });

    it('Should close manage view', function () {
      ctrl.closePopUp();
      expect(modalService.closeManageView).toHaveBeenCalled();
    });

    it('Should open delete dialog', inject(function (PipelineConst, $q) {
      var popupPromise;
      var popupDeferred = $q.defer();
      popupPromise = {result: popupDeferred.promise};
      popupDeferred.resolve(true);
      spyOn(modalService, 'showConfirmationPopup').and.callFake(function () {
        return popupPromise;
      });
      ctrl.openDeleteDialog();
      scope.$apply();
      expect(modalService.showConfirmationPopup).toHaveBeenCalledWith(PipelineConst.ConfirmationMessage,
        PipelineConst.PopupTitle, PipelineConst.WarningIcon);
    }));

    it('Should open delete dialog with resolve promise false', inject(function (PipelineConst, PipelineViewListData,
                                                                                $q, DeletePipelineView, PipelineDataStore) {
      var popupPromise, popupPromiseTrue;
      pipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = [{
        'ViewName': 'Default View',
        'PersonaName': 'Loan Officer',
        'IsDefault': true,
        'Type': 'System'
      }];
      var popupDeferred = $q.defer();
      popupPromise = {result: popupDeferred.promise};
      popupDeferred.resolve(false);

      var popupDeferredTrue = $q.defer();
      popupPromiseTrue = popupDeferredTrue.promise;
      popupDeferredTrue.resolve(true);

      spyOn(DeletePipelineView, 'resolvePromise').and.callFake(function () {
        return popupPromiseTrue;
      });
      spyOn(PipelineViewListData, 'resolvePromise').and.callFake(function () {
        return popupPromiseTrue;
      });
      spyOn(modalService, 'showConfirmationPopup').and.callFake(function () {
        return popupPromise;
      });
      spyOn(PipelineDataStore.PipelineViewListDataStore.items, 'filter').and.callFake(function () {
        return popupPromiseTrue;
      });
      ctrl.openDeleteDialog();
      scope.$apply();
      expect(modalService.showConfirmationPopup).toHaveBeenCalledWith(PipelineConst.ConfirmationMessage,
        PipelineConst.PopupTitle, PipelineConst.WarningIcon);

      expect(DeletePipelineView.resolvePromise).toHaveBeenCalled();
      expect(PipelineViewListData.resolvePromise).toHaveBeenCalled();
      expect(PipelineDataStore.PipelineViewListDataStore.items.filter).toHaveBeenCalled();
    }));

    it('Rename view popup should have been called', function () {
      pipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = [{
        'ViewName': 'Default View',
        'PersonaName': 'Loan Officer',
        'IsDefault': true,
        'Type': 'System'
      }];
      ctrl.renameClick();
      expect(modalService.showRenameViewPopup).toHaveBeenCalled();
    });

    it('Duplicate view popup should have been called', function () {
      pipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = [{
        'ViewName': 'Default View',
        'PersonaName': 'Loan Officer',
        'IsDefault': true,
        'Type': 'System'
      }];
      ctrl.duplicateViewClick();
      expect(modalService.showDuplicateViewPopup).toHaveBeenCalled();
    });

    describe('Setting a default view ', function () {
      it(' SetDefaultViewData should have been called', inject(function (SetDefaultViewData) {
        pipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = [{
          'ViewName': 'Default View',
          'PersonaName': 'Loan Officer',
          'IsDefault': true,
          'Type': 'System'
        }];
        ctrl.setDefault();
        expect(SetDefaultViewData.resolvePromise).toHaveBeenCalled();
      }));
    });

    describe('Selection change from pipline manage view grid ', function () {
      it('if only single view is selected and it is not already set to default then button ' +
      'setAsDefault should be enable ', function () {
        var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': false, 'Type': 'System'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isSetAsdefaultDisabled).toBe(false);
        ctrl.gridSelectionChange([]);
        expect(ctrl.isDeleteDisabled).toBe(true);
        expect(ctrl.isRenameDisabled).toBe(true);
        expect(ctrl.isSetAsdefaultDisabled).toBe(true);
        expect(ctrl.isDuplicateDisabled).toBe(true);
      });
      it('if only single view is selected and it is already set to default then button setAsDefault should be disable ',
        function () {
          var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'System'}];
          ctrl.gridSelectionChange(data);
          expect(ctrl.isSetAsdefaultDisabled).toBe(true);
        });
      it('if only single view of custom type is selected and it is already set to default then button' +
      ' setAsDefault should be disable ', function () {
        var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'Custom'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isSetAsdefaultDisabled).toBe(true);
      });
      it('if multiple views are selected then button setAsDefault should be disable ', function () {
        var data = [{
          'ViewName': 'Default View',
          'PersonaName': 'Loan Officer',
          'IsDefault': true,
          'Type': 'System'
        }, {'ViewName': 'Default View 2', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'System'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isSetAsdefaultDisabled).toBe(true);
      });
      it('if single view of system type is selected then button rename should be disable ', function () {
        var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'System'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isRenameDisabled).toBe(true);
      });
      it('if single view of custom type and not a defaultView has been selected then button rename ' +
      'should not be disable ', function () {
        var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': false, 'Type': 'Custom'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isRenameDisabled).toBe(false);
      });
      it('if single view which is default & type of custom has been selected then button rename should not be disable',
        function () {
          var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'Custom'}];
          ctrl.gridSelectionChange(data);
          expect(ctrl.isRenameDisabled).toBe(false);
        });
      it('if multiple views are selected then button rename should be disable ', function () {
        var data = [{
          'ViewName': 'Default View',
          'PersonaName': 'Loan Officer',
          'IsDefault': true,
          'Type': 'Custom'
        }, {'ViewName': 'Default View 2', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'Custom'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isRenameDisabled).toBe(true);
      });
      it('if single view which is default and type of custom has been selected then button delete should be disable ',
        function () {
          var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'Custom'}];
          ctrl.gridSelectionChange(data);
          expect(ctrl.isDeleteDisabled).toBe(true);
        });
      it('if single view which is not default and type of custom has been selected then button delete should be enable',
        function () {
          var data = [{
            'ViewName': 'Default View',
            'PersonaName': 'Loan Officer',
            'IsDefault': false,
            'Type': 'Custom'
          }];
          ctrl.gridSelectionChange(data);
          expect(ctrl.isDeleteDisabled).toBe(false);
        });
      it('if single view which is default or type of custom has been selected then button delete should be disable',
        function () {
          var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'System'}];
          ctrl.gridSelectionChange(data);
          expect(ctrl.isDeleteDisabled).toBe(true);
        });
      it('if single view which is not default & type of custom has been selected then button delete should be disable',
        function () {
          var data = [{'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'System'}];
          ctrl.gridSelectionChange(data);
          expect(ctrl.isDeleteDisabled).toBe(true);
        });
      it('if multiple views have been selected excluding view of type system and no default view then button' +
      ' delete should be enable', function () {
        var data = [{
          'ViewName': 'Default View',
          'PersonaName': 'Loan Officer',
          'IsDefault': false,
          'Type': 'custom'
        }, {'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': false, 'Type': 'custom'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isDeleteDisabled).toBe(false);
      });
      it('if multiple views have been selected excluding view of type system and one is default view then button' +
      ' delete should be disable', function () {
        var data = [{
          'ViewName': 'Default View',
          'PersonaName': 'Loan Officer',
          'IsDefault': false,
          'Type': 'custom'
        }, {'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'custom'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isDeleteDisabled).toBe(true);
      });
      it('if multiple views have been selected including view of type system or one is default view then button ' +
      'delete should be disable', function () {
        var data = [{
          'ViewName': 'Default View',
          'PersonaName': 'Loan Officer',
          'IsDefault': false,
          'Type': 'System'
        }, {'ViewName': 'Default View', 'PersonaName': 'Loan Officer', 'IsDefault': true, 'Type': 'custom'}];
        ctrl.gridSelectionChange(data);
        expect(ctrl.isDeleteDisabled).toBe(true);
      });
    });
  });
})();
