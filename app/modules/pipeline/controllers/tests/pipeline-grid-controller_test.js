(function () {
  'use strict';
  describe('Test Pipeline Controller: PipeLineCtrl', function () {
    var rootScope, scope, ctrl, httpBackend, elem, pipelineDataStore, setMenuStateService;

    beforeEach(module('elli.encompass.web'));
    beforeEach(module('kendo.directives'));

    beforeEach(inject(function ($rootScope, $controller, $httpBackend, PipelineDataStore, SetMenuStateService) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      pipelineDataStore = PipelineDataStore;
      setMenuStateService = SetMenuStateService;
      spyOn(setMenuStateService, 'setThickClientMenuState');
      httpBackend.when('GET', '/api/v1/gridData.json').respond({});
      ctrl = $controller('PipelineGridController', {$scope: scope});
    }));

    it('Should call open new loan from context menu for any other loan folder (Non Trash and Archive)',
      inject(function (PipelineEventsConst) {
        pipelineDataStore.LoanFolderDropdownData.selectedItem = 'Any Folder';
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_NEW_EVENT, function () {
        });
        ctrl.openNewLoan();
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_NEW_EVENT);
      }));

    /* not sure why new loan should not be called from Trash and Archive -- thick client allows this, why not thin ??
     it('Should not call open new loan from context menu for Trash',
     inject(function (PipelineEventsConst, PipelineConst) {
     pipelineDataStore.LoanFolderDropdownData.selectedItem = PipelineConst.TrashFolder;
     spyOn(rootScope, '$broadcast').and.callThrough();
     rootScope.$on(PipelineEventsConst.LOAN_NEW_EVENT, function () {
     });
     ctrl.openNewLoan();
     expect(rootScope.$broadcast).not.toHaveBeenCalledWith(PipelineEventsConst.LOAN_NEW_EVENT);
     }));

     it('Should not call open new loan from context menu for Archive',
     inject(function (PipelineEventsConst, PipelineConst) {
     pipelineDataStore.LoanFolderDropdownData.selectedItem = PipelineConst.ArchiveFolder;
     spyOn(rootScope, '$broadcast').and.callThrough();
     rootScope.$on(PipelineEventsConst.LOAN_NEW_EVENT, function () {
     });
     ctrl.openNewLoan();
     expect(rootScope.$broadcast).not.toHaveBeenCalledWith(PipelineEventsConst.LOAN_NEW_EVENT);
     }));*/

    it('Should call edit loan from context menu when its enabled',
      inject(function (PipelineEventsConst) {
        pipelineDataStore.editLoanButtonDisabled = false;
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_EDIT_EVENT, function () {
        });
        ctrl.cmEditLoan();
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_EDIT_EVENT);
      }));

    it('Should not call edit loan from context menu when its disabled',
      inject(function (PipelineEventsConst) {
        pipelineDataStore.editLoanButtonDisabled = true;
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_EDIT_EVENT, function () {
        });
        ctrl.cmEditLoan();
        expect(rootScope.$broadcast).not.toHaveBeenCalledWith(PipelineEventsConst.LOAN_EDIT_EVENT);
      }));

    it('Should call duplicate loan from context menu when its enabled',
      inject(function (PipelineEventsConst) {
        pipelineDataStore.duplicateButtonDisabled = false;
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_DUPLICATE_EVENT, function () {
        });
        ctrl.duplicateLoan();
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_DUPLICATE_EVENT);
      }));

    it('Should not call duplicate loan from context menu when its disabled',
      inject(function (PipelineEventsConst) {
        pipelineDataStore.duplicateButtonDisabled = true;
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_DUPLICATE_EVENT, function () {
        });
        ctrl.duplicateLoan();
        expect(rootScope.$broadcast).not.toHaveBeenCalledWith(PipelineEventsConst.LOAN_DUPLICATE_EVENT);
      }));

    it('Should call transfer loan from context menu for any loan folder other than trash',
      inject(function (PipelineEventsConst) {
        pipelineDataStore.LoanFolderDropdownData.selectedItem = 'Any Folder';
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_TRANSFER_EVENT, function () {
        });
        ctrl.openTransferLoan();
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_TRANSFER_EVENT);
      }));

    it('Should not call transfer loan from context menu for trash folder',
      inject(function (PipelineEventsConst, PipelineConst) {
        pipelineDataStore.LoanFolderDropdownData.selectedItem = PipelineConst.TrashFolder;
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_TRANSFER_EVENT, function () {
        });
        ctrl.openTransferLoan();
        expect(rootScope.$broadcast).not.toHaveBeenCalledWith(PipelineEventsConst.LOAN_TRANSFER_EVENT);
      }));

    it('Should call delete loan from context menu',
      inject(function (PipelineEventsConst) {
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_DELETE_EVENT, function () {
        });
        ctrl.deleteLoan();
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_DELETE_EVENT);
      }));

    it('Should call print from context menu',
      inject(function (PipelineEventsConst) {
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_PRINT_EVENT, function () {
        });
        ctrl.openPrint();
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_PRINT_EVENT);
      }));

    it('Should call export to excel from context menu with true for exportAll',
      inject(function (PipelineEventsConst) {
        spyOn(rootScope, '$broadcast').and.callThrough();
        var exportAll = false;
        rootScope.$on(PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, function (event, data) {
          exportAll = data.exportAll;
        });
        ctrl.exportToExcel(true);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, {'exportAll': true});
        expect(exportAll).toBeTruthy();
      }));

    it('Should call export to excel from context menu with false for exportAll',
      inject(function (PipelineEventsConst) {
        spyOn(rootScope, '$broadcast').and.callThrough();
        var exportAll = true;
        rootScope.$on(PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, function (event, data) {
          exportAll = data.exportAll;
        });
        ctrl.exportToExcel(false);
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, {'exportAll': false});
        expect(exportAll).toBeFalsy();
      }));

    it('Should call move to folder from context menu with folder name',
      inject(function (PipelineEventsConst) {
        spyOn(rootScope, '$broadcast').and.callThrough();
        rootScope.$on(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, function (event, data) {
        });
        ctrl.callMoveToFolder('folder');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, {'folder': 'folder'});

      }));

    it('Should call SetMenuStateService on initialize to Disable Save View, Reset View, Manage Alerts,' +
      ' Customize columns, Manage view and Move menu items in Main menu',
      inject(function ($controller) {
        pipelineDataStore.PersonaAccess.LoanMgmt = {LoanMgmt_Pipeline_Alert: true, LoanMgmt_Move: true};
        ctrl = $controller('PipelineGridController', {$scope: scope});
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
          {MenuItemTag: 'PI_SaveView', Enabled: false, Visible: true},
          {MenuItemTag: 'PI_Move', Enabled: false, Visible: true},
          {MenuItemTag: 'PI_ResetView', Enabled: false, Visible: true},
          {MenuItemTag: 'PI_ManageAlerts', Enabled: true, Visible: true},
          {MenuItemTag: 'PI_Columns', Enabled: true, Visible: true},
          {MenuItemTag: 'PI_ManageViews', Enabled: true, Visible: true}
        ]);
      }));

    it('Should call open loan alert on context menu click for alert count more than 0 and selected loan count 1',
      inject(function (modalWindowService, PipelineConst) {
        spyOn(modalWindowService, 'showLoanAlertPopup');
        pipelineDataStore.PipelineGridData.selected = [{
          Alerts$AlertCount: 1,
          Loan$Guid: 'a',
          CurrentLoanAssociateID: '',
          CurrentLoanAssociateGroupID: ''
        }];
        pipelineDataStore.PipelineGridData.data.columns = [{
          'field': 'Alerts$AlertCount',
          'uniqueID': 'Alerts.AlertCount'
        }];
        ctrl.openLoanAlert('Alerts.AlertCount');
        expect(modalWindowService.showLoanAlertPopup).toHaveBeenCalledWith('1' + PipelineConst.LoanAlerts, 'a',
          'Alerts.AlertCount', '', '');
      }));

    it('Should call open loan alert on context menu click for alert count 0',
      inject(function (modalWindowService) {
        spyOn(modalWindowService, 'showLoanAlertPopup');
        pipelineDataStore.PipelineGridData.selected = [{Alerts$AlertCount: 0, Loan$Guid: 'a'}];
        pipelineDataStore.PipelineGridData.data.columns = [{
          'field': 'Alerts$AlertCount',
          'uniqueID': 'Alerts.AlertCount'
        }];
        ctrl.openLoanAlert('Alerts.AlertCount');
        expect(modalWindowService.showLoanAlertPopup).toHaveBeenCalled();
      }));

    it('Should not call open loan alert on context menu click for alert count greater than 0 but more than one loan ' +
      'selected',
      inject(function (modalWindowService) {
        spyOn(modalWindowService, 'showLoanAlertPopup');
        pipelineDataStore.PipelineGridData.selected = [{Alerts$AlertCount: 4, Loan$Guid: 'a'}, {
          Alerts$AlertCount: 3,
          Loan$Guid: 'b'
        }];
        pipelineDataStore.PipelineGridData.data.columns = [{
          'field': 'Alerts$AlertCount',
          'uniqueID': 'Alerts.AlertCount'
        }];
        ctrl.openLoanAlert('Alerts.AlertCount');
        expect(modalWindowService.showLoanAlertPopup).not.toHaveBeenCalled();
      }));

    it('Should call display loan property on context menu click',
      inject(function (modalWindowService, LoanPropertiesInfoService) {
        spyOn(LoanPropertiesInfoService, 'resolvePromise');
        spyOn(modalWindowService, 'showRebuildLoanPropertiesPopup');
        pipelineDataStore.PipelineGridData.selected = [{Loan$Guid: ''}];
        ctrl.displayLoanProperties();
        expect(modalWindowService.showRebuildLoanPropertiesPopup).toHaveBeenCalled();
      }));

    it('Should not call display loan property on context menu click if selected more than one loan',
      inject(function (modalWindowService, LoanPropertiesInfoService) {
        spyOn(LoanPropertiesInfoService, 'resolvePromise');
        spyOn(modalWindowService, 'showRebuildLoanPropertiesPopup');
        pipelineDataStore.PipelineGridData.selected = [{Loan$Guid: '1'}, {Loan$Guid: '2'}];
        ctrl.displayLoanProperties();
        expect(modalWindowService.showRebuildLoanPropertiesPopup).not.toHaveBeenCalled();
        expect(LoanPropertiesInfoService.resolvePromise).not.toHaveBeenCalled();
      }));

    it('Should not call display loan property on context menu click if not selected any loan',
      inject(function (modalWindowService, LoanPropertiesInfoService) {
        spyOn(LoanPropertiesInfoService, 'resolvePromise');
        spyOn(modalWindowService, 'showRebuildLoanPropertiesPopup');
        pipelineDataStore.PipelineGridData.selected = [];
        ctrl.displayLoanProperties();
        expect(modalWindowService.showRebuildLoanPropertiesPopup).not.toHaveBeenCalled();
        expect(LoanPropertiesInfoService.resolvePromise).not.toHaveBeenCalled();
      }));

    it('should call the column reorder on grid',
      function (done) {
        inject(function ($compile, kendo, $controller, $timeout, PipelineEventsConst) {
          spyOn(rootScope, '$broadcast').and.callThrough();
          rootScope.$on(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT, function () {
          });

          var ctrl1 = $controller('PipelineGridController', {$scope: scope});
          elem = $compile(angular.element('<div><div id="demo" kendo-grid="demo" ></div></div>'))(scope);
          scope.$on('kendoRendered', function () {
            var grid = elem.find('div[id="demo"]').data('kendoGrid');
            grid.options = ctrl1.pipelineGridOptions;
            scope.$apply();
            if (grid) {
              /* jshint ignore: start */
              grid.options.columnReorder({
                hasOwnProperty: function (s) {
                  return false;
                }
              });
              /* jshint ignore: end */
              $timeout.flush();
              expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
              done();
            }
          });
        });
      });

    it('should change order index on column reorder',
      function (done) {
        inject(function ($compile, kendo, PipelineDataStore, $timeout, $controller) {
          PipelineDataStore.PipelineGridData.data.columns = [{
            alignment: '', OrderIndex: '0', title: 'Test0', name: 'Test0',
            width: '', sortOrder: '', sortPriority: '', required: '', 'FieldId': '0'
          },
            {
              alignment: '', OrderIndex: '1', title: 'Test1', name: 'Test1', width: '', sortOrder: '', sortPriority: '',
              required: '', 'FieldId': '1'
            },
            {
              alignment: '', OrderIndex: '2', title: 'Test2', name: 'Test2', width: '', sortOrder: '', sortPriority: '',
              required: '', 'FieldId': '2'
            }];
          var ctrl1 = $controller('PipelineGridController', {$scope: scope});
          var arg;
          elem = $compile(angular.element('<div><div id="demo" kendo-grid="demo" ></div></div>'))(scope);
          scope.$on('kendoRendered', function () {
            var grid = elem.find('div[id="demo"]').data('kendoGrid');
            grid.options = ctrl1.pipelineGridOptions;
            grid.columns = angular.copy(PipelineDataStore.PipelineGridData.data.columns);
            scope.$apply();
            /* jshint ignore: start */
            arg = {
              hasOwnProperty: function (s) {
                return true;
              },
              column: grid.columns[1], oldIndex: 2, newIndex: 0
            };
            /* jshint ignore: end */
            if (grid) {
              grid.options.columnReorder(arg);
              $timeout.flush();
              expect(PipelineDataStore.PipelineGridData.data.columns[2].OrderIndex).toBe(0);
              done();
            }
          });
        });
      });

    it('Should call potpup on ExportLEFPipeline -> All Loans on All Pages',
      inject(function (encompass, $timeout, SetPipelineViewXmlService) {
        spyOn(encompass, 'exportLEFPipeline');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        ctrl.exportLEFPipeline(true);
        $timeout.flush();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        expect(encompass.exportLEFPipeline).toHaveBeenCalled();
      }));

    it('Should call popup on GenerateNMLSReport click',
      inject(function (encompass, $timeout, SetPipelineViewXmlService) {
        spyOn(encompass, 'generateNMLSReport');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        ctrl.generateNMLSReport();
        $timeout.flush();
        expect(encompass.generateNMLSReport).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));

    it('Should call potpup on GenerateNCMLDReport click',
      inject(function (encompass, $timeout, SetPipelineViewXmlService) {
        spyOn(encompass, 'generateNCMLDReport');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        ctrl.generateNCMLDReport();
        $timeout.flush();
        expect(encompass.generateNCMLDReport).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));

    it('Should Enable Duplicate Loan icon and call SetMenuStateService to reflect the same in Main menu on onGridDoubleClick when row' +
    'selected count is 1', inject(function (encompass) {
      pipelineDataStore.DuplicateLoanAccess = true;
      spyOn(encompass, 'setThinPipelineInfos');
      spyOn(encompass, 'openLoan');
      pipelineDataStore.PipelineGridData.selected.length = 1;
      ctrl.showDuplicateLoanButton = true;
      ctrl.onGridDoubleClick();
      expect(pipelineDataStore.duplicateButtonDisabled).toBe(false);
      expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
        {MenuItemTag: 'PI_Duplicate', Enabled: true, Visible: true}
      ]);
    }));

    it('Should Disable Duplicate Loan icon and call SetMenuStateService to reflect the same in Main menu on onGridDoubleClick when row' +
    'selected count greater than 1', inject(function (encompass, $timeout, LoanFolderDropdownData, PipelineConst) {
      pipelineDataStore.DuplicateLoanAccess = false;
      spyOn(encompass, 'setThinPipelineInfos');
      spyOn(encompass, 'openLoan');
      pipelineDataStore.PipelineGridData.selected.length = 2;
      ctrl.showDuplicateLoanButton = true;
      ctrl.onGridDoubleClick();
      $timeout.flush();
      expect(pipelineDataStore.duplicateButtonDisabled).toBe(true);
      expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
        {MenuItemTag: 'PI_Duplicate', Enabled: false, Visible: true}
      ]);
    }));

    it('Should alert on onGridDoubleClick when row selected count greater than 1 when loan folder is trash',
      inject(function (encompass, $timeout, LoanFolderDropdownData, PipelineConst, $q, modalWindowService) {
        var popupDeferred = $q.defer();
        var popupPromise = {result: popupDeferred.promise};
        popupDeferred.resolve(false);
        pipelineDataStore.DuplicateLoanAccess = false;
        spyOn(encompass, 'setThinPipelineInfos');
        spyOn(encompass, 'openLoan');
        pipelineDataStore.PipelineGridData.selected.length = 2;
        ctrl.showDuplicateLoanButton = true;
        LoanFolderDropdownData.selectedItemTitle = PipelineConst.Trash;
        spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function () {
          return popupPromise;
        });
        ctrl.onGridDoubleClick();
        $timeout.flush();
        expect(modalWindowService.showConfirmationPopup).toHaveBeenCalledWith(PipelineConst.PopupMessage,
          PipelineConst.PopupTitle);
        expect(pipelineDataStore.duplicateButtonDisabled).toBe(true);
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
          {MenuItemTag: 'PI_Duplicate', Enabled: false, Visible: true}
        ]);
      }));

    it('Should Disable Duplicate and Edit loan icons and call SetMenuStateService to reflect same in Main menu on setEditLoanButtonStatus',
      inject(function () {
        ctrl.showDuplicateLoanButton = true;
        ctrl.setEditLoanButtonStatus(0);
        expect(pipelineDataStore.duplicateButtonDisabled).toBe(true);
        expect(pipelineDataStore.editLoanButtonDisabled).toBe(true);
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
          {MenuItemTag: 'PI_Duplicate', Enabled: false, Visible: true},
          {MenuItemTag: 'PI_Edit', Enabled: false, Visible: false}
        ]);
      }));

    it('Should Disable move to folder button, context menu option and thick client menu option in pipeline menu on disableMoveFolderButton',
      inject(function () {
        pipelineDataStore.PersonaAccess.LoanMgmt = {LoanMgmt_Move: true};
        ctrl.disableMoveFolderButton();
        expect(pipelineDataStore.moveToFolderButtonDisabled).toBe(true);
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
          {MenuItemTag: 'PI_Move', Enabled: false, Visible: true}
        ]);
      }));

    it('Should Enable Duplicate and Edit loan icons and call SetMenuStateService to reflect same in Main menu on setEditLoanButtonStatus',
      inject(function () {
        pipelineDataStore.duplicateButtonDisabled = false;
        pipelineDataStore.editLoanButtonDisabled = false;
        pipelineDataStore.DuplicateLoanAccess = true;
        ctrl.showDuplicateLoanButton = true;
        ctrl.setEditLoanButtonStatus(1);
        expect(pipelineDataStore.duplicateButtonDisabled).toBe(false);
        expect(pipelineDataStore.editLoanButtonDisabled).toBe(false);
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
          {MenuItemTag: 'PI_Duplicate', Enabled: true, Visible: true},
          {MenuItemTag: 'PI_Edit', Enabled: true, Visible: true}
        ]);
      }));

    it('Should check if setAutoRefresh is called when LoansDataLoaded is set to true',
      inject(function (PipelineGetLoans, PipelineDataStore, $controller) {
        PipelineDataStore.LoansDataLoaded = false;
        PipelineDataStore.AutoRefreshIntervalLoaded = true;
        ctrl = $controller('PipelineGridController', {$scope: scope});
        spyOn(PipelineGetLoans, 'setAutoRefresh').and.callFake(function () {
        });
        PipelineDataStore.LoansDataLoaded = true;
        scope.$apply();
        expect(PipelineGetLoans.setAutoRefresh).toHaveBeenCalled();
      }));

    it('Should check if setAutoRefresh is not called when LoansDataLoaded is set to false',
      inject(function (PipelineGetLoans, PipelineDataStore, $controller) {
        PipelineDataStore.LoansDataLoaded = true;
        PipelineDataStore.AutoRefreshIntervalLoaded = true;
        ctrl = $controller('PipelineGridController', {$scope: scope});
        spyOn(PipelineGetLoans, 'setAutoRefresh').and.callFake(function () {
        });
        PipelineDataStore.LoansDataLoaded = false;
        scope.$apply();
        expect(PipelineGetLoans.setAutoRefresh).not.toHaveBeenCalled();
      }));

    describe('Test investor service Fuctionality', function () {
      beforeEach(inject(function ($controller, $rootScope, encompass, SetPipelineViewXmlService) {
        $rootScope.isThinClient = false;
        spyOn(encompass, 'exportFannieMaeFormattedFile');
        spyOn(encompass, 'investorStandardExportPipeline');
        spyOn(encompass, 'eFolderExport');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
      }));
      it('To export all with DataService Fannie, investorStandardExportPipeline function should have been called if ' +
      'investorStandardExport has been called', inject(function (encompass, SetPipelineViewXmlService, $timeout) {
        ctrl.investorExport(true, 'Fannie');
        $timeout.flush();
        expect(encompass.investorStandardExportPipeline).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));
      it('To export selected loans with DataService Fannie, investorStandardExportPipeline function should have ' +
      'been called if investorStandardExport has been called', inject(function (encompass, SetPipelineViewXmlService,
                                                                                $timeout) {
        ctrl.investorExport(false, 'Fannie');
        $timeout.flush();
        expect(encompass.investorStandardExportPipeline).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));
      it('To export all loans with DataService Freddie, investorStandardExportPipeline function should have ' +
      'been called if investorStandardExport has been called', inject(function (encompass, SetPipelineViewXmlService,
                                                                                $timeout) {
        ctrl.investorExport(true, 'Freddie');
        $timeout.flush();
        expect(encompass.investorStandardExportPipeline).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));
      it('To export selected loans with DataService Freddie, investorStandardExportPipeline function should have ' +
      'been called if investorStandardExport has been called', inject(function (encompass, SetPipelineViewXmlService,
                                                                                $timeout) {
        ctrl.investorExport(false, 'Freddie');
        $timeout.flush();
        expect(encompass.investorStandardExportPipeline).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));
      it('Create command should have been called if exportFannieMaeFormattedFile has been ' +
      'called', inject(function (encompass, SetPipelineViewXmlService, $timeout) {
        ctrl.exportFannieMaeFormattedFile();
        $timeout.flush();
        expect(encompass.exportFannieMaeFormattedFile).toHaveBeenCalled();
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      }));
      it('should call the eFolder Document export for selected loan only', inject(function (encompass) {
        ctrl.eFolderExport(false);
        expect(encompass.eFolderExport).toHaveBeenCalled();
      }));
      it('should call the eFolder Document export for all loans', inject(function (encompass) {
        ctrl.eFolderExport(true);
        expect(encompass.eFolderExport).toHaveBeenCalled();
      }));

    });

    describe('Test compliance service Fuctionality', function () {
      beforeEach(inject(function ($rootScope, encompass, SetPipelineViewXmlService) {
        $rootScope.isThinClient = false;
        spyOn(encompass, 'exportLEFPipeline');
        spyOn(encompass, 'generateNMLSReport');
        spyOn(encompass, 'generateNCMLDReport');
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
      }));
      it('Should test encompass exportLEFPipeline is called on exportLEFPipeline',
        inject(function (encompass, SetPipelineViewXmlService, $timeout) {
          ctrl.exportLEFPipeline(true);
          $timeout.flush();
          expect(encompass.exportLEFPipeline).toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        })); //
      it('Should test encompass generateNMLSReport is called on generateNMLSReport',
        inject(function (encompass, SetPipelineViewXmlService, $timeout) {
          ctrl.generateNMLSReport();
          $timeout.flush();
          expect(encompass.generateNMLSReport).toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));
      it('Should test encompass generateNMLSReport is called on generateNMLSReport',
        inject(function (encompass, SetPipelineViewXmlService, $timeout) {
          ctrl.generateNCMLDReport();
          $timeout.flush();
          expect(encompass.generateNCMLDReport).toHaveBeenCalled();
          expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
        }));
    });

    // TODO: I will fix this while writing unit test cases for NGENC-448
    describe('To Test Loan Selection in Grid', function () {
      beforeEach(inject(function (encompass) {
        spyOn(encompass, 'setThinPipelineInfos');
        pipelineDataStore.PipelineGridData = {
          data: {
            items: []
          }
        };
      }));
      it('Should disable edit, duplicate, move, transfer, delete, print icons and toolbar menus on no selection and' +
      'should call SetMenuStateService to disable all these menus in main menu', inject(function (encompass) {
        pipelineDataStore.PrintLoanAccess = true;
        pipelineDataStore.deleteLoanAccess = true;
        var data = [];
        pipelineDataStore.PersonaAccess.LoanMgmt = {
          LoanMgmt_Move: true, LoanMgmt_Transfer: true,
          LoanMgmt_ExportToExcel: true
        };
        ctrl.showDuplicateLoanButton = true;
        ctrl.isDisableComplianceServices = false;
        ctrl.isDisableGenerateNMLSReport = false;
        ctrl.isNorthCarolinaReportEnable = true;
        ctrl.gridSelectionChange(data);
        expect(encompass.setThinPipelineInfos).toHaveBeenCalled();
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith(
          [{
            MenuItemTag: 'PI_Duplicate', Enabled: false, Visible: true
          }, {
            MenuItemTag: 'PI_Edit', Enabled: false, Visible: false
          }, {
            MenuItemTag: 'PI_Move', Enabled: false, Visible: true
          }, {
            MenuItemTag: 'PI_Transfer', Enabled: false, Visible: true
          }, {
            MenuItemTag: 'PI_Delete', Enabled: false, Visible: true
          }, {
            MenuItemTag: 'PI_ExportSelected', Enabled: false, Visible: true
          }, {
            MenuItemTag: 'PI_ExportAll', Enabled: false, Visible: true
          }, {
            MenuItemTag: 'PI_Print', Enabled: false, Visible: true
          },
            {MenuItemTag: 'SRV_LEF_Selected', Enabled: !ctrl.isDisableComplianceServices, Visible: true},
            {MenuItemTag: 'SRV_LEF_All', Enabled: !ctrl.isDisableComplianceServices, Visible: true},
            {
              MenuItemTag: 'SRV_Fannie_Selected',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Fannie_All',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Freddie_Selected',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Freddie_All',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_FannieMaeFormattedFile',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_NMLS', Enabled: (ctrl.isDisableComplianceServices && ctrl.isDisableGenerateNMLSReport),
              Visible: (ctrl.isDisableComplianceServices && ctrl.isDisableGenerateNMLSReport)
            },
            {
              MenuItemTag: 'SRV_NCarComplianceReport',
              Enabled: (ctrl.isDisableComplianceServices &&
              ctrl.isNorthCarolinaReportEnable),
              Visible: (ctrl.isDisableComplianceServices && ctrl.isNorthCarolinaReportEnable)
            }]
        );
        expect(pipelineDataStore.duplicateButtonDisabled).toBe(true);
        expect(pipelineDataStore.editLoanButtonDisabled).toBe(true);
        expect(pipelineDataStore.moveToFolderButtonDisabled).toBe(true);
        expect(pipelineDataStore.transferButtonDisabled).toBe(true);
        expect(pipelineDataStore.deleteIconDisabled).toBe(true);
        expect(pipelineDataStore.printButtonDisabled).toBe(true);
        expect(pipelineDataStore.PipelineGridData.selected.length > 0).toBe(false);
        expect(pipelineDataStore.PipelineGridData.data.items.length > 0).toBe(false);
      }));

      it('Should enable edit, duplicate, move, transfer, delete, print icons and toolbar menus on single selection and' +
      'should call SetMenuStateService to enable all these menus in main menu', inject(function (encompass) {
        pipelineDataStore.PersonaAccess = {
          'LoanMgmt': {
            'LoanMgmt_Move': true,
            'LoanMgmt_Transfer': true,
            'LoanMgmt_ExportToExcel': true
          }
        };
        pipelineDataStore.DuplicateLoanAccess = true;
        ctrl.showDuplicateLoanButton = true;
        pipelineDataStore.deleteLoanAccess = true;
        pipelineDataStore.PrintLoanAccess = true;
        var data = [{'Alerts': 1, 'BorrowerName': 'Test', 'Loan$LoanFolder': ''}];
        pipelineDataStore.PipelineGridData.data.items = data;
        ctrl.gridSelectionChange(data);
        pipelineDataStore.moveToFolderButtonDisabled = !ctrl.isMoveFromFolderAccessDisabled(data);
        expect(encompass.setThinPipelineInfos).toHaveBeenCalled();
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith(
          [{
            MenuItemTag: 'PI_Duplicate', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_Edit', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_Move', Enabled: !ctrl.isMoveFromFolderAccessDisabled(data), Visible: true
          }, {
            MenuItemTag: 'PI_Transfer', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_Delete', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_ExportSelected', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_ExportAll', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_Print', Enabled: true, Visible: true
          },
            {MenuItemTag: 'SRV_LEF_Selected', Enabled: !ctrl.isDisableComplianceServices, Visible: true},
            {MenuItemTag: 'SRV_LEF_All', Enabled: !ctrl.isDisableComplianceServices, Visible: true},
            {
              MenuItemTag: 'SRV_Fannie_Selected',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Fannie_All',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Freddie_Selected',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Freddie_All',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_FannieMaeFormattedFile',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_NMLS', Enabled: (ctrl.isDisableComplianceServices && ctrl.isDisableGenerateNMLSReport),
              Visible: (ctrl.isDisableComplianceServices && ctrl.isDisableGenerateNMLSReport)
            },
            {
              MenuItemTag: 'SRV_NCarComplianceReport',
              Enabled: (ctrl.isDisableComplianceServices &&
              ctrl.isNorthCarolinaReportEnable),
              Visible: (ctrl.isDisableComplianceServices && ctrl.isNorthCarolinaReportEnable)
            }]
        );
        expect(pipelineDataStore.duplicateButtonDisabled).toBe(false);
        expect(pipelineDataStore.editLoanButtonDisabled).toBe(false);
        expect(pipelineDataStore.moveToFolderButtonDisabled).toBe(false);
        expect(pipelineDataStore.transferButtonDisabled).toBe(false);
        expect(pipelineDataStore.deleteIconDisabled).toBe(false);
        expect(pipelineDataStore.printButtonDisabled).toBe(false);
        expect(pipelineDataStore.PipelineGridData.selected.length > 0).toBe(true);
        expect(pipelineDataStore.PipelineGridData.data.items.length > 0).toBe(true);
      }));

      it('Should disable edit, duplicate and enable move, transfer, delete, print icons and toolbar menus on multiple selection and' +
      'should call SetMenuStateService to reflect the same state in main menu', inject(function (encompass) {
        pipelineDataStore.PersonaAccess = {
          'LoanMgmt': {
            'LoanMgmt_Move': true,
            'LoanMgmt_Transfer': true,
            'LoanMgmt_ExportToExcel': true
          }
        };
        pipelineDataStore.DuplicateLoanAccess = true;
        ctrl.showDuplicateLoanButton = true;
        pipelineDataStore.deleteLoanAccess = true;
        pipelineDataStore.PrintLoanAccess = true;
        var data = [{'Alerts': 1, 'BorrowerName': 'Test', 'Loan$LoanFolder': ''},
          {'Alerts': 2, 'BorrowerName': 'Test1', 'Loan$LoanFolder': ''}];
        pipelineDataStore.PipelineGridData.data.items = data;
        ctrl.gridSelectionChange(data);
        pipelineDataStore.moveToFolderButtonDisabled = !ctrl.isMoveFromFolderAccessDisabled(data);
        expect(encompass.setThinPipelineInfos).toHaveBeenCalled();
        expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith(
          [{
            MenuItemTag: 'PI_Duplicate', Enabled: false, Visible: true
          }, {
            MenuItemTag: 'PI_Edit', Enabled: false, Visible: false
          }, {
            MenuItemTag: 'PI_Move', Enabled: !ctrl.isMoveFromFolderAccessDisabled(data), Visible: true
          }, {
            MenuItemTag: 'PI_Transfer', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_Delete', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_ExportSelected', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_ExportAll', Enabled: true, Visible: true
          }, {
            MenuItemTag: 'PI_Print', Enabled: true, Visible: true
          },
            {MenuItemTag: 'SRV_LEF_Selected', Enabled: !ctrl.isDisableComplianceServices, Visible: true},
            {MenuItemTag: 'SRV_LEF_All', Enabled: !ctrl.isDisableComplianceServices, Visible: true},
            {
              MenuItemTag: 'SRV_Fannie_Selected',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Fannie_All',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Freddie_Selected',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_Freddie_All',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_FannieMaeFormattedFile',
              Enabled: ctrl.isDisableInvestorServices,
              Visible: ctrl.isDisableInvestorServices
            },
            {
              MenuItemTag: 'SRV_NMLS', Enabled: (ctrl.isDisableComplianceServices && ctrl.isDisableGenerateNMLSReport),
              Visible: (ctrl.isDisableComplianceServices && ctrl.isDisableGenerateNMLSReport)
            },
            {
              MenuItemTag: 'SRV_NCarComplianceReport',
              Enabled: (ctrl.isDisableComplianceServices &&
              ctrl.isNorthCarolinaReportEnable),
              Visible: (ctrl.isDisableComplianceServices && ctrl.isNorthCarolinaReportEnable)
            }]
        );
        expect(pipelineDataStore.duplicateButtonDisabled).toBe(true);
        expect(pipelineDataStore.editLoanButtonDisabled).toBe(true);
        expect(pipelineDataStore.moveToFolderButtonDisabled).toBe(false);
        expect(pipelineDataStore.deleteIconDisabled).toBe(false);
        expect(pipelineDataStore.printButtonDisabled).toBe(false);
        expect(pipelineDataStore.PipelineGridData.selected.length > 0).toBe(true);
        expect(pipelineDataStore.PipelineGridData.data.items.length > 0).toBe(true);
      }));
    });

    describe('Test the pipeline broadcast Events', function () {
      it('Should SHOW error popup on autorefresh failure',
        inject(function (PipelineEventsConst, modalWindowService) {
          spyOn(modalWindowService, 'showErrorPopup');
          var isError = true;
          rootScope.$broadcast(PipelineEventsConst.PIPELINE_AUTOREFRESH_EVENT, isError);
          expect(modalWindowService.showErrorPopup).toHaveBeenCalled();
        }));
      it('Should NOT show error popup on autorefresh success',
        inject(function (PipelineEventsConst, modalWindowService) {
          spyOn(modalWindowService, 'showErrorPopup');
          var isError = false;
          rootScope.$broadcast(PipelineEventsConst.PIPELINE_AUTOREFRESH_EVENT, isError);
          expect(modalWindowService.showErrorPopup).not.toHaveBeenCalled();
        }));
      it('should refresh grid when getting the broadcast message', inject(function (PipelineEventsConst) {
        spyOn(ctrl, 'refreshPipeline');
        rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT);
        expect(ctrl.refreshPipeline).toHaveBeenCalled();
      }));
      it('should open loan alert when getting the broadcast message', inject(function (PipelineEventsConst) {
        spyOn(ctrl, 'openLoanAlert');
        rootScope.$broadcast(PipelineEventsConst.LOAN_ALERT_EVENT, {'alertColumnUniqueID': ''});
        expect(ctrl.openLoanAlert).toHaveBeenCalled();
      }));
      it('should open customize column window when getting the broadcast message',
        inject(function (PipelineEventsConst) {
          spyOn(ctrl, 'openCustomizeColumnWindow');
          rootScope.$broadcast(PipelineEventsConst.CUSTOMIZE_COLUMN_EVENT);
          expect(ctrl.openCustomizeColumnWindow).toHaveBeenCalled();
        }));
      it('should export the selected event from compliance service to LEF when getting the broadcast message',
        inject(function (PipelineEventsConst) {
          var data = {'ExportAll': false};
          spyOn(ctrl, 'exportLEFPipeline');
          rootScope.$broadcast(PipelineEventsConst.EXPORT_LEF_SELECTED_EVENT, data);
          expect(ctrl.exportLEFPipeline).toHaveBeenCalledWith(data);
        }));
      it('should export the all event from compliance service to LEF when getting the broadcast message',
        inject(function (PipelineEventsConst) {
          var data = {'ExportAll': true};
          spyOn(ctrl, 'exportLEFPipeline');
          rootScope.$broadcast(PipelineEventsConst.EXPORT_LEF_ALL_EVENT, data);
          expect(ctrl.exportLEFPipeline).toHaveBeenCalledWith(data);
        }));
      it('should export the selected event from investor service to FRE when getting the broadcast ' +
      'message', inject(function (PipelineEventsConst) {
        var data = {'ExportAll': false};
        spyOn(ctrl, 'investorExport');
        rootScope.$broadcast(PipelineEventsConst.EXPORT_FRE_SELECTED_EVENT, data);
        expect(ctrl.investorExport).toHaveBeenCalledWith(data, ctrl.DataServiceFreddie);
      }));
      it('should export the all event from investor service to FRE when getting the broadcast message',
        inject(function (PipelineEventsConst) {
          var data = {'ExportAll': true};
          spyOn(ctrl, 'investorExport');
          rootScope.$broadcast(PipelineEventsConst.EXPORT_FRE_ALL_EVENT, data);
          expect(ctrl.investorExport).toHaveBeenCalledWith(data, ctrl.DataServiceFreddie);
        }));
      it('should export the selected event from ULDD to FannieMae in investor service when getting the broadcast' +
      ' message', inject(function (PipelineEventsConst) {
        var data = {'ExportAll': false};
        spyOn(ctrl, 'investorExport');
        rootScope.$broadcast(PipelineEventsConst.EXPORT_FNM_SELECTED_EVENT, data);
        expect(ctrl.investorExport).toHaveBeenCalledWith(data, ctrl.DataServiceFannie);
      }));
      it('should export the all event from ULDD to FannieMae in investor service when getting the broadcast' +
      ' message', inject(function (PipelineEventsConst) {
        var data = {'ExportAll': true};
        spyOn(ctrl, 'investorExport');
        rootScope.$broadcast(PipelineEventsConst.EXPORT_FNM_ALL_EVENT, data);
        expect(ctrl.investorExport).toHaveBeenCalledWith(data, ctrl.DataServiceFannie);
      }));
      it('should export to Fannie mae formatted file when getting the broadcast message',
        inject(function (PipelineEventsConst) {
          spyOn(ctrl, 'exportFannieMaeFormattedFile');
          rootScope.$broadcast(PipelineEventsConst.EXPORT_FNM_FORMATTED_FILE_EVENT);
          expect(ctrl.exportFannieMaeFormattedFile).toHaveBeenCalled();
        }));
      it('should generate NMLS call report when getting the broadcast message',
        inject(function (PipelineEventsConst) {
          spyOn(ctrl, 'generateNMLSReport');
          rootScope.$broadcast(PipelineEventsConst.GENERATE_NMLS_EVENT);
          expect(ctrl.generateNMLSReport).toHaveBeenCalled();
        }));
      it('should generate NCAR compliance report when getting the broadcast message',
        inject(function (PipelineEventsConst) {
          spyOn(ctrl, 'generateNCMLDReport');
          rootScope.$broadcast(PipelineEventsConst.NCAR_COMPLIANCE_REPORT_EVENT);
          expect(ctrl.generateNCMLDReport).toHaveBeenCalled();
        }));
      it('should reset grid sort event when getting the broadcast message',
        inject(function (PipelineEventsConst, PipelineDataStore) {
          rootScope.$broadcast(PipelineEventsConst.RESET_GRID_SORT_EVENT);
          expect(PipelineDataStore.PipelineGridData.sort[0].length).toBe(0);
        }));
      it('should open customize column window',
        inject(function (modalWindowService) {
          spyOn(modalWindowService.modalCustomizeColumns, 'open');
          ctrl.openCustomizeColumnWindow();
          expect(modalWindowService.modalCustomizeColumns.open).toHaveBeenCalled();
        }));
      it('should enable save and reset button when resizing columns on grid',
        inject(function (PipelineEventsConst, PipelineDataStore) {
          var evt;
          /* jshint ignore: start */
          evt =
          {

            hasOwnProperty: function () {
              return true;
            },
            column: {width: 139, FieldId: 'Pipeline.BorrowerName'}
          };
          /* jshint ignore: end */
          PipelineDataStore.PipelineGridData.data.columns = [{
            alignment: '', OrderIndex: '0', title: 'Test0', name: 'Test0',
            width: '100px', sortOrder: '', sortPriority: '', required: '', 'FieldId': 'Pipeline.BorrowerName'
          }];
          spyOn(rootScope, '$broadcast');
          ctrl.columnResize(evt);
          expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
        }));

      it('Should resize column size', inject(function ($timeout, PipelineEventsConst) {
        spyOn(rootScope, '$broadcast');
        ctrl.columnResize({column: {width: 100, FieldId: 'Field1234'}});
        $timeout.flush();
        expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      }));
      it('Should set view on broadcast', inject(function (PipelineEventsConst, PipelineDataStore) {
        rootScope.$broadcast(PipelineEventsConst.SET_VIEW_EVENT);
        expect(PipelineDataStore.PipelineGridData.sort).toBeDefined();
      }));

      it('Should clear all filter on pipeline grid on broadcast', inject(function (PipelineDataStore,
                                                                                   PipelineEventsConst) {
        rootScope.$broadcast(PipelineEventsConst.CLEAR_ALL_GRID_FILTER_EVENT);
        expect(PipelineDataStore.PipelineGridData.filters.length).toBe(0);
      }));
      it('Should show first hidden column on DataBound ', inject(function () {
        var evt;
        /* jshint ignore: start */
        evt =
        {

          sender: {
            showColumn: function (index) {
            },
            dataSource: {
              data: function () {
                return [{}];
              }, total: function () {

              }
            },
            tbody: {
              find: function () {
                return {
                  addClass: function () {
                  }, on: function () {
                  }
                }
              }
            }

          },
          hasOwnProperty: function () {
            return true;
          },
          column: {width: 139, FieldId: 'Pipeline.BorrowerName'}

        };
        /* jshint ignore: end */
        spyOn(evt.sender, 'showColumn');
        ctrl.onDataBound(evt);
        expect(evt.sender.showColumn).toHaveBeenCalled();
      }));
    });
  });
})();
