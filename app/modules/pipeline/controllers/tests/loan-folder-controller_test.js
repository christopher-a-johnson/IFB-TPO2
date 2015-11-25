(function () {
  'use strict';
  describe('Test Loan folder Controller', function () {
    var rootScope, scope, ctrl, pipelineDataStore, setMenuStateService, pipelineEventsConst;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($rootScope, $controller, SetMenuStateService, PipelineDataStore, PipelineEventsConst) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      pipelineDataStore = PipelineDataStore;
      setMenuStateService = SetMenuStateService;
      pipelineEventsConst = PipelineEventsConst;
      var mockPipeLineDataStore = {
        saveButtonDisabled: false,
        resetButtonDisabled: false,
        LoanFolderDropdownData: {
          items: ['NewLoans', 'ApprovedLoans', 'PendingLoans', '(Trash)'],
          selectedItem: '(Trash)'
        },
        LoanViewDropdownData: {
          items: [{id: 'All', title: 'All Loans'}, {id: 'User', title: 'My Loans'}],
          selectedItem: null
        },
        CompanyViewDropdownData: {
          items: [{id: 'Internal', title: 'Internal Organization'}, {id: 'TPO', title: 'TPO'}],
          selectedItem: null
        },
        PipelineView: null,
        deleteLoanAccess: false,
        PipelineViewSummary: null,
        externalOrg: {id: null, name: null},
        PersonaAccess: {LoanMgmt: {'LoanMgmt_TF_Delete': true, 'LoanMgmt_Delete': true}}
      };

      spyOn(rootScope, '$broadcast');
      spyOn(setMenuStateService, 'setThickClientMenuState');
      ctrl = $controller('LoanFolderController', {
        $scope: scope,
        PipelineDataStore: mockPipeLineDataStore
      });
    }));

    /*it('Should check value of setButtonDisabled on loan folder change', inject(function($compile, PipelineDataStore, $templateCache, kendo) {
     var mockToReturn = [];
     var elem = $compile(angular.element('<div ng-controller="LoanFolderController as vm"><select id="loan" ng-model="vm.ddValue" ng-change="vm.loanFolderChanged()"><option value="volvo">Volvo</option><option value="saab">Saab</option></select></div>'))(scope);
     httpBackend.when('GET', '/15.1/api/v1/loanViewDropdownData.json').respond(mockToReturn);
     httpBackend.when('GET', '/15.1/api/v1/loanFolderDropdownData.json').respond(mockToReturn);
     scope.$digest();
     elem.find('select').trigger('change');
     expect(PipelineDataStore.saveButtonDisabled).toBe(false);
     }));*/
    it('Should check if loan folder changed', function () {
      ctrl.loanFolderChanged();
      expect(ctrl.dataStore.deleteLoanAccess).toBe(true);
    });

    it('Should check value of setButtonDisabled on loan view change',
      inject(function ($compile, PipelineDataStore, $templateCache, kendo) {
        var elem = $compile(angular.element('<div ng-controller="LoanFolderController as vm">' +
        '<select id="loan" ng-model="vm.ddValue" ng-change="vm.loanViewChanged()">' +
        '<option value="volvo">Volvo</option><option value="saab">Saab</option></select></div>'))(scope);
        scope.$digest();
        elem.find('select').trigger('change');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      }));

    it('Should check value of setButtonDisabled on company view change',
      inject(function ($compile, PipelineDataStore, $templateCache, kendo) {
        var elem = $compile(angular.element('<div ng-controller="LoanFolderController as vm">' +
        '<select id="loan" ng-model="vm.ddValue" ng-change="vm.companyViewChanged()">' +
        '<option value="volvo">Volvo</option><option value="saab">Saab</option></select></div>'))(scope);
        scope.$digest();
        elem.find('select').trigger('change');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      }));

    it('Should check value of external Organization default name on company view change',
      inject(function ($compile, PipelineDataStore, $timeout) {
        var elem = $compile(angular.element('<div ng-controller="LoanFolderController as vm">' +
        '<select id="loan" ng-model="vm.companyViewDropdown" ng-change="vm.companyViewChanged()">' +
        '<option value="Internal" ng-selected="true">Internal Org</option><option value="TPO">TPO</option>' +
        '</select></div>'))(scope);
        scope.$digest();
        // To remove first undefined option from select dropdown
        elem.find('select').trigger('change');
        elem.find('select option:eq(1)').prop('selected', true);
        PipelineDataStore.CompanyViewDropdownData.selectedItem = {id: elem.find('select option:selected').val()};
        elem.find('select').trigger('change');
        expect(PipelineDataStore.externalOrg.name).toBe('All');
      }));

    it('Should call TPO Companies popup with title "TPO Companies"', inject(function (modalWindowService) {
      spyOn(modalWindowService, 'showTPOCompaniesPopup');
      ctrl.showTPOCompaniesPopUp();
      expect(modalWindowService.showTPOCompaniesPopup).toHaveBeenCalledWith('TPO Companies');
    }));
  });
})();
