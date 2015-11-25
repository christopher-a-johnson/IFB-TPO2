/**
 * Module to manage lifecycle of kendo window widget
 * To add model popup to ngen application create a factory method and add configuration logic in it
 * Following factory functions should be reused for common purpose
 * :showInformationPopup - To display information modal popup with custom message and title
 * :showWarningPopup - To display warning modal popup with custom message and title
 * :showErrorPopup - To display error modal popup with custom message and title
 * Since controllerName is passed dynamically, view should not include ng-controller directive
 */

(function () {
  'use strict';

  angular.module('elli.encompass.web.shared').factory('modalWindowService', modalWindowService);

  /* @ngInject */
  function modalWindowService($kWindow, $timeout, encompass, _) {
    var errorModalHandle;
    var warningModalHandle;
    var confirmationModalHandle;
    var moveToFolderHandle;
    var manageViewModalHandle;
    var duplicateViewHandle;
    var renameViewHandle;
    var deleteLoanHandle;
    var rebuildLoanPropertiesHandle;
    var loanAlertViewHandle;
    var savePipelineViewHandle;
    var loanMessagesViewHandle;
    var TPOCompaniesHandle;
    var addFieldHandle;

    var service = {
      showWarningPopup: function (message, title, icontype) {
        warningModalHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 403,
          animation: false,
          templateUrl: 'shared/views/warning-popup.html',
          controller: 'WarningModalController as vm',
          close: function () {
            service.closeWarningModalWindow(true);
          },
          resolve: {
            customMessage: function () {
              return message;
            },
            popupIcon: function () {
              return icontype;
            }
          }
        });
        return warningModalHandle;
      },
      closeWarningModalWindow: function (result) {
        if (typeof warningModalHandle !== 'undefined' && warningModalHandle !== null) {
          warningModalHandle.close(result);
          warningModalHandle = null;
        }
      },
      showErrorPopup: function (message, title, icontype) {
        if (typeof errorModalHandle === 'undefined' || errorModalHandle === null) {
          errorModalHandle = $kWindow.open({
            modal: true,
            title: title,
            resizable: false,
            width: 350,
            animation: false,
            templateUrl: 'shared/views/error-popup.html',
            controller: 'ErrorModalController as vm',
            close: function () {
              service.closeErrorModalWindow(true);
            },
            resolve: {
              customMessage: function () {
                return message;
              },
              popupIcon: function () {
                return icontype;
              }
            }
          });
        }
        return errorModalHandle;
      },
      closeErrorModalWindow: function (result) {
        if (typeof errorModalHandle !== 'undefined' && errorModalHandle !== null) {
          // errorModalHandle = 'undefined';
          errorModalHandle.close(result);
          errorModalHandle = null;

        }
      },
      showConfirmationPopup: function (message, title, icontype) {
        confirmationModalHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 'auto',
          maxWidth: 403,
          minWidth: 220,
          animation: false,
          templateUrl: 'shared/views/confirm-modal-popup.html',
          controller: 'ConfirmationModalController as vm',
          close: function () {
            service.closeConfirmationWindow(true);
          },
          resolve: {
            customMessage: function () {
              return message;
            },
            popupIcon: function () {
              return icontype;
            }
          }
        });
        return confirmationModalHandle;
      },
      closeConfirmationWindow: function (result) {
        if (typeof confirmationModalHandle !== 'undefined' && confirmationModalHandle !== null) {
          confirmationModalHandle.close(result);
          confirmationModalHandle = null;
        }
      },
      showDeleteLoanPopup: function (title) {
        if (typeof deleteLoanHandle === 'undefined' || deleteLoanHandle === null) {
          deleteLoanHandle = $kWindow.open({
            modal: true,
            title: title,
            width: 'auto',
            minWidth: 220,
            maxWidth: 403,
            animation: false,
            resizable: false,
            templateUrl: 'shared/views/confirm-modal-popup.html',
            controller: 'LoanDeleteController as vm',
            open: function () {
              this.wrapper.addClass('ngen-message-popup');
            },
            close: function () {
              service.closeDeleteLoanWindow();
            }
          });
          return deleteLoanHandle;
        }
      },
      closeDeleteLoanWindow: function () {
        if (typeof deleteLoanHandle !== 'undefined' && deleteLoanHandle !== null) {
          deleteLoanHandle.close();
          deleteLoanHandle = null;
        }
      },
      showMoveToFolderPopup: function (title) {
        if (typeof moveToFolderHandle === 'undefined' || moveToFolderHandle === null) {
          moveToFolderHandle = $kWindow.open({
            modal: true,
            title: title,
            width: 403,
            animation: false,
            resizable: false,
            templateUrl: 'modules/pipeline/views/move-folder.html',
            controller: 'MoveFolderController as vm',
            close: function () {
              service.closeMoveToFolderWindow();
            }
          });
          encompass.setHelpTargetName('{HelpTargetName: "MoveDialog"}', '');
          return moveToFolderHandle;
        }
      },
      closeMoveToFolderWindow: function () {
        if (typeof moveToFolderHandle !== 'undefined' && moveToFolderHandle !== null) {
          moveToFolderHandle.close();
          moveToFolderHandle = null;
          encompass.setHelpTargetName('{HelpTargetName: "PipelinePage"}', '');
        }
      },
      showManageView: function () {
        manageViewModalHandle = $kWindow.open({
          modal: true,
          title: 'Manage Views',
          width: 544,
          height: 412,
          animation: false,
          resizable: false,
          templateUrl: 'modules/pipeline/views/pipeline-manage-view.html',
          controller: 'PipelineManageViewController as vm',
          close: function () {
            service.closeManageView();
          },
          activate: function () {
            var close = angular.element('button[name=close]');
            close.focus();
          }
        });
        return manageViewModalHandle;
      },
      closeManageView: function () {
        if (typeof manageViewModalHandle !== 'undefined' && manageViewModalHandle !== null) {
          manageViewModalHandle.close();
        }
      },
      showDuplicateViewPopup: function (message, title) {
        duplicateViewHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 403,
          animation: false,
          templateUrl: 'modules/pipeline/views/rename-manage-view.html',
          controller: 'DuplicateManageViewController as vm',
          close: function () {
            service.closeDuplicateWindow();
          },
          activate: function () {
            angular.element('input[name=viewName]').focus().select();
          },
          resolve: {
            currentViewName: function () {
              return message;
            }
          }
        });
        return duplicateViewHandle;
      },
      closeDuplicateWindow: function () {
        if (typeof duplicateViewHandle !== 'undefined' && duplicateViewHandle !== null) {
          duplicateViewHandle.close();
          duplicateViewHandle = null;
        }
      },
      showRenameViewPopup: function (message, title) {
        renameViewHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 403,
          animation: false,
          templateUrl: 'modules/pipeline/views/rename-manage-view.html',
          controller: 'RenameManageViewController as vm',
          close: function () {
            service.closeRenameWindow();
          },
          activate: function () {
            $timeout(function () {
              var viewName = angular.element('input[name=viewName]');
              viewName.select();
            }, 0);
          },
          resolve: {
            customMessage: function () {
              return message;
            }
          }
        });
        return renameViewHandle;
      },
      closeRenameWindow: function () {
        if (typeof renameViewHandle !== 'undefined' && renameViewHandle !== null) {
          renameViewHandle.close();
          renameViewHandle = null;
        }
      },
      showRebuildLoanPropertiesPopup: function () {
        rebuildLoanPropertiesHandle = $kWindow.open({
          modal: true,
          title: 'Loan Properties',
          width: 403,
          animation: false,
          resizable: false,
          templateUrl: 'modules/pipeline/views/rebuild-loan-properties.html',
          controller: 'RebuildLoanPropertiesController as vm',
          close: function () {
            service.closeRebuildLoanPropertiesWindow();
          }
        });
        return rebuildLoanPropertiesHandle;
      },
      closeRebuildLoanPropertiesWindow: function () {
        if (typeof rebuildLoanPropertiesHandle !== 'undefined' && rebuildLoanPropertiesHandle !== null) {
          rebuildLoanPropertiesHandle.close();
          rebuildLoanPropertiesHandle = null;
        }
      },
      showLoanAlertPopup: function (title, loanGUID, alertColumnUniqueID,
                                    CurrentLoanAssociateID, CurrentLoanAssociateGroupID) {
        loanAlertViewHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 544,
          height: 412,
          animation: false,
          templateUrl: 'modules/pipeline/views/loan-alert-popup.html',
          controller: 'LoanAlertController as vm',
          close: function () {
            service.closeLoanAlertWindow();
          },
          resolve: {
            selectedLoanGUID: function () {
              return loanGUID;
            },
            selectedAlertColumnID: function () {
              return alertColumnUniqueID;
            },
            /* values for LoanAssociateID and LoanAssociateGroupID
             are required to be passed in 'getpipelineloanalerts' payload */
            selectedAlertLoanAssociateID: function () {
              return CurrentLoanAssociateID;
            },
            selectedAlertLoanAssociateGroupID: function () {
              return CurrentLoanAssociateGroupID;
            }
          }
        });
        return loanAlertViewHandle;
      },
      closeLoanAlertWindow: function () {
        if (typeof loanAlertViewHandle !== 'undefined' && loanAlertViewHandle !== null) {
          loanAlertViewHandle.close();
          loanAlertViewHandle = null;
        }
      },
      changeTitleForLoanAlertPopup: function (newTitle) {
        if (typeof loanAlertViewHandle !== 'undefined' && loanAlertViewHandle !== null) {
          loanAlertViewHandle.changeTitle(newTitle);
        }
      },
      showSavePipelineViewPopup: function (title) {
        savePipelineViewHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 544,
          height: 412,
          animation: false,
          templateUrl: 'modules/pipeline/views/save-pipeline-view.html',
          controller: 'SavePipelineViewController as vm',
          close: function () {
            service.closeSavePipelineViewPopup();
          }
        });
        return savePipelineViewHandle;
      },
      closeSavePipelineViewPopup: function () {
        if (typeof savePipelineViewHandle !== 'undefined' && savePipelineViewHandle !== null) {
          savePipelineViewHandle.close();
          savePipelineViewHandle = null;
        }
      },
      openLoanMessagesPopup: function (title, loanGUID) {
        loanMessagesViewHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 544,
          height: 332,
          animation: false,
          templateUrl: 'modules/pipeline/views/loan-messages-popup.html',
          controller: 'LoanMessagesController as vm',
          resolve: {
            selectedLoanGUID: function () {
              return loanGUID;
            }
          },
          close: function () {
            service.closeLoanMessagesPopup();
          }
        });
        return loanMessagesViewHandle;
      },
      closeLoanMessagesPopup: function () {
        if (typeof loanMessagesViewHandle !== 'undefined' && loanMessagesViewHandle !== null) {
          loanMessagesViewHandle.close();
          loanMessagesViewHandle = null;
        }
      },
      showTPOCompaniesPopup: function (title) {
        TPOCompaniesHandle = $kWindow.open({
          modal: true,
          title: title,
          resizable: false,
          width: 250,
          height: 260,
          animation: false,
          templateUrl: 'modules/pipeline/views/tpo-companies-popup.html',
          controller: 'TPOCompaniesController as vm',
          close: function () {
            service.closeTPOCompaniesPopup();
          }
        });
        return TPOCompaniesHandle;
      },
      closeTPOCompaniesPopup: function () {
        if (typeof TPOCompaniesHandle !== 'undefined' && TPOCompaniesHandle !== null) {
          TPOCompaniesHandle.close();
          TPOCompaniesHandle = null;
        }
      },

      showAddFieldPopup: function () {
        addFieldHandle = $kWindow.open({
          modal: true,
          title: 'Add Field',
          width: 543,
          minHeight: 554,
          animation: false,
          resizable: false,
          templateUrl: 'modules/pipeline/views/add-field.html',
          controller: 'AddFieldController as vm',
          close: function () {
            service.closeAddFieldPopup();
          }
        });
        return addFieldHandle;
      },

      closeAddFieldPopup: function (val) {
        if (typeof addFieldHandle !== 'undefined' && addFieldHandle !== null) {
          addFieldHandle.close(val);
          addFieldHandle = null;
        }
      }
    };
    /* Configure this together ...*/
    var modalVisible = false, // use this variable to control # of modals visible on ui...
      conf = {modal: true, animation: false, resizable: false, width: 544, minHeight: 412},
      modals = {
        modalCustomizeColumns: {title: 'Customize Columns'},
        modalDuplicateLoan: {title: 'Duplicate Loan'},
        popupInformation: {
          width: 'auto',
          maxWidth: 403,
          minWidth: 220,
          minHeight: 'auto',
          templateUrl: 'shared/views/popup-information.html'
        }
      };
    _.keys(modals).forEach(function (modal) {
      service[modal] = {name: modal, handle: null};
      service[modal].close = function (value) {
        if (_.startsWith(this.name, 'modal')) {
          modalVisible = false;
        }
        if (this.handle) {
          this.handle.close(value);
          this.handle = null;
        }
      };

      service[modal].open = function (options) {
        if (_.startsWith(this.name, 'modal') && modalVisible) {
          return void 0;
        }

        //Below function is implemented for the cross button on duplicate & customize modal window
        conf.close = function () {
          service[modal].close();
        };
        var config = angular.extend({}, conf, modals[this.name], options);

        config.templateUrl = config.templateUrl || 'modules/pipeline/views/' + _.kebabCase(this.name) + '.html';
        config.controller = config.controller || _.capitalize(this.name) + 'Controller as vm';
        if (_.startsWith(this.name, 'modal')) {
          modalVisible = true;
        }
        /* make the config options available to controller as resolve */
        config.resolve = {
          options: function () {
            return options;
          }
        };
        this.handle = $kWindow.open(config);
        //console.log('config now: ', config);
        return this.handle;
      };
    });
    return service;
  }
})();
