/**
 * Created by RKarambalkar on 9/7/2015.
 */

(function () {
  'use strict';
  xdescribe('Test for forlist-grid-services', function () {
    var formBuilderUtilityServices, kendoInstance;
    var columns = [
      {
        'field': 'Name'
      },
      {
        'field': 'ModifiedBy'
      },
      {
        'field': 'ModifiedDate'
      },
      {
        'field': 'Description'
      },
      {
        'field': 'Enabled'
      }
    ];
    var spanTag = '<span></span>';
    var mockDiv = '<div class="div-checkmark-image"></div>';
    var fieldValue1 = '1.1';
    var fieldValue2 = '1.2';

    beforeEach(module('elli.encompass.web'));
    //Inject dependencies
    beforeEach(inject(function (FormBuilderUtilityServices, kendo) {
      formBuilderUtilityServices = FormBuilderUtilityServices;
      kendoInstance = kendo;
    }));
    it('Should check compare function when having same fields for return value 0',
      function () {
        var a = {Name: 'A'};
        var b = {Name: 'A'};
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(columns[0].field, columns[0].field);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(0);
      });
    it('Should check compare function when having different fields for return value 1',
      function () {
        var a = {Name: 'B'};
        var b = {Name: 'A'};
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(columns[0].field, columns[0].field);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(1);
      });
    it('Should check compare function when having different fields for return value -1',
      function () {
        var a = {Name: 'A'};
        var b = {Name: 'B'};
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(columns[0].field, columns[0].field);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(-1);
      });
    it('Should check compare function with fieldtype 0 and field1 comparison returns 1',
      function () {
        var field1 = columns[2].field;
        var field2 = columns[3].field;
        var a = {field2: field1};
        var b = {field2: field2};
        a[field1] = field1;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 0);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(1);
      });
    it('Should check compare function with fieldtype 0, and field1 comparison returns -1',
      function () {
        var field1 = columns[3].field;
        var field2 = columns[2].field;
        var a = {field1: field1};
        var b = {field1: field2};
        a[field1] = field1;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 0);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(-1);
      });
    it('Should check compare function with fieldtype 0, and field2 comparison returns 1',
      function () {
        var field1 = columns[2].field;
        var field2 = columns[3].field;
        var a = {field2: field1};
        var b = {field2: field2};
        a[field2] = field1;
        b[field2] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 0);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(1);
      });
    it('Should check compare function with fieldtype 0, and field2 comparison returns -1',
      function () {
        var field1 = columns[3].field;
        var field2 = columns[2].field;
        var a = {field1: field1};
        var b = {field1: field2};
        a[field2] = field1;
        b[field2] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 0);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(-1);
      });
    it('Should check compare function with fieldtype 1, and field2 comparison returns 1',
      function () {
        var field1 = '1420547401';
        var field2 = '1420547400';
        var a = {field2: field1};
        var b = {field2: field2};
        a[field2] = field1;
        b[field2] = field2;
        a[field1] = field2;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 1);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(1);
      });
    it('Should check compare function with fieldtype 1, and field2 comparison returns -1',
      function () {
        var field1 = '1420547400';
        var field2 = '1420547401';
        var a = {field2: field1};
        var b = {field2: field2};
        a[field2] = field1;
        b[field2] = field2;
        a[field1] = field2;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 1);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(-1);
      });
    it('Should check compare function with fieldtype 1 and field1 date comparison returns 1',
      function () {
        var field1 = '1420547401';
        var field2 = '1420547400';
        var a = {field2: field1};
        var b = {field2: field2};
        a[field1] = field1;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 1);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(1);
      });
    it('Should check compare function with fieldtype 1 and field1 date comparison returns -1',
      function () {
        var field1 = '1420547400';
        var field2 = '1420547401';
        var a = {field2: field1};
        var b = {field2: field2};
        a[field1] = field1;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 1);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(-1);
      });
    it('Should check compare function with fieldtype 2 and file size comparison returns 1',
      function () {
        var field1 = fieldValue2;
        var field2 = fieldValue1;
        var a = {field2: field1};
        var b = {field2: field2};
        a[field1] = field1;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 2);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(1);
      });
    it('Should check compare function with fieldtype 2 and file size comparison returns -1',
      function () {
        var field1 = fieldValue1;
        var field2 = fieldValue2;
        var a = {field2: field1};
        var b = {field2: field2};
        a[field1] = field1;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 2);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(-1);
      });
    it('Should check compare function with fieldtype 2 and field2 comparison returns 1',
      function () {
        var field1 = fieldValue2;
        var field2 = fieldValue1;
        var a = {field2: field1};
        var b = {field2: field2};
        a[field2] = field1;
        b[field2] = field2;
        a[field1] = field2;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 2);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(1);
      });
    it('Should check compare function with fieldtype 2 and field2 comparison returns -1',
      function () {
        var field1 = fieldValue1;
        var field2 = fieldValue2;
        var a = {field2: field1};
        var b = {field2: field2};
        a[field2] = field1;
        b[field2] = field2;
        a[field1] = field2;
        b[field1] = field2;
        spyOn(formBuilderUtilityServices, 'compare').and.callThrough();
        formBuilderUtilityServices.compareTest = formBuilderUtilityServices.compare(field1, field2, 2);
        var result = formBuilderUtilityServices.compareTest(a, b);
        expect(result).toEqual(-1);
      });
    it('Should check name template when columnName is undefined',
      function () {
        spyOn(formBuilderUtilityServices, 'nameTemplate').and.callThrough();
        formBuilderUtilityServices.nameTemplateTest = formBuilderUtilityServices.nameTemplate(columns[0].field);
        var result = formBuilderUtilityServices.nameTemplateTest(columns[0].field);
        expect(result).toEqual(spanTag);
      });
    it('Should check name template when columnName is not undefined',
      function () {
        var data = {Name: 'form1', Id: 0};
        var dataResult = '<a href="" ng-click="fbGridCtrl.openFile(\'' + data.Id + '\')" target="_blank"><span ng-bind="dataItem.' +
          columns[0].field + '">' + data.Name + '</span></a>';
        spyOn(formBuilderUtilityServices, 'nameTemplate').and.callThrough();
        formBuilderUtilityServices.nameTemplateTest = formBuilderUtilityServices.nameTemplate(columns[0].field);
        var result = formBuilderUtilityServices.nameTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check description template when columnName is undefined',
      function () {
        spyOn(formBuilderUtilityServices, 'descriptionTemplate').and.callThrough();
        formBuilderUtilityServices.descriptionTemplateTest = formBuilderUtilityServices.descriptionTemplate(columns[0].field);
        var result = formBuilderUtilityServices.descriptionTemplateTest(columns[0].field);
        expect(result).toEqual(spanTag);
      });
    it('Should check description template when columnName is greater than 500',
      function () {
        var data = {
          Name: 'form test form test form test form test form test form test form test form test form test ' +
          'form test form test form test form test form test form test form test form test form test form test form tes' +
          't form test form test form test form test form test form test form test form test form test form test form t' +
          'est form test form test form test form test form test form test form test form test form test form test form' +
          ' test form test form test form test form test form test form test form test form test form test form test fo' +
          'rm test form test'
        };
        var limitedContent = data.Name.substring(0, 500);
        var dataResult = '<span ng-bind="dataItem.' + columns[0].field + '">' + limitedContent + '</span>';
        spyOn(formBuilderUtilityServices, 'descriptionTemplate').and.callThrough();
        formBuilderUtilityServices.descriptionTemplateTest = formBuilderUtilityServices.descriptionTemplate(columns[0].field);
        var result = formBuilderUtilityServices.descriptionTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check description template when columnName is less than 500',
      function () {
        var data = {
          Name: 'form test form test form test form test form test form test form test form test form test'
        };
        var dataResult = '<span ng-bind="dataItem.' + columns[0].field + '">' + data.Name + '</span>';
        spyOn(formBuilderUtilityServices, 'descriptionTemplate').and.callThrough();
        formBuilderUtilityServices.descriptionTemplateTest = formBuilderUtilityServices.descriptionTemplate(columns[0].field);
        var result = formBuilderUtilityServices.descriptionTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check last modified by template when columnName is undefined',
      function () {
        spyOn(formBuilderUtilityServices, 'lastModifiedByTemplate').and.callThrough();
        formBuilderUtilityServices.lastModifiedByTemplateTest = formBuilderUtilityServices.lastModifiedByTemplate(columns[0].field);
        var result = formBuilderUtilityServices.lastModifiedByTemplateTest(columns[0].field);
        expect(result).toEqual('');
      });
    it('Should check last modified by template when columnName is not undefined',
      function () {
        var data = {Name: 'form test '};
        var dataResult = '<span ng-bind="dataItem.' + columns[0].field + '">' + data.Name + '</span>';
        spyOn(formBuilderUtilityServices, 'lastModifiedByTemplate').and.callThrough();
        formBuilderUtilityServices.lastModifiedByTemplateTest = formBuilderUtilityServices.lastModifiedByTemplate(columns[0].field);
        var result = formBuilderUtilityServices.lastModifiedByTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check last modified by template when columnName is undefined',
      function () {
        spyOn(formBuilderUtilityServices, 'lastModifiedByTemplate').and.callThrough();
        formBuilderUtilityServices.lastModifiedDateTemplateTest = formBuilderUtilityServices.lastModifiedDateTemplate(columns[0].field);
        var result = formBuilderUtilityServices.lastModifiedDateTemplateTest(columns[0].field);
        expect(result).toEqual('');
      });
    it('Should check last modified date template for valid ModifiedDate',
      function () {
        var data = {ModifiedDate: '1420547400'};
        var dataResult = kendoInstance.toString(new Date(data.ModifiedDate * 1000), 'G');
        spyOn(formBuilderUtilityServices, 'lastModifiedByTemplate').and.callThrough();
        formBuilderUtilityServices.lastModifiedDateTemplateTest = formBuilderUtilityServices.lastModifiedDateTemplate(columns[2].field);
        var result = formBuilderUtilityServices.lastModifiedDateTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check file size template when columnName is undefined',
      function () {
        spyOn(formBuilderUtilityServices, 'fileSizeTemplate').and.callThrough();
        formBuilderUtilityServices.fileSizeTemplateTest = formBuilderUtilityServices.fileSizeTemplate(columns[0].field);
        var result = formBuilderUtilityServices.fileSizeTemplateTest(columns[0].field);
        expect(result).toEqual(spanTag);
      });
    it('Should check file size template when columnName is not undefined',
      function () {
        var data = {Name: '280'};
        var dataResult = '<span>' + data.Name + '</span>';
        spyOn(formBuilderUtilityServices, 'fileSizeTemplate').and.callThrough();
        formBuilderUtilityServices.fileSizeTemplateTest = formBuilderUtilityServices.fileSizeTemplate(columns[0].field);
        var result = formBuilderUtilityServices.fileSizeTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check enabled template when columnName is undefined',
      function () {
        spyOn(formBuilderUtilityServices, 'enabledTemplate').and.callThrough();
        formBuilderUtilityServices.enabledTemplateTest = formBuilderUtilityServices.enabledTemplate(columns[0].field);
        var result = formBuilderUtilityServices.enabledTemplateTest(columns[0].field);
        expect(result).toEqual(spanTag);
      });
    it('Should check enabled template for enabled value 1',
      function () {
        var data = {Enabled: 1};
        var dataResult = mockDiv;
        spyOn(formBuilderUtilityServices, 'enabledTemplate').and.callThrough();
        formBuilderUtilityServices.enabledTemplateTest = formBuilderUtilityServices.enabledTemplate(columns[4].field);
        var result = formBuilderUtilityServices.enabledTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check enabled template for enabled value true',
      function () {
        var data = {Enabled: true};
        var dataResult = mockDiv;
        spyOn(formBuilderUtilityServices, 'enabledTemplate').and.callThrough();
        formBuilderUtilityServices.enabledTemplateTest = formBuilderUtilityServices.enabledTemplate(columns[4].field);
        var result = formBuilderUtilityServices.enabledTemplateTest(data);
        expect(result).toEqual(dataResult);
      });
    it('Should check enabled template for invalid value of enabled',
      function () {
        var data = {Enabled: 2};
        spyOn(formBuilderUtilityServices, 'enabledTemplate').and.callThrough();
        formBuilderUtilityServices.enabledTemplateTest = formBuilderUtilityServices.enabledTemplate(columns[4].field);
        var result = formBuilderUtilityServices.enabledTemplateTest(data);
        expect(result).toEqual(spanTag);
      });
  });
})();
