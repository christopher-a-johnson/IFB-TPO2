(function () {
  'use strict';
  describe('Test formbuilder file upload Controller: FormBuilderFileUploadCtrl', function () {
    var scope, ctrl, formBuilderService, formListConst, assetLibraryGridServices, formBuilderUploadService,
      scriptsConst, jsinteraction;

    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($controller, $rootScope, FormBuilderService, AssetLibraryGridServices, FormListConst,
                                jsInteraction, FormBuilderUploadService, ScriptsConst) {
      scope = $rootScope.$new();
      formBuilderService = FormBuilderService;
      formListConst = FormListConst;
      assetLibraryGridServices = AssetLibraryGridServices;
      formBuilderUploadService = FormBuilderUploadService;
      jsinteraction = jsInteraction;
      scriptsConst = ScriptsConst;
      ctrl = $controller;
    }));

    function initializeCtrl() {
      return ctrl('FormBuilderFileUploadCtrl', {
        FormBuilderService: formBuilderService,
        FormListConst: formListConst,
        FormBuilderUploadService: formBuilderUploadService,
        AssetLibraryGridServices: assetLibraryGridServices,
        jsInteraction: jsinteraction,
        $scope: scope
      });
    }

    it('FormBuilderFileUploadCtrl should set proper values for .efrm file upload', function () {
      ///when the current page is set formlist page then values should be set from FormListConst
      formBuilderService.setCurPage(formListConst.FORM_LIST_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.options.fileType).toEqual(formListConst.FORM_LIST_FILE_EXTENSION);
      expect(newCtrl.options.url).toEqual(formListConst.FORM_LIST_FILE_UPLOAD_URL);
      expect(newCtrl.options.fileTypeIconCss).toEqual(formListConst.FORM_LIST_UPLOAD_FILE_ICON_CSS);
      expect(newCtrl.options.supportedFormatsText).toEqual(formListConst.FORM_LIST_SUPPORTED_FORMAT_TEXT);
      expect(newCtrl.options.maxFileSize).toEqual(formListConst.FORM_LIST_MAX_FILE_SIZE);
      expect(newCtrl.options.fileSizeErrorMessage).toEqual(formListConst.FORM_LIST_UPLOAD_INVALID_FILE_SIZE);

    });

    it('FormBuilderFileUploadCtrl should set proper values for .js file upload ', function () {
      ///when the current page is set to asset library page,
      // i.e other than formlist page then values should be set from AssetLibraryGridServices
      formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.options.fileType).toEqual(assetLibraryGridServices.getFileExtension());
      expect(newCtrl.options.url).toEqual(assetLibraryGridServices.getUploadURL());
      expect(newCtrl.options.fileTypeIconCss).toEqual(assetLibraryGridServices.getFileTypeIcon());
      expect(newCtrl.options.supportedFormatsText).toEqual(assetLibraryGridServices.getSupportText());
      expect(newCtrl.options.maxFileSize).toEqual(assetLibraryGridServices.getFileMaxSize());
      expect(newCtrl.options.fileSizeErrorMessage).toEqual(assetLibraryGridServices.getInvalidFileMsg());
    });

  });

})();
