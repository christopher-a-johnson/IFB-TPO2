(function () {
  'use strict';
  describe('Formbuilder assets service', function () {
    var assetLibraryGridServices, imagesConst, scriptsConst, stylesConst, formBuilderService, formListConst;
    //In current environment Url is pointing to service need to point to json file
    var dataResponse = [{
      FileSize: '50KB',
      Id: '1',
      LastModifiedBy: 'Joe Smith',
      LastModifiedDateTime: '1410547455',
      Public: 1,
      Title: 'Logo 1',
      Used: true
    },
      {
        FileSize: '50KB',
        Id: '2',
        LastModifiedBy: 'Joe Smith',
        LastModifiedDateTime: '1420547400',
        Public: 1,
        Title: 'Logo 1',
        Used: true
      }
    ];
    var columnResponse = [{
      field: 'Title',
      title: 'Name',
      width: 200
    },
      {
        field: 'FileSize',
        freeze: false,
        title: 'File Size'
      },
      {
        field: 'Public',
        title: ' Externally Available '
      },
      {
        field: 'LastModifiedBy',
        title: 'Modified By'
      },
      {
        field: 'LastModifiedDateTime',
        title: 'Date Modified'
      },
      {
        field: 'Id',
        hidden: true
      },
      {
        field: 'Description',
        title: 'Description'
      }
    ];
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ImagesConst, AssetLibraryGridServices,
                                ScriptsConst, StylesConst, FormBuilderService, FormListConst) {
      imagesConst = ImagesConst;
      assetLibraryGridServices = AssetLibraryGridServices;
      scriptsConst = ScriptsConst;
      stylesConst = StylesConst;
      formBuilderService = FormBuilderService;
      formListConst = FormListConst;
    }));

    describe('Function getDataApi tests', function () {
      it('Should check dataApi return value is equal to  imagesGridData when current page is set to images',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var dataApi = assetLibraryGridServices.getDataApi();
          expect(dataApi).toEqual('imagesGridData');
        }));
      it('Should check dataApi return value is equal to scriptsGridData when current page is set to scripts ',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var dataApi = assetLibraryGridServices.getDataApi();
          expect(dataApi).toEqual('scriptsGridData');
        }));
      it('Should check dataApi return value is equal to stylesGridData when current page is set to style ',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var dataApi = assetLibraryGridServices.getDataApi();
          expect(dataApi).toEqual('stylesGridData');
        }));
    });

    describe('Function set getColumnsApi ', function () {
      var columnsApi;
      it('Should check columnsApi return value is equal to imagesGridColumns when current page is set to images',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          columnsApi = assetLibraryGridServices.getColumnsApi();
          expect(columnsApi).toEqual('imagesGridColumns');
        }));
      it('Should check columnsApi return value is equal to scriptsGridColumns when current page is set to scripts',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          columnsApi = assetLibraryGridServices.getColumnsApi();
          expect(columnsApi).toEqual('scriptsGridColumns');
        }));
      it('Should check columnsApi return value is equal to stylesGridColumns when current page is set to style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          columnsApi = assetLibraryGridServices.getColumnsApi();
          expect(columnsApi).toEqual('stylesGridColumns');
        }));
    });

    describe('Function getImportButtonName returns importButtonName ', function () {
      var importButtonName;
      it('Should be equal to Images Import Button when current page is set to images',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          importButtonName = assetLibraryGridServices.getImportButtonName();
          expect(importButtonName).toEqual(imagesConst.IMAGES_IMPORT_BUTTON);
        }));
      it('Should be equal to Scripts Import Button when current page is set to scripts',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          importButtonName = assetLibraryGridServices.getImportButtonName();
          expect(importButtonName).toEqual(scriptsConst.SCRIPTS_IMPORT_BUTTON);
        }));
      it('Should be equal to Styles Import Button when current page is set to style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          importButtonName = assetLibraryGridServices.getImportButtonName();
          expect(importButtonName).toEqual(stylesConst.STYLES_IMPORT_BUTTON);
        }));
    });

    describe('Function set getUploadURL returns uploadURL', function () {
      var uploadURL;
      it('Should be equal to Image constant file upload url when current page is set to images',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          uploadURL = assetLibraryGridServices.getUploadURL();
          expect(uploadURL).toEqual(imagesConst.IMAGE_FILE_UPLOAD_URL);
        }));
      it('Should be equal to Script constant file upload url when current page is set to scripts',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          uploadURL = assetLibraryGridServices.getUploadURL();
          expect(uploadURL).toEqual(scriptsConst.SCRIPTS_FILE_UPLOAD_URL);
        }));
      it('Should be equal to Styles constant file upload url when current page is set to style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          uploadURL = assetLibraryGridServices.getUploadURL();
          expect(uploadURL).toEqual(stylesConst.STYLES_FILE_UPLOAD_URL);
        }));
    });

    describe('Function set getSupportText returns supportText ', function () {
      var supportText;
      it('Should be equal to Images constant Supported images format text when current page is set to images',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          supportText = assetLibraryGridServices.getSupportText();
          expect(supportText).toEqual(imagesConst.SUPPORTED_IMAGES_FORMAT_TEXT);
        }));
      it('Should be equal to Scripts constant Supported scripts format text  when current page is set to scripts',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          supportText = assetLibraryGridServices.getSupportText();
          expect(supportText).toEqual(scriptsConst.SUPPORTED_SCRIPTS_FORMAT_TEXT);
        }));
      it('Should be equal to Styles constant Supported styles format text  when current page is set to style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          supportText = assetLibraryGridServices.getSupportText();
          expect(supportText).toEqual(stylesConst.SUPPORTED_STYLES_FORMAT_TEXT);
        }));
    });

    describe('Function getFooterPagingMessage returns footerPagingMessage', function () {
      var footerPagingMessage;
      it('Should be equal to images when current page is set to images',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          footerPagingMessage = assetLibraryGridServices.getFooterPagingMessage();
          expect(footerPagingMessage).toEqual(imagesConst.IMAGES_LIST_PAGING_MSG);
        }));
      it('Should be equal to files when current page is set to scripts',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          footerPagingMessage = assetLibraryGridServices.getFooterPagingMessage();
          expect(footerPagingMessage).toEqual(scriptsConst.SCRIPTS_LIST_PAGING_MSG);
        }));
      it('Should be equal to files when current page is set to style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          footerPagingMessage = assetLibraryGridServices.getFooterPagingMessage();
          expect(footerPagingMessage).toEqual(stylesConst.STYLES_LIST_PAGING_MSG);
        }));
    });

    describe('Function sortDefault', function () {
      it('function sortDefault should return data with sorted order',
        inject(function () {
          assetLibraryGridServices.sortDefault(dataResponse);
          expect(dataResponse[0].Id).toEqual('2');
        }));

    });
    describe('Function getAssetLibPage ', function () {
      it('Should return true',
        inject(function () {
          var result = assetLibraryGridServices.getAssetLibPage();
          expect(result).toEqual(true);
        }));
      it('Should return false',
        inject(function () {
          var result = assetLibraryGridServices.getListPage();
          expect(result).toEqual(false);
        }));
    });

    describe('Function getFileExtension returns fileExtension', function () {
      it('Should be equal to images constant image file extension when getFileExtension gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var fileExtension = assetLibraryGridServices.getFileExtension();
          expect(fileExtension).toEqual(imagesConst.IMAGE_FILE_EXTENSION);
        }));
      it('Should be equal to scripts constant scripts file extension when getFileExtension gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var fileExtension = assetLibraryGridServices.getFileExtension();
          expect(fileExtension).toEqual(scriptsConst.SCRIPTS_FILE_EXTENSION);
        }));
      it('Should be equal to styles constant scripts file extension when getFileExtension gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var fileExtension = assetLibraryGridServices.getFileExtension();
          expect(fileExtension).toEqual(stylesConst.STYLES_FILE_EXTENSION);
        }));
    });

    describe('Function getFileTypeIcon returns fileTypeIcon', function () {
      it('Should be equal to images constant image upload file icon css when getFileTypeIcon gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var fileTypeIcon = assetLibraryGridServices.getFileTypeIcon();
          expect(fileTypeIcon).toEqual(imagesConst.IMAGE_UPLOAD_FILE_ICON_CSS);
        }));
      it('Should be equal to scripts constant scripts upload file icon css when getFileTypeIcon gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var fileTypeIcon = assetLibraryGridServices.getFileTypeIcon();
          expect(fileTypeIcon).toEqual(scriptsConst.SCRIPTS_UPLOAD_FILE_ICON_CSS);
        }));
      it('Should be equal to styles constant styles upload file icon css when getFileTypeIcon gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var fileTypeIcon = assetLibraryGridServices.getFileTypeIcon();
          expect(fileTypeIcon).toEqual(stylesConst.STYLES_UPLOAD_FILE_ICON_CSS);
        }));
    });

    describe('Function getFileMaxSize returns fileMaxSize', function () {
      it('Should be equal to images constant images max file size when getFileMaxSize gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var fileMaxSize = assetLibraryGridServices.getFileMaxSize();
          expect(fileMaxSize).toEqual(imagesConst.IMAGE_MAX_FILE_SIZE);
        }));
      it('Should be equal to scripts constant scripts max file size when getFileMaxSize gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var fileMaxSize = assetLibraryGridServices.getFileMaxSize();
          expect(fileMaxSize).toEqual(scriptsConst.SCRIPTS_MAX_FILE_SIZE);
        }));
      it('Should be equal to styles constant styles max file size when getFileMaxSize gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var fileMaxSize = assetLibraryGridServices.getFileMaxSize();
          expect(fileMaxSize).toEqual(stylesConst.STYLES_MAX_FILE_SIZE);
        }));
    });

    describe('Function getInvalidFileMsg returns invalidFileSizeMsg', function () {
      it('Should be equal to images constant upload invalid file size when getInvalidFileMsg gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var invalidFileSizeMsg = assetLibraryGridServices.getInvalidFileMsg();
          expect(invalidFileSizeMsg).toEqual(imagesConst.IMAGE_UPLOAD_INVALID_FILE_SIZE);
        }));
      it('Should be equal to scripts constant upload invalid file size when getInvalidFileMsg gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var invalidFileSizeMsg = assetLibraryGridServices.getInvalidFileMsg();
          expect(invalidFileSizeMsg).toEqual(scriptsConst.SCRIPTS_UPLOAD_INVALID_FILE_SIZE);
        }));
      it('Should be equal to styles constant upload invalid file size when getInvalidFileMsg gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var invalidFileSizeMsg = assetLibraryGridServices.getInvalidFileMsg();
          expect(invalidFileSizeMsg).toEqual(stylesConst.STYLES_UPLOAD_INVALID_FILE_SIZE);
        }));
    });

    describe('Function getExcludeCols returns excludeCols', function () {
      it('Should be equal to images constant upload invalid file size when getExcludeCols gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var excludeCols = assetLibraryGridServices.getExcludeCols();
          expect(excludeCols).toEqual(imagesConst.IMAGE_FILTER_EXCLUDE_COLS);
        }));
      it('Should be equal to scripts constant upload invalid file size when getExcludeCols gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var excludeCols = assetLibraryGridServices.getExcludeCols();
          expect(excludeCols).toEqual(scriptsConst.SCRIPTS_FILTER_EXCLUDE_COLS);
        }));
      it('Should be equal to styles constant upload invalid file size when getExcludeCols gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var excludeCols = assetLibraryGridServices.getExcludeCols();
          expect(excludeCols).toEqual(stylesConst.STYLES_FILTER_EXCLUDE_COLS);
        }));
    });

    describe('Function getMinFilterLength returns minFilterLength', function () {
      it('Should be equal to images constant images min filter length when getMinFilterLength gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var minFilterLength = assetLibraryGridServices.getMinFilterLength();
          expect(minFilterLength).toEqual(imagesConst.IMAGE_MIN_FILTER_LENGTH);
        }));
      it('Should be equal to scripts constant scripts min filter length when getMinFilterLength gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var minFilterLength = assetLibraryGridServices.getMinFilterLength();
          expect(minFilterLength).toEqual(scriptsConst.SCRIPTS_MIN_FILTER_LENGTH);
        }));
      it('Should be equal to styles constant styles min filter length when getMinFilterLength gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var minFilterLength = assetLibraryGridServices.getMinFilterLength();
          expect(minFilterLength).toEqual(stylesConst.STYLES_MIN_FILTER_LENGTH);
        }));
    });

    describe('Function getPageSize returns pageSize', function () {
      it('Should be equal to images constant image page size when getPageSize gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var pageSize = assetLibraryGridServices.getPageSize();
          expect(pageSize).toEqual(imagesConst.IMAGE_PAGE_SIZE);
        }));
      it('Should be equal to scripts constant scripts page size when getPageSize gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var pageSize = assetLibraryGridServices.getPageSize();
          expect(pageSize).toEqual(scriptsConst.SCRIPTS_PAGE_SIZE);
        }));
      it('Should be equal to styles constant styles page size when getPageSize gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var pageSize = assetLibraryGridServices.getPageSize();
          expect(pageSize).toEqual(stylesConst.STYLES_PAGE_SIZE);
        }));
    });

    describe('Function getPageNumber returns pageNumber', function () {
      it('Should be equal to images constant image page number when getPageNumber gets called for image',
        inject(function () {
          formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
          var pageNumber = assetLibraryGridServices.getPageNumber();
          expect(pageNumber).toEqual(imagesConst.IMAGE_PAGE_NUMBER);
        }));
      it('Should be equal to scripts constant scripts page number when getPageNumber gets called for script',
        inject(function () {
          formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
          var pageNumber = assetLibraryGridServices.getPageNumber();
          expect(pageNumber).toEqual(scriptsConst.SCRIPTS_PAGE_NUMBER);
        }));
      it('Should be equal to styles constant styles page number when getPageNumber gets called for style',
        inject(function () {
          formBuilderService.setCurPage(stylesConst.STYLES_PAGE);
          var pageNumber = assetLibraryGridServices.getPageNumber();
          expect(pageNumber).toEqual(stylesConst.STYLES_PAGE_NUMBER);
        }));
    });

    describe('Function sortGridData returns templates ', function () {
      beforeEach(inject(function (FormBuilderUtilityServices) {
        spyOn(FormBuilderUtilityServices, 'compare');

      }));
      it('Should be equal to lastModifiedByTemplate when one of the field equals lastModifiedBy',
        inject(function (FormBuilderUtilityServices) {
          spyOn(FormBuilderUtilityServices, 'lastModifiedByTemplate');
          assetLibraryGridServices.sortGridData(columnResponse);
          expect(FormBuilderUtilityServices.lastModifiedByTemplate).toHaveBeenCalled();
          expect(FormBuilderUtilityServices.compare).toHaveBeenCalled();
        }));
      it('Should be equal to nameTemplate when one of the field equals Title ',
        inject(function (FormBuilderUtilityServices) {
          spyOn(FormBuilderUtilityServices, 'nameTemplate');
          assetLibraryGridServices.sortGridData(columnResponse);
          expect(FormBuilderUtilityServices.nameTemplate).toHaveBeenCalled();
          expect(FormBuilderUtilityServices.compare).toHaveBeenCalled();
        }));
      it('Should be equal to lastModifiedDateTemplate when one of the field equals LastModifiedDateTime ',
        inject(function (FormBuilderUtilityServices) {
          spyOn(FormBuilderUtilityServices, 'lastModifiedDateTemplate');
          assetLibraryGridServices.sortGridData(columnResponse);
          expect(FormBuilderUtilityServices.lastModifiedDateTemplate).toHaveBeenCalled();
          expect(FormBuilderUtilityServices.compare).toHaveBeenCalled();
        }));
      it('Should be equal to fileSizeTemplate when one of the field equals FileSize ',
        inject(function (FormBuilderUtilityServices) {
          spyOn(FormBuilderUtilityServices, 'fileSizeTemplate');
          assetLibraryGridServices.sortGridData(columnResponse);
          expect(FormBuilderUtilityServices.fileSizeTemplate).toHaveBeenCalled();
          expect(FormBuilderUtilityServices.compare).toHaveBeenCalled();
        }));
      it('enabledTemplate should have been called as one of the field equals Public ',
        inject(function (FormBuilderUtilityServices) {
          spyOn(FormBuilderUtilityServices, 'enabledTemplate');
          assetLibraryGridServices.sortGridData(columnResponse);
          expect(FormBuilderUtilityServices.enabledTemplate).toHaveBeenCalled();
          expect(FormBuilderUtilityServices.compare).toHaveBeenCalled();
        }));
      it('Should be equal to descriptionTemplate when one of the field equals Description ',
        inject(function (FormBuilderUtilityServices) {
          spyOn(FormBuilderUtilityServices, 'descriptionTemplate');
          assetLibraryGridServices.sortGridData(columnResponse);
          expect(FormBuilderUtilityServices.descriptionTemplate).toHaveBeenCalled();
          expect(FormBuilderUtilityServices.compare).toHaveBeenCalled();
        }));

    });
  });
}());
