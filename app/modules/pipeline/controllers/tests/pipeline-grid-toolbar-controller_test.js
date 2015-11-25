(function () {
  'use strict';
  describe('Test PipelineGridToolBarController ', function () {
    var element, ctrl, scope, httpBackend, setMenuStateService, pipelineDataStore;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($compile, $rootScope, $controller, $httpBackend, SetMenuStateService, PipelineDataStore) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      setMenuStateService = SetMenuStateService;
      pipelineDataStore = PipelineDataStore;
      spyOn(setMenuStateService, 'setThickClientMenuState');
      var response = [{}];
      httpBackend.when('GET', '/api/v1/personaData.json').respond(response);
      ctrl = $controller('PipelineGridToolbarController', {$scope: scope});
      $compile(element)($rootScope);
    }));

    it('Should call SetMenuStateService on initialize to Disable New loan, Delete Loan, Export Selected, Export All, Print and Transfer' +
      'menu items in Main menu', inject(function ($controller) {
      pipelineDataStore.PersonaAccess.LoanMgmt = {LoanMgmt_Transfer: true};
      pipelineDataStore.PersonaAccess.LoansTab = {};
      ctrl = $controller('PipelineGridToolbarController', {$scope: scope});
      expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
        {MenuItemTag: 'PI_New', Enabled: false, Visible: !ctrl.isDisableNewLoan},
        {MenuItemTag: 'PI_Delete', Enabled: false, Visible: ctrl.pipelineViewDataStore.deleteLoanAccess},
        {
          MenuItemTag: 'PI_ExportSelected', Enabled: false, Visible: ctrl.pipelineViewDataStore.PersonaAccess.LoanMgmt.
          LoanMgmt_ExportToExcel
        },
        {
          MenuItemTag: 'PI_ExportAll', Enabled: false, Visible: ctrl.pipelineViewDataStore.PersonaAccess.LoanMgmt.
          LoanMgmt_ExportToExcel
        },
        {MenuItemTag: 'PI_Print', Enabled: false, Visible: ctrl.pipelineViewDataStore.PrintLoanAccess},
        {
          MenuItemTag: 'PI_Transfer', Enabled: false, Visible: ctrl.pipelineViewDataStore.PersonaAccess.LoanMgmt.
          LoanMgmt_Transfer
        }
      ]);
    }));

    //it('Persona Access rights default falsy', function () {
    //  expect(ctrl.personaAccessService.accessMode).toBeFalsy();
    //});

    it('Should set the printButtonDisabled value to true', inject(function (PipelineDataStore) {
      expect(PipelineDataStore.printButtonDisabled).toBeTruthy();
    }));

    it('Should verify refresh button clicked', inject(function (PipelineEventsConst) {
      spyOn(scope, '$broadcast');
      ctrl.refreshPipelineClicked();
      expect(scope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.REFRESH_GRID_EVENT);
    }));

    it('Should be defined click event of duplicate button', inject(function (PipelineEventsConst) {
      scope.$broadcast(PipelineEventsConst.LOAN_DUPLICATE_EVENT);
      expect(ctrl.duplicateButtonClicked).toBeDefined();
    }));

    it('Should open loan pop up on click of enabled icon',
      inject(function (encompass, PipelineEventsConst, $timeout, SetPipelineViewXmlService) {
        spyOn(encompass, 'createNewLoan');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        pipelineDataStore.LoanFolderDropdownData = {selectedItem: 'Test'};
        ctrl.isDisableNewLoan = false;
        ctrl.openNewLoanPopUp();
        $timeout.flush();
        expect(encompass.createNewLoan).toHaveBeenCalled();
        scope.$broadcast(PipelineEventsConst.LOAN_NEW_EVENT);
        $timeout.flush();
        expect(encompass.createNewLoan).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));

    it('Should open transfer loan pop up on click of button', inject(function (encompass, PipelineEventsConst, SetPipelineViewXmlService,
                                                                               $timeout) {
      spyOn(encompass, 'transferLoans');
      spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
      ctrl.openTransferLoanPopUp();
      $timeout.flush();
      expect(encompass.transferLoans).toHaveBeenCalled();
      scope.$broadcast(PipelineEventsConst.LOAN_TRANSFER_EVENT);
      $timeout.flush();
      expect(encompass.transferLoans).toHaveBeenCalled();
      expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
    }));
    it('Should open edit loan pop on click of edit loan button', inject(function (encompass, PipelineConst, $q,
                                                                                  LoanFolderDropdownData, $timeout,
                                                                                  modalWindowService,
                                                                                  PipelineEventsConst,
                                                                                  SetPipelineViewXmlService) {
      var popupPromise;
      var popupDeferred = $q.defer();
      popupPromise = {result: popupDeferred.promise};
      popupDeferred.resolve(true);
      spyOn(encompass, 'openLoan');
      spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
      spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function () {
        return popupPromise;
      });
      LoanFolderDropdownData.selectedItemTitle = PipelineConst.Trash;
      ctrl.editLoanClicked();
      scope.$apply();
      $timeout.flush();
      expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
      expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      LoanFolderDropdownData.selectedItemTitle = PipelineConst.ArchiveFolder;
      ctrl.editLoanClicked();
      $timeout.flush();
      expect(encompass.openLoan).toHaveBeenCalled();
      scope.$broadcast(PipelineEventsConst.LOAN_EDIT_EVENT);
      $timeout.flush();
      expect(encompass.openLoan).toHaveBeenCalled();
    }));

    it('Should call import loan of encompass on trigger', inject(function (PipelineEventsConst, encompass,
                                                                           SetPipelineViewXmlService, $timeout) {
      spyOn(encompass, 'importLoans');
      spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
      scope.$broadcast(PipelineEventsConst.LOAN_IMPORT_EVENT);
      $timeout.flush();
      expect(encompass.importLoans).toHaveBeenCalled();
      expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
    }));

    it('Should call popup on Export to Excel -> Selected Loans only click',
      inject(function (encompass, $timeout, SetPipelineViewXmlService) {
        spyOn(encompass, 'exportToExcel');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml').and.callFake(function () {
        });
        ctrl.exportToExcel(false);
        $timeout.flush();
        expect(encompass.exportToExcel).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));

    it('Should call encompass interaction function on print button click',
      inject(function (encompass, $timeout, SetPipelineViewXmlService) {
        spyOn(encompass, 'printForms');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        ctrl.openPrintDialog();
        $timeout.flush();
        expect(encompass.printForms).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));

    it('Should check the title for popup when deleteLoanButtonClicked is clicked and selected loan folder is Trash ',
      inject(function (PipelineDataStore, PipelineConst, modalWindowService, PipelineEventsConst, SetPipelineViewXmlService) {
        PipelineDataStore.LoanFolderDropdownData.selectedItem = PipelineConst.TrashFolder;
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        spyOn(modalWindowService, 'showDeleteLoanPopup');
        ctrl.deleteLoanButtonClicked();
        expect(modalWindowService.showDeleteLoanPopup).toHaveBeenCalledWith('Permanently Delete Loan');
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        PipelineDataStore.LoanFolderDropdownData.selectedItem = PipelineConst.ArchiveFolder;
        ctrl.deleteLoanButtonClicked();
        expect(modalWindowService.showDeleteLoanPopup).toHaveBeenCalledWith('Delete Loan');
        scope.$broadcast(PipelineEventsConst.LOAN_DELETE_EVENT);
        expect(modalWindowService.showDeleteLoanPopup).toHaveBeenCalledWith('Delete Loan');
      }));

    describe('Test showMoveConfirmation method when selected loans count is 1', function () {
      var deferred;
      beforeEach(inject(function ($q, PipelineGetView, modalWindowService, $controller, PipelineDataStore, SetPipelineViewXmlService) {
        PipelineDataStore.PipelineGridData.selected = [{
          Loan$BorrowerName: 'Andy', Fields$364: '789',
          Loan$Guid: '1234'
        }];
        ctrl = $controller('PipelineGridToolbarController', {$scope: scope});
        deferred = $q.defer();

        var returnData = {result: deferred.promise};
        spyOn(modalWindowService, 'showConfirmationPopup').and.returnValue(returnData);
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        spyOn(PipelineGetView, 'resolvePromise').and.callFake(function () {
        });
      }));

      it('Should check if showConfirmationPopup is called with single loan message on showMoveConfirmation',
        inject(function (modalWindowService, SetPipelineViewXmlService) {
          deferred.resolve(false);
          ctrl.showMoveConfirmation();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalledWith(ctrl.messageText,
            'Move Loan Confirmation');
        }));

      it('Should check if PipelineDataStore.moveToFolderApplyCheckDisabled is set to true when show confirmation ' +
        'popup window returns false',
        inject(function (PipelineDataStore, SetPipelineViewXmlService) {
          PipelineDataStore.moveToFolderApplyCheckDisabled = false;
          deferred.resolve(false);
          ctrl.showMoveConfirmation();
          scope.$apply();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
          expect(PipelineDataStore.moveToFolderApplyCheckDisabled).toBe(true);
        }));

      xit('Should check if resolvePromise of PipelineGetView  is called when show confirmation ' +
        'popup window returns false',
        inject(function (PipelineGetView) {
          deferred.resolve(false);
          ctrl.showMoveConfirmation();
          scope.$apply();

          expect(PipelineGetView.resolvePromise).toHaveBeenCalled();
        }));
    });

    describe('Test Move and Restore To Folder functionality single loan is selected', function () {

      beforeEach(inject(function ($controller, PipelineDataStore, DeletePipelineLoan) {
        PipelineDataStore.PipelineGridData.selected =
          [{
            Loan$BorrowerName: 'Andy', Fields$364: '789', Loan$Guid: '1234'
          }];
        ctrl = $controller('PipelineGridToolbarController', {$scope: scope});
      }));

      it('Should open move to folder popup',
        inject(function (PipelineDataStore, modalWindowService, SetPipelineViewXmlService) {
          spyOn(modalWindowService, 'showMoveToFolderPopup');
          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          PipelineDataStore.MoveLoanFolderList.items = ['NewLoans', 'ApprovedLoans', 'PendingLoans'];
          ctrl.moveToFolderClicked();
          expect(PipelineDataStore.MoveLoanFolderList.items.length >= 1).toBeTruthy();
          expect(modalWindowService.showMoveToFolderPopup).toHaveBeenCalledWith('Move Loans');
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));

      it('Should open restore to folder popup',
        inject(function (PipelineDataStore, modalWindowService, SetPipelineViewXmlService) {
          spyOn(modalWindowService, 'showMoveToFolderPopup');
          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          PipelineDataStore.MoveLoanFolderList.items = ['NewLoans', 'ApprovedLoans', 'PendingLoans'];
          ctrl.restoreToFolderClicked();
          expect(PipelineDataStore.MoveLoanFolderList.items.length >= 1).toBeTruthy();
          expect(modalWindowService.showMoveToFolderPopup).toHaveBeenCalledWith('Restore Loans');
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));

      it('Should display warning popup when move to folder is clicked and folder list is empty',
        inject(function (PipelineDataStore, modalWindowService, PipelineConst, SetPipelineViewXmlService) {
          spyOn(modalWindowService, 'showWarningPopup');
          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          PipelineDataStore.MoveLoanFolderList.items = [];
          ctrl.moveToFolderClicked();
          expect(PipelineDataStore.MoveLoanFolderList.items.length).toBe(0);
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
          expect(modalWindowService.showWarningPopup).
            toHaveBeenCalledWith(PipelineConst.MoveLoanAccessError, PipelineConst.PopupTitle, 'Warningicon');
        })
      );

      it('Should give the correct message when moving only one loan',
        inject(function (PipelineDataStore, SetPipelineViewXmlService) {
          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          expect(PipelineDataStore.PipelineGridData.selected.length).toBe(1);
          ctrl.showMoveConfirmation();
          expect(PipelineDataStore.applyCheckClicked).toBe(false);
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
          expect(PipelineDataStore.moveToFolderApplyCheckDisabled).toBe(true);
          expect(ctrl.messageText).toBe('Are you sure you want to move Andy (#789)?');
        }));

      it('Should Move Loan To Folder with External Orgs Info',
        inject(function (PipelineDataStore, $q, modalWindowService, MovePipelineLoan, PipelineGetLoans, SetPipelineViewXmlService) {
          PipelineDataStore.CompanyViewDropdownData.selectedItem = 'Internal';
          PipelineDataStore.moveToFolderApplyCheckDisabled = false;
          var popupDeferred = $q.defer();
          var popupPromise = {result: popupDeferred.promise};
          popupDeferred.resolve(false);
          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function () {
            return popupPromise;
          });
          spyOn(MovePipelineLoan, 'resolvePromise').and.callFake(function () {
            return popupPromise;
          });
          spyOn(PipelineGetLoans, 'resolvePromise').and.callFake(function () {
            return popupPromise;
          });
          ctrl.showMoveConfirmation();
          scope.$apply();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
          expect(PipelineDataStore.moveToFolderApplyCheckDisabled).toBe(true);
          expect(PipelineDataStore.CompanyViewDropdownData.selectedItem).toBe('Internal');
          expect(MovePipelineLoan.resolvePromise).toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        })
      );

      it('Should display ConfirmationPopup and Clicked Yes - API Call',
        inject(function (modalWindowService, $q, PipelineDataStore, MovePipelineLoan, SetPipelineViewXmlService) {

          PipelineDataStore.moveToFolderApplyCheckDisabled = false;
          var popupDeferred = $q.defer();
          var popupPromise = {result: popupDeferred.promise};
          popupDeferred.resolve(false); //Passing result as false
          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
            return popupPromise;
          });
          spyOn(MovePipelineLoan, 'resolvePromise').and.callFake(function (moveLoanFolderObj) {
            return popupPromise;
          });
          ctrl.showMoveConfirmation();
          scope.$apply();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
          expect(PipelineDataStore.moveToFolderApplyCheckDisabled).toBe(true);
          expect(PipelineDataStore.CompanyViewDropdownData.selectedItem).toBe(null);
          expect(MovePipelineLoan.resolvePromise).toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));

      it('Should display ConfirmationPopup and Clicked No - No API Call. ',
        inject(function (modalWindowService, $q, PipelineDataStore, MovePipelineLoan, SetPipelineViewXmlService) {

          var popupDeferred = $q.defer();
          var popupPromise = {result: popupDeferred.promise};
          popupDeferred.resolve(true); //Passing result as true

          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
            return popupPromise;
          });
          spyOn(MovePipelineLoan, 'resolvePromise').and.callFake(function (moveLoanFolderObj) {
            return popupPromise;
          });
          ctrl.showMoveConfirmation();
          scope.$apply();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
          expect(MovePipelineLoan.resolvePromise).not.toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));
    });

    describe('Test multipleConfirmationPopups Functionality', function () {

      beforeEach(inject(function ($controller, PipelineDataStore, PipelineConst) {
        PipelineDataStore.PipelineGridData.selected = [{
          Loan$BorrowerName: 'Andy', Fields$364: '789',
          Loan$Guid: '1234'
        }, {Loan$BorrowerName: 'Jim', Fields$364: '666', Loan$Guid: '5643'}];
        ctrl = $controller('PipelineGridToolbarController', {$scope: scope});
      }));

      it('Should give the correct message when moving multiple loans',
        inject(function (PipelineDataStore, SetPipelineViewXmlService) {
          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          expect(PipelineDataStore.PipelineGridData.selected.length).toBe(2);
          ctrl.showMoveConfirmation();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
          expect(PipelineDataStore.ConfirmModalApplyAllMessage).toBe('Are you sure you want to move all selected loans?');
        }));

      it('Should display ConfirmationPopup and Apply to all selected and clicked Yes - And API Call',
        inject(function (modalWindowService, $q, PipelineDataStore, MovePipelineLoan, SetPipelineViewXmlService) {

          var popupDeferred = $q.defer();
          var popupPromise = {result: popupDeferred.promise};
          popupDeferred.resolve(false); //Passing result as false

          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
            return popupPromise;
          });
          spyOn(MovePipelineLoan, 'resolvePromise').and.callFake(function (moveLoanFolderObj) {
            return popupPromise;
          });
          ctrl.showMoveConfirmation();
          PipelineDataStore.applyCheckClicked = true;
          scope.$apply();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
          expect(MovePipelineLoan.resolvePromise).toHaveBeenCalled();
        }));

      it('Should display confirmationPopup and Apply to all is not selected and Clicked Yes - And API call',
        inject(function (modalWindowService, $q, PipelineDataStore, MovePipelineLoan, SetPipelineViewXmlService) {

          var popupDeferred = $q.defer();
          var popupPromise = {result: popupDeferred.promise};
          popupDeferred.resolve(false); //Passing result as false

          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
            return popupPromise;
          });
          spyOn(MovePipelineLoan, 'resolvePromise').and.callFake(function (moveLoanFolderObj) {
            return popupPromise;
          });
          ctrl.showMoveConfirmation();
          PipelineDataStore.applyCheckClicked = false;
          scope.$apply();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
          expect(MovePipelineLoan.resolvePromise).toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));

      it('Should display confirmationPopup and Apply to all is not selected and Clicked No - No API call',
        inject(function (modalWindowService, $q, PipelineDataStore, MovePipelineLoan, SetPipelineViewXmlService) {

          var popupDeferred = $q.defer();
          var popupPromise = {result: popupDeferred.promise};
          popupDeferred.resolve(true); //Passing result as false

          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
            return popupPromise;
          });
          spyOn(MovePipelineLoan, 'resolvePromise').and.callFake(function (moveLoanFolderObj) {
            return popupPromise;
          });
          ctrl.showMoveConfirmation();
          PipelineDataStore.applyCheckClicked = false;
          scope.$apply();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
          expect(MovePipelineLoan.resolvePromise).not.toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));

      it('Should display confirmationPopup and Apply to all is selected and Clicked No - No API Call',
        inject(function (modalWindowService, $q, PipelineDataStore, MovePipelineLoan, SetPipelineViewXmlService) {
          var popupDeferred = $q.defer();
          var popupPromise = {result: popupDeferred.promise};
          popupDeferred.resolve(true); //Passing result as false

          spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
          spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
            return popupPromise;
          });
          spyOn(MovePipelineLoan, 'resolvePromise').and.callFake(function (moveLoanFolderObj) {
            return popupPromise;
          });
          ctrl.showMoveConfirmation();
          PipelineDataStore.applyCheckClicked = true;
          scope.$apply();
          expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
          expect(MovePipelineLoan.resolvePromise).not.toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));
    });
  });
})();
