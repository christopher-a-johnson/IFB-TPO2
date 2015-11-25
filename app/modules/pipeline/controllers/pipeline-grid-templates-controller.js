(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('PipelineGridTemplatesController', PipelineGridTemplatesController);

  function PipelineGridTemplatesController(encompass, $rootScope, PipelineDataStore, $window, _, modalWindowService, PipelineConst,
                                           PipelineEventsConst, PipelineContextMenu) {
    /* jshint -W040 */
    var vm = this;
    vm.pipelineGridData = PipelineDataStore.PipelineGridData;

    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // http://stackoverflow.com/a/15289883 -- solution with time-zones
    // a and b are javascript Date objects
    function dateDiffInDays(a, b) {
      // Discard the time and time-zone information.
      var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    vm.dateDiff = _.memoize(function (inDate, bracketFormatting) {
      if (inDate) {
        var diff = dateDiffInDays(new Date(), new Date(inDate));
        if (diff > 0) { // loan is already expired, don't show any numbers in grid...
          if (bracketFormatting) {
            return '(' + diff + ')';
          } else {
            return 'Expires in ' + diff + ' days';
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    });

    vm.contextMenuData = function () {
      vm.menuData = null;
      var loanGuid = PipelineDataStore.PipelineGridData.selected[0].Loan$Guid;
      PipelineContextMenu.resolvePromise(loanGuid).then(function () {
        vm.menuData = PipelineContextMenu.loanData[loanGuid];
        //console.log('contextMenuData now: ', vm.menuData, PipelineDataStore.PipelineGridData.selected[0]);
      });
    };
    /* Lock and Request Status Column */
    vm.lockAndRequestStatusIconMappings = {
      // 1 Locked
      'Locked-NoRequest': {icon: 'dwi-rate-locked', text: ''}, // blank text would be filled at runtime with # of days
      // 2 Unlocked && Not Locked
      'NotLocked-NoRequest': {icon: 'dwi-rate-unlocked', text: 'Not Locked'},
      // 3 Expired
      'Expired-NoRequest': {icon: 'dwi-rate-expired', text: 'Expired'},
      // 4 Lock Requested
      'NotLocked-Request': {icon: 'dwi-rate-unlocked-request', text: 'Lock Requested'},
      // 5 Locked, New Lock Requested
      'Locked-Request': {icon: 'dwi-rate-locked-request', text: ''},
      // 6 Expired, New Lock Requested
      'Expired-Request': {icon: 'dwi-rate-expired-request', 'text': 'Expired'},
      // 7  Locked, Extension Requested
      'Locked-Extension-Request': {
        icon: 'dwi-rate-lock-requested-extension',
        text: 'Rate Locked (Lock extension requested)'
      },
      // 8  Locked, Cancellation Requested // todo: verify text for this status...
      'Locked-Cancellation-Request': {
        icon: 'dwi-rate-lock-cancel-request',
        'text': 'Rate Locked (Lock Cancellation Requested)'
      },
      // 9  Lock Cancelled
      'Cancelled': {icon: 'dwi-rate-lock-cancelled', text: 'Expired'}
      /*todo: figure out mistery of Expired-Extension-Request status...*/
      // encompass shows no text for this, but the icon is from 'Unlocked'
      // Expired-Extension-Request
      //'Expired-Extension-Request': {icon: 'dwi-rate-unlocked', text: ''}
      // please keep this comment - useful for future status mismatch issues
      // + 'Rate_Lock_Cancelled': {icon: 'dwi-rate-lock-cancelled'},
      // + 'Rate_Locked': {icon: 'dwi-rate-locked'},
      // - 'Rate_Lock_Request': {icon: 'dwi-rate-lock-request'},
      // + 'Rate_Lock_Requested': {icon: 'dwi-rate-locked-request'},
      // - 'Rate_Lock_Request_Extension': {icon: 'dwi-rate-lock-request-extension'},
      // - 'Rate_Lock_Requested_Extension': {icon: 'dwi-rate-lock-requested-extension'},
      // + 'Rate_Expired': {icon: 'dwi-rate-expired'},
      // + 'Rate_Expired_Extension_Requested': {icon: 'dwi-rate-expired-request'},
      // + 'Rate_Requested': {icon: 'dwi-rate-unlocked-request'},
      // + 'Rate_Unlocked': {icon: 'dwi-rate-unlocked'},
      // - 'Rate_Lock_Cancel_Request': {icon: 'dwi-rate-lock-cancel-request'}
    };
    vm.openLoanAlert = function (alertColumnUniqueID) {
      $rootScope.$broadcast(PipelineEventsConst.LOAN_ALERT_EVENT, {'alertColumnUniqueID': alertColumnUniqueID});
    };
    vm.moveToFolder = function () {
      $rootScope.$broadcast(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, {'folder': ''});
    };
    vm.processEPassUrl = function (url) {
      encompass.processEPassUrl(JSON.stringify({Url: url}), angular.noop);
    };

    vm.openLoanForm = function (formName) {
      encompass.openLoanForm(JSON.stringify({LoanFormName: formName}), angular.noop);
    };

    vm.startConversation = function (isEmail, isBorrower, contactInfo) {
      encompass.startConversation(JSON.stringify({
        IsEmail: isEmail,
        IsBorrower: isBorrower,
        ContactInfo: contactInfo
      }), angular.noop);
    };

    vm.showLockConfirmation = function () {
      encompass.showLockConfirmation(null, angular.noop);
    };

    vm.createAppointment = function (contactGuid) {
      encompass.createAppointment(JSON.stringify({ContactGuid: contactGuid}), angular.noop);
    };

    vm.openMap = function () {
      var mapUrl = 'https://www.google.com/maps/place/' +
        _.values(
          _.pick(vm.menuData,
            'Subject_Property_Street_Address', 'Subject_Property_City', 'Subject_Property_State', 'Subject_Property_Postal_Code'))
          .join(', ')
          .replace(/\s+/g, '+');
      $window.open(mapUrl, '_blank');
    };

    vm.openLoanMessagesPopup = function (messageCount, loanGuid) {
      var title = PipelineConst.MessagesText + '(' + messageCount + ')';
      PipelineDataStore.LoanMessagesData.items = [];
      modalWindowService.openLoanMessagesPopup(title, loanGuid);
    };

    vm.setMilestoneColor = function (milestoneName) {
      vm.milestoneColors = 'rgba(0, 0, 0, 0)';
      var selectedMilestone = _.find(PipelineDataStore.MilestoneProperties, {'Name': milestoneName});
      if ((typeof selectedMilestone !== 'undefined') && (typeof selectedMilestone.Color !== 'undefined')
        && selectedMilestone.Color !== '') {
        var colors = selectedMilestone.Color.replace(/[^\d,]/g, '').split(',');
        if ((typeof colors !== 'undefined') && colors.length === 4) {
          vm.milestoneColors = 'rgba(' + (colors[1] || 0) + ',' + (colors[2] || 0) + ',' + (colors[3] || 0) + ',' + (colors[0] || 0) + ')';
        }
      }
      return milestoneName;
    };
  }
})();
