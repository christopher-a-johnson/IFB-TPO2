/**
 * Created by rkumar3 on 4/1/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('LoanAlertPopupData', LoanAlertPopupData);

  /* @ngInject */
  function LoanAlertPopupData(Restangular, _, PipelineDataStore, $filter, PipelineConst, modalWindowService) {

    return {
      resolvePromise: function (payload) {
        PipelineDataStore.LoanAlertPopupInfo.items.length = 0;
        return Restangular.all('pipeline/loan/getpipelineloanalerts').post(payload).then(function (response) {
          var availableAlertCount = 0;
          var views = _.sortBy(response.PipelineLoanAlerts, function (item) {

            //Display status is 2(snoozed) but if snoozeDuration and datetime is null
            // or current time is greater than snooze time then change the loan alert status to active(1) from snoozed(2)
            item.DisplayStatus = getItemDisplayStatus(item);

            //If SnoozeStartDTTM does not contain 'Z' in time format then need to append 'Z' to make it
            // understand by Date object
            if (item.SnoozeStartDTTM !== null && item.SnoozeStartDTTM.search('Z') < 0) {
              item.SnoozeStartDTTM = item.SnoozeStartDTTM + 'Z';
            }

            if (item.DisplayStatus === PipelineConst.Dismissed) {
              item.AlertMessage += PipelineConst.DismissAdditionalMessage;
            }
            else if (item.DisplayStatus === PipelineConst.Snoozed) {
              item.AlertMessage += '(Snoozed for ' + getSnoozeTime(item.SnoozeDuration) + ' from ' +
              $filter('date')(item.SnoozeStartDTTM, 'M/d/yyyy h:mm:ss a', 'UTC') + ')';

              //$filter service needs the 'UTC' parameter for the date to display as it is in item.SnoozeStartDTTM
            }
            else {
              availableAlertCount = availableAlertCount + 1;
            }

            return item.DisplayStatus;
          });
          var index = _.lastIndexOf(_.pluck(views, 'DisplayStatus'), 1) + 1;
          if (index !== views.length) {
            var item = {
              'AlertMessage': PipelineConst.DismissSnoozeDefaultMessage,
              'DateExpected': '',
              'DisplayStatus': PipelineConst.DismissSnoozeDefaultStatus,
              'AlertID': PipelineConst.DismissSnoozeDefaultId
            };
            views.splice(index, 0, item);
          }
          angular.copy(views, PipelineDataStore.LoanAlertPopupInfo.items);
          PipelineDataStore.LoanAlertPopupInfo.selectedItem = 1;
          modalWindowService.changeTitleForLoanAlertPopup(availableAlertCount + PipelineConst.LoanAlerts);
          PipelineDataStore.LoanAlertPopupInfo.DisableAlertActions = response.DisableAlertActions;
        });
      }
    };
    function getSnoozeTime(SnoozeMinute) {
      switch (SnoozeMinute) {
        case 10:
          return '10 minutes';
        case 60:
          return '1 hour';
        case 240:
          return '4 hours';
        case 1440:
          return '1 day';
        case 2880:
          return '2 days';
        case 4320:
          return '3 days';
        case 5760:
          return '4 days';
        case 10080:
          return '1 week';
        case 20160:
          return '2 weeks';
        case 43200:
          return '1 month';
      }
    }

    function getItemDisplayStatus(item) {
      if (item.DisplayStatus === PipelineConst.Snoozed) {

        if (item.SnoozeDuration === null && item.SnoozeStartDTTM === null) {
          item.DisplayStatus = 1; //Loan is now in active state
        }
        else if (item.SnoozeDuration !== null && item.SnoozeStartDTTM !== null) {
          var currentDate = new Date();

          //If SnoozeStartDTTM does not contain 'Z' in time format then need to append 'Z' to make it
          // understand by Date object
          if (item.SnoozeStartDTTM.search('Z') < 0) {
            item.SnoozeStartDTTM = item.SnoozeStartDTTM + 'Z';
          }
          var snoozeStartDate = $filter('date')(item.SnoozeStartDTTM, 'yyyy-MM-ddTHH:mm:ss.sss', 'UTC');
          var totalSnoozeTime = Date.parse(snoozeStartDate) + item.SnoozeDuration * 60000;

          //If current time is greater than total snooze time then snoozed alert should be active otherwise remain snoozed
          if (currentDate.getTime() >= totalSnoozeTime) {
            item.DisplayStatus = 1;
          }
        }
      }
      return item.DisplayStatus;
    }
  }

}());
