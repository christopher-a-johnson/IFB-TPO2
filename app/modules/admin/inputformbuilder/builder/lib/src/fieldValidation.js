elli.builder.validationUpdate = (function () {
  'use strict';

  var validationCheck = {};

  var builder = elli.builder,
    workspace = builder.workspace;

  validationCheck.validateInputMeasurement = function (inputData, fieldLabel) {

    var regExp = new RegExp('^[0-9]*$');
    var alertArray = [];
    var unitOfMeasurement = 'px';
    var i, len;
    for (i = 0, len = inputData.length; i < len; i++) {
      var unitCheck = inputData[i].slice(-2).toLowerCase();
      var refinedText = inputData[i].slice(0, -2);
      var regExTest = true;
      regExTest = (unitCheck === unitOfMeasurement) ? regExp.test(refinedText) : regExp.test(inputData[i]);
      if (regExTest === false) {

        alertArray.push(fieldLabel[i]);
      }
    }
    if (alertArray.length > 0) {
      var alertString = alertArray.join(', ') + ' ' + 'invalid value please enter whole number with optional unit ' + unitOfMeasurement;
      window.alert(alertString);
      return false;
    }
    return true;
  };

  validationCheck.validateControlID = function (ctrlIdInput, ctrlGuid) {
    var regExp = new RegExp('^[a-zA-Z][a-zA-Z0-9-_]{1,34}?$'),
      regValid = regExp.test(ctrlIdInput),
      isValid;
    if (regValid === true && ctrlIdInput !== '') {
      isValid = true;
    }
    else {
      isValid = false;
    }
    //Validation for duplicate control ID
    var ctrlCount, totalControlsOnWorkspace = workspace.controls();

    for (ctrlCount = 0; ctrlCount < totalControlsOnWorkspace.length; ctrlCount++) {
      if ((totalControlsOnWorkspace[ctrlCount].controlId === ctrlIdInput) && totalControlsOnWorkspace[ctrlCount].cid !== ctrlGuid) {
        isValid = false;
        //TODO: Display error message for same control Id here
      }
      else if (totalControlsOnWorkspace[ctrlCount].cid === ctrlGuid && ctrlIdInput && isValid) {
        var ctrl = workspace.getControlById(totalControlsOnWorkspace[ctrlCount].controlId);
        workspace.removeControl(totalControlsOnWorkspace[ctrlCount].controlId);
        totalControlsOnWorkspace[ctrlCount].controlId = ctrlIdInput;
        workspace.updateControls(ctrl, ctrlIdInput, false);
        isValid = true;
      }
    }
    return isValid;
  };

  validationCheck.validateInputTextMeasurement = function (inputData, fieldLabel, inputBox) {
    var regExp = new RegExp('^[0-9]*$');
    var alertArray = [];
    var unitOfMeasurement = 'px';
    var i, len;
    for (i = 0, len = inputData.length; i < len; i++) {
      var unit = inputData[i].slice(-2);
      if (!unit.number && unit !== unitOfMeasurement) {
        if (inputData[i] && !regExp.test(inputData[i])) {
          alertArray.push(fieldLabel[i]);
        }
      }
    }
    if (alertArray.length > 0) {
      return false;
    }
    if (inputBox) {

      return (inputData[0] < 41);

    }
    return true;
  };

  return validationCheck;

})();
