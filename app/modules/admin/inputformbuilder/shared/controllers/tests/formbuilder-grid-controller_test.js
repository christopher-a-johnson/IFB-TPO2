(function () {
  'use strict';
  describe('Test formbuilder grid Controller: FormBuilderGridCtrl', function () {
    var scope, ctrl, rootScope, httpBackend, formBuilderGridData, env, formBuilderService;
    var formListConst;
    var imagesConst;
    var scriptsConst;
    var listGridData = '/api/fb/listGridData.json';
    var listGridColumns = '/api/fb/listGridColumns.json';

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, FormBuilderGridData, ENV,
                                FormBuilderService, ImagesConst, ScriptsConst, FormListConst) {
      scope = $rootScope.$new();
      var responseData = [{
        'Id': '1',
        'FormName': 'Justo Cetero Inimicus Vis Te',
        'Description': 'Justo Cetero Inimicus Vis Tejusto Cetero Inimicus Vis Tejusto Cetero Inimicus Vis ',
        'Enabled': 1,
        'LastModifiedBy': 'Joe Smith',
        'LastModifiedDateTime': '10/01/2014 12:30:12 PM'
      }];
      var responseColumn = [{'columns': [{'field': 'FormName', 'width': 200, 'title': 'Form Name'}]}];
      env = ENV;
      rootScope = $rootScope;
      formBuilderGridData = FormBuilderGridData;
      formBuilderService = FormBuilderService;
      imagesConst = ImagesConst;
      scriptsConst = ScriptsConst;
      formListConst = FormListConst;
      httpBackend = $httpBackend;
      httpBackend.when('GET', env.restURL + listGridData).respond(responseData);
      httpBackend.when('GET', env.restURL + listGridColumns).respond(responseColumn);
      ctrl = $controller;
    }));

    function initializeCtrl() {
      return ctrl('FormBuilderGridCtrl', {
        $scope: scope
      });
    }

    it('Formbuilder grid data fetched from api', function () {
      var newCtrl = initializeCtrl();
      expect(newCtrl.formBuilderGridData.items).toBeDefined();
    });

    it('Formbuilder grid options data fetched from api', function () {
      var newCtrl = initializeCtrl();
      expect(newCtrl.formBuilderGridData.columns).toBeDefined();
    });

    /* ToDo : Testing private fields and functions */
    xit('Should check for list page footer message', function () {
      formBuilderService.setCurPage(formListConst.FORM_LIST_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.footerPagingMessage).toBe(formListConst.FORM_LIST_PAGING_MSG);
    });

    /* ToDo : Testing private fields and functions */
    xit('Should check for image page footer message', function () {
      formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.footerPagingMessage).toBe(imagesConst.IMAGES_LIST_PAGING_MSG);
    });

    /* ToDo : Testing private fields and functions */
    xit('Should check for script page footer message', function () {
      formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.footerPagingMessage).toBe(scriptsConst.SCRIPTS_LIST_PAGING_MSG);
    });

    /* ToDo : Testing private fields and functions */
    xdescribe('Deleteing script file', function () {
      xit('If file is being used then controller should be FormBuilderDeleteRecordController  ', function () {
        formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
        var newCtrl = initializeCtrl();
        newCtrl.isFileUsed = true;
        newCtrl.deleteAsset();
        expect(newCtrl.config.controller).toBe('FormBuilderDeleteRecordController as vm');
      });

      /* ToDo : Testing private fields and functions */
      xit('If file is not being used then controller should be FormBuilderConfirmPopupController  ', function () {
        formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
        var newCtrl = initializeCtrl();
        newCtrl.isFileUsed = false;
        newCtrl.deleteAsset();
        expect(newCtrl.config.controller).toBe('FormBuilderConfirmPopupController as vm');
      });

      /* ToDo : Testing private fields and functions */
      xit('If file is not being used then poup message should contain file name ', function () {
        formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
        var newCtrl = initializeCtrl();
        newCtrl.isFileUsed = false;
        newCtrl.selectedFile = 'temp.js';
        newCtrl.deleteAsset();
        expect(newCtrl.message).toBe('Are you sure you want to delete temp.js ?');
      });
    });

    /* ToDo : Testing private fields and functions */
    xdescribe('Deleteing image file', function () {
      /* ToDo : Testing private fields and functions */
      xit('If file is being used then controller should be FormBuilderDeleteRecordController  ', function () {
        formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
        var newCtrl = initializeCtrl();
        newCtrl.isFileUsed = true;
        newCtrl.deleteAsset();
        expect(newCtrl.config.controller).toBe('FormBuilderDeleteRecordController as vm');
      });

      /* ToDo : Testing private fields and functions */
      xit('If file is not being used then controller should be FormBuilderConfirmPopupController  ', function () {
        formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
        var newCtrl = initializeCtrl();
        newCtrl.isFileUsed = false;
        newCtrl.deleteAsset();
        expect(newCtrl.config.controller).toBe('FormBuilderConfirmPopupController as vm');
      });

      /* ToDo : Testing private fields and functions */
      xit('If file is not being used then poup message should contain file name ', function () {
        formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
        var newCtrl = initializeCtrl();
        newCtrl.isFileUsed = false;
        newCtrl.selectedFile = 'temp.js';
        newCtrl.deleteAsset();
        expect(newCtrl.message).toBe('Are you sure you want to delete temp.js ?');
      });
    });

    /* ToDo : Testing private fields and functions */
    xit('Should check whether record is duplicate', function () {
      var newCtrl = initializeCtrl();
      var e = {
        data: {
          FormName: 'Justo Cetero Inimicus Vis Te'
        }
      };

      var gridSource = [{
        'FormName': 'Justo Cetero Inimicus Vis Te',
        'Description': 'Justo Cetero Inimicus Vis Tejusto Cetero Inimicus Vis Tejusto Cetero Inimicus Vis ',
        'Enabled': 1,
        'LastModifiedBy': 'Joe Smith',
        'LastModifiedDateTime': '10/01/2014 12:30:12 PM'
      }];

      gridSource.push(e.data);
      expect(newCtrl.confirmOrDeletePopup(gridSource, e.data.FormName)).toBe(true);
    });

    xit('Should check whether record is not duplicate', function () {
      var newCtrl = initializeCtrl();
      var e = {
        data: {
          FormName: 'Justo Cetero Inimicus Vis Te_copy'
        }
      };

      var gridSource = [{
        'Id': '1',
        'FormName': 'Justo Cetero Inimicus Vis Te',
        'Description': 'Justo Cetero Inimicus Vis Tejusto Cetero Inimicus Vis Tejusto Cetero Inimicus Vis ',
        'Enabled': 1,
        'LastModifiedBy': 'Joe Smith',
        'LastModifiedDateTime': '10/01/2014 12:30:12 PM'
      }];

      gridSource.push(e.data);
      expect(newCtrl.confirmOrDeletePopup(gridSource, e.data.FormName)).toBe(false);
    });

    /* ToDo : Testing private fields and functions */
    xit('Should call onEdit function on duplicate button click', function () {
      var newCtrl = initializeCtrl();
      spyOn(newCtrl, 'onEdit');
      newCtrl.onEdit();
      expect(newCtrl.onEdit).toHaveBeenCalled();
    });

  });

})();
