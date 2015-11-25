(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').factory('FormBuilderGridData', FormBuilderGridData);

  /* @ngInject */
  function FormBuilderGridData(Restangular, ENV, ngenRestfulServices, FormListConst, FormBuilderDataStore, _, sessionManagement) {
    var restangular = Restangular.withConfig(function (Configurer) {
      Configurer.setBaseUrl('/api/fb');
      Configurer.setRequestSuffix('.json');
    });

    return {
      resolveDataPromise: function (data) {
        var dataPromise;
        //Check if current page is formlist then get data from restful api rather than hardcoded
        if (data === FormListConst.FORM_LIST_API) {
          //Get session id from session management wrapper
          var sessionId = sessionManagement.getSessionId();
          //Set base url for api
          var restfulServices = ngenRestfulServices.setBaseURL(ENV.osbRestURL, sessionId);
          //Call restful wrapper api
          dataPromise = restfulServices.getAll(data).then(function (newPromise) {
            //Check if api is returning a valid data
            if (newPromise.body().data() && newPromise.body().data().GetInputFormsResponse) {
              return newPromise.body().data().GetInputFormsResponse.InputForms.InputForm;
            }
          });
        }
        else {
          dataPromise = restangular.all(data).getList().then(function (response) {
            //Return to controller for further processing
            return response;
          });
        }
        return dataPromise;
      },

      //NGENY-1944: Example to use restful services to retrieve a list of forms (NGENY-28)
      //Session Management Wrapper
      // var sessionId = IFB_NAMESPACE.sessionmanagement.getSessionId();
      //var restfulServices = ngenRestfulServices.setBaseURL(ENV.restURL, sessionId);
      //resolveDataPromise: function (data) {
      // var payload = {
      // 'InputFormId': '55a7f4f1790fa64aa8481aae',
      // 'InputFormName': 'Form 15'
      // };
      //  var dataPromise = restfulServices.post('inputformbuilder/getinputform', payload).then(function (newPromise) {
      //  var dataPromise = restfulServices.getAll('inputformbuilder/formsmetadata').then(function (newPromise) {
      //    /*used to get data for post*/console.log('GET RESPONSE DATA: ' + JSON.stringify(newPromise.body()));
      //    /*used to get data for get*/console.log('GET RESPONSE DATA: ' + JSON.stringify(newPromise.body().data()));
      //    return newPromise;
      //  });
      //
      //  return dataPromise;
      //},

      resolveColumnPromise: function (columnsApi) {
        var columnPromise = restangular.all(columnsApi).getList().then(function (response) {
          var columns = response[0].columns;
          var gridColumns = [];
          for (var c = 0; c < columns.length; c++) {
            gridColumns.push(columns[c]);
          }
          angular.copy(gridColumns, FormBuilderDataStore.FormBuilderGridData.data.columns);
          angular.copy(mapSchema(response[0].schema), FormBuilderDataStore.FormBuilderGridData.data.schema);

          function mapSchema(schema) {
            var gridSchema = {};
            gridSchema.fields = {};
            _.each(schema.fields, function (fValue) {
              gridSchema[fValue.field] = {type: fValue.params.type};
            });
            return gridSchema;
          }

          //Return to controller for further processing
          return columns;
        });

        return columnPromise;
      }
    };
  }
}());
