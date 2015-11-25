(function () {
  'use strict';
  /**
   * Service to handle all the alert, error, warning message boxes in NGEN front end
   */
  angular.module('modalServiceModule', []);

  angular.module('modalServiceModule').service('modalService', function () {
    /* This method displays a modal window and is called from various modules(controllers) */
    this.showModalDialog = function (type, message, width, height, title) {

      if (type === 'warning') {
        this.showWarningDialog(message, width, height, title);
      } else if (type === 'error') {
        this.showErrorDialog(message, width, height, title);
      } else if (type === 'confirm') {
        this.showConfirmDialog(message, width, height, title);
      } else {
        this.showDefaultDialog(message, width, height, title);
      }
    };

    /* This method displays a warning window */
    this.showWarningDialog = function (message, width, height, title) {
      // TODO: Below is the format to be used to pass a templateHTML to the service, this should be extended and used when enabling customized windows
      var warningHtml =
        '<div id="myModalWindow"> ' +
        ' <div style="text-align: center; width:100%"> ' +
        '<br>' + '<table>' + '<tr>' + '<td>' +
        '<div style="margin:10px 0 15px 0" align="left">' +
        '<img src="images/warning_2.png"/>' +
        '</div>' + '</td>' + '<td>' + '</td>' + '<td>' +
        '<div align="left">' + message + '</div>' + '</td>' +
        '</tr>' + '</table>' +
        '<div align="right">' +
        '<button class="btn btn-default" id="okButton">' + 'OK</button> ' + '</div>' +
        '</div> ' +
        '</div> ';

      var windowTitle = 'Encompass';

      /* jshint: -W117 */
      $('body').append(warningHtml);
      var windowWidth = '550';
      var windowHeight = '150';
      if (width !== null) {
        windowWidth = width;
      }
      if (height !== null) {
        windowHeight = height;
      }
      if (title !== null) {
        windowTitle = title;
      }

      var windowDiv = $('#myModalWindow');

      windowDiv.kendoWindow({
        width: windowWidth,
        height: windowHeight,
        title: windowTitle,
        actions: ['Close'],
        close: onClose,
        visible: false,
        modal: true
      }).data('kendoWindow').center().open();

      var modaldialog = windowDiv.data('kendoWindow');

      $('#okButton').click(function (e) {
        modaldialog.destroy();
      });

      function onClose(e) {
        modaldialog.destroy();
      }

    };

    /* This method displays a error window */
    this.showErrorDialog = function (message, width, height, title) {
      // add code to display error dialog
    };
    /* This method displays a confirm window */
    this.showConfirmDialog = function (message, width, height, title) {
      //  add code to display confirm dialog
    };
    /* This method displays a default window */
    this.showDefaultDialog = function (message, width, height, title) {
      // add code to display a standard default message dialog
    };
  });
})();
