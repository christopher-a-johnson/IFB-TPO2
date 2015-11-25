var encompass = encompass || {};
if (encompass && !encompass.interaction) {
  //////////////////////////////////////////////////////////////////////////////////////////////
  // Class:            interaction
  // Description:      jasvscript used to interact with Encompass.
  // Additional Notes:
  //////////////////////////////////////////////////////////////////////////////////////////////
  encompass.interaction = function () {
    //////////////////////////////////////////////////////////////////////////////////////////////
    function doCallBack(resp, callback) {
      if (callback && typeof (callback) == "function") {
        callback(resp);
      }
    };

    //////////////////////////////////////////////////////////////////////////////////////////////
    return {
      //////////////////////////////////////////////////////////////////////////////////////////////
      // start privileged methods
      //////////////////////////////////////////////////////////////////////////////////////////////

      /// <summary>getSessionId</summary>
      getSessionId: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpSessionManager.GetSessionId", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>writeLog</summary>
      writeLog: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpLogging.WriteLog", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>setHelpTargetName</summary>
      setHelpTargetName: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpHelp.SetHelpTargetName", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>openBusinessRuleFindFieldDialog</summary>
      openBusinessRuleFindFieldDialog: function (jsonParams, callback) {
        if (!jsonParams) {
          jsonParams = "{ HideAccessRight: true, HelpTag: '', IsSingleSelection: true, EnableButtonSelection: true}";
        }
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpBusinessRuleFindFieldDialog.ShowDialog", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>openFieldSearchRuleEditor</summary>
      openFieldSearchRuleEditor: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpFieldSearchRuleEditor.OpenEditor", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>setMenuState</summary>
      setMenuState: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpCommon.SetMenuState", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>createNewLoan</summary>
      createNewLoan: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.CreateNewLoan", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>openLoanMailbox</summary>
      openLoanMailbox: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.OpenLoanMailbox", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>selectField</summary>
      selectField: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.SelectField", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>importLoans</summary>
      importLoans: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.ImportLoans", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>rebuildLoan</summary>
      rebuildLoan: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.RebuildLoan", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>openLoan</summary>
      openLoan: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.OpenLoan", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>processEPassUrl</summary>
      processEPassUrl: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.ProcessEPassUrl", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>openLoanForm</summary>
      openLoanForm: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.OpenLoanForm", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>showLockConfirmation</summary>
      showLockConfirmation: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.ShowLockConfirmation", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>startConversation</summary>
      startConversation: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.StartConversation", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>exportToExcel</summary>
      exportToExcel: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpCommon.ExportToExcel", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>print</summary>
      print: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpCommon.Print", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>printForms</summary>
      printForms: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.PrintForms", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>setLoanGuids</summary>
      setLoanGuids: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.SetLoanGuids", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>setThinPipelineInfos</summary>
      setThinPipelineInfos: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.SetThinPipelineInfos", jsonParams);
        doCallBack(resp, callback);
      },

      /// OBSOLETE!!! DON'T USE IT!!! Please use setPipelineViewXml instead.
      /// <summary>setPipelineView</summary>
      setPipelineView: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.SetPipelineView", jsonParams);
        doCallBack(resp, callback);
      },

      /// This is a generic function, Pipeline refers not only to loan pipeline,
      /// but also to trade pipeline, security trade pipeline, etc.
      /// <summary>setPipelineViewXml</summary>
      setPipelineViewXml: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpCommon.SetPipelineViewXml", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>transferLoans</summary>
      transferLoans: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.TransferLoans", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>notifyUsers</summary>
      notifyUsers: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.NotifyUsers", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>duplicateLoan</summary>
      duplicateLoan: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.DuplicateLoan", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>eFolderExport</summary>
      eFolderExport: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.eFolderExport", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>investorStandardExportPipeline</summary>
      investorStandardExportPipeline: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.InvestorStandardExportPipeline", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>exportFannieMaeFormattedFile</summary>
      exportFannieMaeFormattedFile: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.ExportFannieMaeFormattedFile", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>exportLEFPipeline</summary>
      exportLEFPipeline: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.ExportLEFPipeline", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>generateNMLSReport</summary>
      generateNMLSReport: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.GenerateNMLSReport", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>generateNMLSReport</summary>
      generateNCMLDReport: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.GenerateNCMLDReport", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>createAppointment</summary>
      createAppointment: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpPipeline.CreateAppointment", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>setTradingScreen</summary>
      setTradingScreen: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpTrading.SetTradingScreen", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>setTradingScreen</summary>
      setCurrentOrArchived: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpTrading.SetCurrentOrArchived", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>setTradingIds</summary>
      setTradingIds: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpTrading.SetTradingIds", jsonParams);
        doCallBack(resp, callback);
      },

      /// <summary>selectBusinessContact</summary>
      selectBusinessContact: function (jsonParams, callback) {
        var command = window.external.CreateCommand("OpenDialogCommand");
        var resp = command.Execute("OpTrading.SelectBusinessContact", jsonParams);
        doCallBack(resp, callback);
      }
      //////////////////////////////////////////////////////////////////////////////////////////////
      // end privileged methods
      //////////////////////////////////////////////////////////////////////////////////////////////
    }
  }();
}
else {
  throw ("One or more encompass namepaces don't exist or already defined.  Unable to initialize encompass.interaction namespace.");
}
