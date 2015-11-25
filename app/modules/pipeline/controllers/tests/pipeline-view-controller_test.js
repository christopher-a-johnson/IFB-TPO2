(function () {
  'use strict';
  describe('Pipeline view controller test', function () {
    var element, ctrl, scope, httpBackend, mockFactory, env, restangular, popupPromise;
    beforeEach(module('elli.encompass.web'));

    beforeEach(module('elli.encompass.web', function ($provide) {
      mockFactory = {
        showManageView: jasmine.createSpy(),
        showSavePipelineViewPopup: jasmine.createSpy(),
        setPipelineViewXml: jasmine.createSpy(),
        showConfirmationPopup: jasmine.createSpy().and.callFake(function () {
          return popupPromise;
        })
      };
      $provide.value('modalWindowService', mockFactory);
    }));

    beforeEach(inject(function ($compile, $rootScope, $controller, $httpBackend, ENV, _Restangular_) {
      scope = $rootScope;
      env = ENV;
      httpBackend = $httpBackend;
      restangular = _Restangular_;
      httpBackend.when('GET', env.restURL + '/pipeline/loan/getPipelineLoanMailboxMsgsCount').respond('0');
      httpBackend.when('POST', env.restURL + 'pipeline/view/getview', {}).respond({});
      ctrl = $controller('PipelineViewController', {$scope: scope});
      $compile(element)($rootScope);
    }));

    it('In Pipeline view controller  manageViewButtonDisable should be defined', inject(function () {
      expect(ctrl.manageViewButtonDisable).toBeDefined();
    }));

    it('Manage view button click should call the showManageView function', inject(function () {
      ctrl.manageViewButtonClicked();
      expect(mockFactory.showManageView).toHaveBeenCalled();
    }));

    it('Should save view on click of save button if it is enabled', inject(function (PipelineConst, modalWindowService) {
      ctrl.pipelineViewButtonsData.saveButtonDisabled = false;
      ctrl.saveButtonClicked();
      expect(modalWindowService.showSavePipelineViewPopup).toHaveBeenCalledWith(PipelineConst.SaveView);
    }));

    it('Should not take any action if save button is disabled', inject(function (modalWindowService, PipelineConst) {
      ctrl.pipelineViewButtonsData.saveButtonDisabled = true;
      ctrl.saveButtonClicked();
      expect(modalWindowService.showSavePipelineViewPopup).not.toHaveBeenCalledWith(PipelineConst.SaveView);
    }));

    it('Should call load view on trigger of event', inject(function (PipelineEventsConst, PipelineDataStore) {
      scope.$broadcast(PipelineEventsConst.LOAD_VIEW_EVENT);
      expect(PipelineDataStore.AdvanceFilterShow).toBe(false);
    }));

    it('Should call manage view button click event on broadcast', inject(function (PipelineEventsConst,
                                                                                   modalWindowService) {
      scope.$broadcast(PipelineEventsConst.MANAGE_VIEW_EVENT);
      expect(ctrl.manageViewButtonDisable).toBe(false);
      expect(modalWindowService.showManageView).toHaveBeenCalled();
    }));

    it('Should call reset view event on broadcast', inject(function (PipelineEventsConst,
                                                                     SetPipelineViewXmlService) {
      spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
      scope.$broadcast(PipelineEventsConst.RESET_VIEW_MENU_EVENT);
      expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
    }));

    it('Should call save button click event on broadcast', inject(function (PipelineEventsConst,
                                                                            PipelineConst, modalWindowService) {
      ctrl.pipelineViewButtonsData.saveButtonDisabled = false;
      scope.$broadcast(PipelineEventsConst.SAVE_VIEW);
      expect(modalWindowService.showSavePipelineViewPopup).toHaveBeenCalledWith(PipelineConst.SaveView);
    }));

    it('Should reset pipeline view on click of reset button', inject(function (SetPipelineViewXmlService, $timeout,
                                                                               modalWindowService, PipelineConst, $q) {
      var popupDeferred = $q.defer();
      popupPromise = {result: popupDeferred.promise};
      popupDeferred.resolve(false);
      spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
      ctrl.resetButtonClicked();
      $timeout.flush();
      expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      expect(modalWindowService.showConfirmationPopup).toHaveBeenCalledWith(PipelineConst.ResetConfirmationMessage,
        PipelineConst.ResetTitle);
    }));
    it('Should hide the Mail count if count is zero', inject(function ($compile, PipelineDataStore) {
      PipelineDataStore.PipelineLoanMailStore.data.mailCount = 0;
      var elem = $compile(angular.element('<div ng-controller="PipelineViewController as vm">' +
      '<div id="mailcount" ng-show="vm.pipelineLoanMailCount.data.mailCount">' +
      '{{vm.pipelineLoanMailCount.data.mailCount}}</div></div>'))(scope);
      scope.$digest();
      expect(elem.find('div[id="mailcount"]').hasClass('ng-hide')).toBe(true);
    }));

    it('Should show the Mail count if count is greater than zero', inject(function ($compile, PipelineDataStore) {
      PipelineDataStore.PipelineLoanMailStore.data.mailCount = 3;
      var elem = $compile(angular.element('<div ng-controller="PipelineViewController as vm">' +
      '<div id="mailcount" ng-show="vm.pipelineLoanMailCount.data.mailCount">' +
      '{{vm.pipelineLoanMailCount.data.mailCount}}</div></div>'))(scope);
      scope.$digest();
      expect(elem.find('div[id="mailcount"]').hasClass('ng-hide')).toBe(false);
    }));

    it('Should call popup on Loan Mailbox click',
      inject(function (encompass, $timeout) {
        spyOn(encompass, 'openLoanMailbox');
        ctrl.openLoanMailBox();
        $timeout.flush();
        expect(encompass.openLoanMailbox).toHaveBeenCalled();
        ctrl.openLoanMailBox({'keyCode': 13});
        $timeout.flush();
        expect(encompass.openLoanMailbox).toHaveBeenCalled();
      }));

    it('Should call set pipeline view on pipeline view drop down load',
      inject(function (SetPipelineViewXmlService) {
        spyOn(SetPipelineViewXmlService, 'setPipelineViewXml');
        var objToPost = {
          ViewName: 'Default View',
          PersonaName: 'Loan Officer'
        };
        var evt = {
          sender: {
            focus: function () {
            }
          }
        };
        ctrl.pipelineViewDropdownData.selectedItem = objToPost;
        ctrl.setPipelineViewName(evt);
        expect(SetPipelineViewXmlService.setPipelineViewXml).toHaveBeenCalled();
      })
    );

    it('Should rebind the pipeline grid and retain loan folder selection when pipeline view is changed',
      inject(function (PipelineGetView, PipelineDataStore) {
        spyOn(ctrl, 'setPipelineViewNameOnChange').and.callThrough();
        spyOn(ctrl, 'setPipelineViewName');
        spyOn(PipelineGetView, 'resolvePromise');

        //Set default pipeline view
        var objToPost = {
          ViewName: 'Default View',
          PersonaName: 'Loan Officer'
        };
        PipelineDataStore.LoanFolderDropdownData.selectedItem = 'Test Loan Folder';
        ctrl.pipelineViewDropdownData.selectedItem = objToPost;
        ctrl.setPipelineViewNameOnChange();
        expect(ctrl.setPipelineViewName).toHaveBeenCalled();
        expect(PipelineGetView.resolvePromise).toHaveBeenCalledWith(JSON.stringify(objToPost));

        //Change pipeline view
        //objToPost = {
        //  ViewName: 'Default View',
        //  PersonaName: 'System Administrator'
        //};
        ctrl.pipelineViewDropdownData.selectedItem = objToPost;
        ctrl.setPipelineViewNameOnChange();
        expect(ctrl.setPipelineViewName).toHaveBeenCalled();
        expect(PipelineGetView.resolvePromise).toHaveBeenCalledWith(JSON.stringify(objToPost));
        expect(PipelineDataStore.LoanFolderDropdownData.selectedItem).toBe('Test Loan Folder');
      }));

    it('Should enable Save Icon if search criteria changes',
      function (done) {
        inject(function (PipelineDataStore, PipelineGetLoans, $q, $timeout, $compile, PipelineEventsConst,
                         $controller) {
          var response = {Items: []};
          spyOn(restangular, 'all').and.callThrough();
          var deferred = $q.defer();
          var promise = deferred.promise;
          //var scope = scope.$new();
          deferred.resolve(response);
          restangular.all.and.callFake(function () {
            var returnALL = {
              customPOST: function () {
                return promise;
              }
            };
            return returnALL;
          });
          PipelineDataStore.PipelineGridData.filters = [{
            CriterionName: 'Loan.BorrowerName',
            FieldType: 'IsString',
            JointToken: 'and',
            LeftParentheses: 0,
            OpType: 'Contains',
            RightParentheses: 0,
            ValueFrom: 'xyz',
            ValueTo: '',
            field: 'Loan$BorrowerName',
            addedFromGrid: true
          }];
          spyOn(PipelineGetLoans, 'resolvePromise').and.callThrough();
          PipelineGetLoans.resolvePromise(1);
          $timeout.flush();

          spyOn(scope, '$broadcast').and.callThrough();
          var ctrl1 = $controller('PipelineGridController', {$scope: scope});
          var elem = $compile(angular.element('<div ><div id="demo" kendo-grid="demo" ></div></div>'))(scope);
          scope.$on('kendoRendered', function () {
            var grid = elem.find('div[id="demo"]').data('kendoGrid');
            grid.options = ctrl1.pipelineGridOptions;
            scope.$apply();
            if (grid) {
              grid.options.dataSource.trigger('change');
              expect(scope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
              expect(PipelineDataStore.saveButtonDisabled).toBe(false);
              done();
            }
          });
        });
      });
  });
})();
