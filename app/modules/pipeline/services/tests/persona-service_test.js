(function () {
  'use strict';
  xdescribe('Persona Service', function () {
    var env, httpBackend;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, Restangular) {
      env = ENV;
      httpBackend = $httpBackend;
      spyOn(Restangular, 'all').and.callThrough();
      var response = [{
        'SectionName': 'LoanMgmt',
        'AccessRights': {
          'LoanMgmt_CreateFromTmpl': true,
          'LoanMgmt_CreateBlank': true,
          'LoanMgmt_Import': true
        }
      }];
      httpBackend.expectPOST(env.restURL + '/user/getuseraccessrights').respond(201, response);
    }));
    it('Should test persona access resolvePromise',
      inject(function (PersonaAccessService, PipelineDataStore, SetMenuStateService) {
        spyOn(SetMenuStateService, 'setThickClientMenuState');
        PersonaAccessService.resolvePromise();
        httpBackend.flush();
        expect(PipelineDataStore.PersonaAccess.LoanMgmt).toBeDefined();
        expect(PipelineDataStore.PersonaAccess.LoanMgmt).toEqual({
          'LoanMgmt_CreateFromTmpl': true,
          'LoanMgmt_CreateBlank': true,
          'LoanMgmt_Import': true
        });
        expect(SetMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([{
          MenuItemTag: 'PI_Import',
          Enabled: PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Import,
          Visible: PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Import
        }]);
      }));
  });
})();
