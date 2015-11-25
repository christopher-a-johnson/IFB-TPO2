(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('CustomizeColumnService', CustomizeColumnService);
  /* @ngInject */
  function CustomizeColumnService(PipelineDataStore, _, $templateCache, $timeout, localStorageService, PipelineHelperService,
                                  modalWindowService, PipelineConst) {
    function getFilterTemplate(args, column) {
      if (column.datatype === 'dropdown' || column.datatype === 'yn') {
        args.element.kendoDropDownList({
          dataSource: column.list, //list of values for the column dropdown
          dataTextField: 'DisplayName',
          dataValueField: 'Value',
          template: setTemplate(column),
          optionLabel: ' ',
          animation: false,
          valuePrimitive: true
        });
      } else if (column.datatype === 'date' || column.datatype === 'datetime') {
        args.element[0].setAttribute('onkeyup',
          'if(event.keyCode === 13) { this.blur(); }');
        args.element.kendoMaskedTextBox({
          //Check if valid date is entered and show error popup
          change: function (e) {
            var isDateValid = PipelineHelperService.getValidDate(this.value());
            if (isDateValid === 'InvalidDate' && this.value() !== '') {
              var invalidDateMessage = PipelineConst.DateFilterInvalidMessage;
              invalidDateMessage = invalidDateMessage.replace('DATE', '\'' + this.value() + '\'');
              modalWindowService.showWarningPopup(invalidDateMessage, PipelineConst.PopupTitle,
                PipelineConst.WarningIcon);
              this.value('');
            }
            else if (isDateValid === 'InvalidRange' && this.value() !== '') {
              var invalidRangeDateMessage = PipelineConst.DateFilterInvalidRangeMessage;
              invalidRangeDateMessage = invalidRangeDateMessage.replace('DATE', '\'' + this.value() + '\'');
              invalidRangeDateMessage = invalidRangeDateMessage.replace('STARTDATE', PipelineConst.DateFilterStartDate);
              invalidRangeDateMessage = invalidRangeDateMessage.replace('ENDDATE', PipelineConst.DateFilterEndDate);
              modalWindowService.showWarningPopup(invalidRangeDateMessage, PipelineConst.DateFilterInvalidRangeTitle,
                PipelineConst.WarningIcon);
              this.value('');
            }
          }
        });
        args.element.kendoDatePicker({
          format: 'MM/dd/yyyy',
          close: function (e) {
            $timeout(function () {
              e.sender.element.blur();
            }, 0);
          }
        });
      } else if (column.datatype === 'integer' || column.datatype === 'decimal') {
        args.element.kendoNumericTextBox({format: '#', decimals: 0, step: 0, spinners: false});
      } else if (column.datatype.indexOf('decimal') > -1) {
        args.element[0].maxLength = 12;
        args.element.kendoNumericTextBox({
          format: '#.' + Array(parseInt(column.datatype.substr(8)) + 1).join('#'), //jshint ignore: line
          decimals: column.datatype.substr(8), step: 0, spinners: false
        });
      }
      else if (column.datatype === 'string') {
        args.element[0].setAttribute('onkeyup',
          'if(event.keyCode === 13) { this.blur(); }');
      }
    }

    function setTemplate(column) {
      return column.DisplayType.indexOf('Milestone') !== -1 ?
        $templateCache.get('modules/pipeline/views/pipeline-milestone-header-template.html') :
        column.DisplayType === 'RateLock' || 'RateLockAndRequest' ?
          $templateCache.get('modules/pipeline/views/pipeline-rate-lock-template.html') : '';
    }

    function getDisplayFormat(type) {
      var format = '', datatype = type.toLowerCase();
      if (datatype === 'date') {
        format = '{0:MM/dd/yyyy}';
      } else if (datatype === 'integer' || datatype === 'decimal') {
        format = '{0:0}';
      } else if (datatype.indexOf('decimal') > -1) {
        format = '{0:0.' + Array(parseInt(datatype.substr(8)) + 1).join('0') + '}'; //jshint ignore: line
      }
      return format;
    }

    /**
     * @ngdoc method
     * @name getColumnTemplate
     * @methodOf elli.encompass.web.pipeline.CustomizeColumnService
     * @description
     * Returns the corresponding column template based on the displayType and the column
     * @param {string} column Details about the column
     */
    function getColumnTemplate(column) {
      return (column.DisplayType.indexOf('Milestone') !== -1
        ? getMilestoneColorTemplate(column)
        : (column.DisplayType.indexOf('Alert') !== -1 ?
        getAlertsColumnsTemplate(column)
        : $templateCache.get('modules/pipeline/pipeline-grid-templates/column.' + column.uniqueID + '.html')));
    }

    function getAlertsColumnsTemplate(column) {
      return '<div ng-controller="PipelineGridTemplatesController as vm">' +
        '# if(typeof ' + column.field + '!== "undefined" && ' + column.field + ' !== null && ' + column.field + ' !==' +
        ' "") { #<div ng-click="vm.openLoanAlert(\'' + column.uniqueID + '\')" ' +
        'ng-show="\'#: ' + column.field + ' #\' !== \'0\'" ' +
        'class="pl-view-alert-count">#: ' + column.field + ' #</div>' +
        '# } #</div>';
    }

    function getMilestoneColorTemplate(column) {
      return '<div ng-controller="PipelineGridTemplatesController as vm">' +
        '# if(typeof ' + column.field + '!== "undefined" && ' + column.field + '!== null && ' + column.field + '!== "") { #' +
        '<div class="ngen-pull-left ngen-milestone-color-box"' +
        ' ng-style="{\'background-color\': vm.milestoneColors}"></div>' +
        '<span>{{vm.setMilestoneColor("#: ' + column.field + '#")}}</span>' +
        '</div>' +
        ' # } #';
    }

    var customizeColumnService = {
      resolvePromise: function () {
        PipelineDataStore.CustomizeColumnLoaded = false;
        PipelineDataStore.CustomizeColumnData.items.length = 0;
        var uncheckedIndex = PipelineDataStore.PipelineGridData.data.columns.length;
        var checkedColumns = [];
        var uncheckedColumns = [];
        PipelineDataStore.FieldDefinition.items = _.sortBy(PipelineDataStore.FieldDefinition.items, 'Header');
        _.each(PipelineDataStore.FieldDefinition.items, function (item) {
          var existingItem = _.findWhere(PipelineDataStore.PipelineGridData.data.columns, {FieldId: item.FieldId});
          if (typeof existingItem === 'undefined') {
            item.columnSelected = false;
            item.OrderIndex = uncheckedIndex++;
            uncheckedColumns.push(item);
          }
        });
        var orderIndex = 0;
        _.each(PipelineDataStore.PipelineGridData.data.columns, function (item) {
          var existingItem = _.findWhere(PipelineDataStore.FieldDefinition.items, {FieldId: item.FieldId});
          existingItem.OrderIndex = orderIndex++;
          existingItem.columnSelected = true;
          checkedColumns.push(existingItem);
        });
        angular.copy(_.union(checkedColumns, uncheckedColumns), PipelineDataStore.CustomizeColumnData.items);
        PipelineDataStore.CustomizeColumnLoaded = true;
      },
      getUpdatedColumns: function (columns) {
        var pipelineColumnDef = localStorageService.get('PipelineGetColumnDef');

        function getColumnDefinition(column) {
          var _ref, _ref1;
          _ref = ((typeof pipelineColumnDef !== 'undefined') && pipelineColumnDef !== null ?
            pipelineColumnDef[column.PipelineField.FieldId] : void 0);

          //"Name" from the FieldDefs API is Unique which is required for the get loans service
          column.SortKeyName = ((typeof _ref !== 'undefined') ? _ref.SortKeyName : '');

          //TODO: NGENC-6153 - For Kendo - temp workaround when there are special characters in the column name
          column.uniqueID = ((typeof _ref !== 'undefined') ? PipelineHelperService.removeSpecialCharsForID(_ref.Name) : '');
          column.title = PipelineHelperService.removeSpecialCharsForTitle(column.PipelineField.Header);
          column.field = PipelineHelperService.getColumnNameForKendoGrid(column.uniqueID);
          //Ends here

          column.DisplayType = (typeof _ref !== 'undefined' ? _ref.DisplayType : '');

          column.datatype = ((typeof _ref !== 'undefined' ? _ref.Datatype : void 0) || 'string').toLowerCase();
          if (column.datatype === 'dropdown' || column.datatype === 'yn') {
            column.list = ((typeof (_ref1 = pipelineColumnDef[column.PipelineField.FieldId]) !== 'undefined') ?
                _ref1.FieldOptions : void 0) || [];
          }
          if (column.DisplayType.indexOf('Milestone') !== -1 && PipelineDataStore.MilestoneProperties !== null &&
            PipelineDataStore.MilestoneProperties.length > 0) {
            _.each(column.list, function (columnItem) {
              //Default value
              columnItem.Color = {R: 0, G: 0, B: 0, A: 0};
              var selectedMilestone = _.find(PipelineDataStore.MilestoneProperties, {'Name': columnItem.DisplayName});
              if (typeof selectedMilestone !== 'undefined' && typeof selectedMilestone.Color !== 'undefined'
                && selectedMilestone.Color !== '') {
                var colors = selectedMilestone.Color.replace(/[^\d,]/g, '').split(',');
                if (typeof colors !== 'undefined' && colors.length === 4) {
                  columnItem.Color = {R: colors[1], G: colors[2], B: colors[3], A: colors[0]};
                }
              }
            });
          }

          if (column.DisplayType === 'RateLock') {
            _.each(column.list, function (columnItem) {
              switch (columnItem.Value) {
                case 'NotLocked':
                  columnItem.Icon = 'dwi-rate-unlocked';
                  break;
                case 'Locked':
                  columnItem.Icon = 'dwi-rate-locked';
                  break;
                case 'Expired':
                  columnItem.Icon = 'dwi-rate-expired';
                  break;
                case 'Cancelled':
                  columnItem.Icon = 'dwi-rate-lock-cancelled';
                  break;
                case 'default':
                  columnItem.Icon = '';
              }
            });
          }

          if (column.DisplayType === 'RateLockAndRequest') {
            _.each(column.list, function (columnItem) {
              switch (columnItem.Value) {
                case 'NotLocked-NoRequest':
                  columnItem.Icon = 'dwi-rate-unlocked';
                  break;
                case 'Locked-NoRequest':
                  columnItem.Icon = 'dwi-rate-locked';
                  break;
                case 'Expired-NoRequest':
                  columnItem.Icon = 'dwi-rate-expired';
                  break;
                case 'Cancelled':
                  columnItem.Icon = 'dwi-rate-lock-cancelled';
                  break;
                case 'NotLocked-Request':
                  columnItem.Icon = 'dwi-rate-unlocked-request';
                  break;
                case 'Locked-Request':
                  columnItem.Icon = 'dwi-rate-locked-request';
                  break;
                case 'Expired-Request':
                  columnItem.Icon = 'dwi-rate-expired-request';
                  break;
                case 'Locked-Extension-Request':
                  columnItem.Icon = 'dwi-rate-lock-requested-extension';
                  break;
                case 'Locked-Cancellation-Request':
                  columnItem.Icon = 'dwi-rate-lock-cancel-request';
                  break;
                case 'PendingRequest':
                  columnItem.Icon = 'dwi-rate-lock-request';
                  break;
                case 'default':
                  columnItem.Icon = '';
              }
            });
          }

          //length check is temporary, as API is returning multiple cols with SortOrder set
          if (column.SortOrder && column.SortOrder !== 'None' &&
            (column.SortPriority === '-1' || column.SortPriority === '0')) {
            PipelineDataStore.PipelineGridData.sort[0] = {
              compare: undefined,
              dir: column.SortOrder === 'Ascending' ? 'asc' : 'desc',
              field: column.field
            };
          }

          return {
            sortable: true,
            uniqueID: column.uniqueID, //used by the GetLoans service
            field: column.field, //used by the kendo grid
            title: column.title,
            headerTemplate: '<span title="' + column.title + '">' + column.title + '</span>',
            FieldId: column.PipelineField.FieldId,
            name: column.PipelineField.Name,
            sortKeyName: column.SortKeyName, //used by the GetLoans service, for the sorted column
            sortOrder: column.SortOrder,
            sortPriority: column.SortPriority,
            type: column.datatype,
            DisplayType: column.DisplayType,
            OrderIndex: parseInt(column.OrderIndex, 10),
            format: getDisplayFormat(column.datatype),
            alignment: column.Alignment,
            width: (column.Width === '-1' ? PipelineConst.DefaultColumnWidth : column.Width) + 'px',
            required: column.Required,
            list: column.list,
            attributes: {
              'class': (column.datatype === 'integer' || column.datatype.indexOf('decimal') > -1) ? 'text-right' : ''
            },
            filterable: {
              cell: {
                showOperators: Boolean(column.datatype === 'integer' || column.datatype === 'date' ||
                  column.datatype === 'datetime' || column.datatype.indexOf('decimal') !== -1),
                operator: 'eq',
                template: function (args) {
                  getFilterTemplate(args, column);
                }
              }
            }
          };
        }

        var updatedColumns = [];
        // Multiple columns
        if (columns instanceof Array) {
          _.each(columns, function (column, index) {
            updatedColumns[index] = getColumnDefinition(column);
            updatedColumns[index].template = getColumnTemplate(updatedColumns[index]);
            if (index === 0) {
              updatedColumns[index].hidden = true;
            }
          });
        }
        // Single Column
        else if (columns instanceof Object) {
          updatedColumns = getColumnDefinition(columns);
          updatedColumns.template = getColumnTemplate(updatedColumns);
        }
        return updatedColumns;
      }
    };

    return customizeColumnService;
  }
}());
