//TODO: Need to revisit, to avoid exposing as global object as it was not accessible from layout.js which loads first in the order,
var WIZARD_CONST = {
    minColumns: 1,
    maxColumns: 6,
    maxGridsterCol: 50,
    maxRows: 6,
    panelHeight: 300,
    rootPath: '/api/'
  },
  formWidth,
  layoutWizard = null,
  wizardLayoutParams = {};

elli.builder.layoutribbon = (function () {
  'use strict';

  var builder = elli.builder, workSpaceConstant = builder.constant.workSpaceConstant;

  var layoutGrid = builder.layoutgrid,
    layoutCollapse = builder.layoutCollapse,
    workspace = builder.workspace,
    controlButtonClass = workSpaceConstant.controlButtonClass,
    ribbonHeader = workSpaceConstant.ribbonHeader,
    gridSpacing;


  /* Declared CONSTANTS to avoid repeated use of Selectors & Default Values */
  var LAYOUTSELECTOR_CONST = {
    formWidthDropDown: $('#formWidthDropDown'),
    formCustomWidth: $('#formCustomWidth'),
    formWidthDiv: $('#formWidthDiv'),
    formSpacing: $('#formWidth'),
    tableLayoutSelect: $('#tableLayoutSelect'),
    tableWizard: $('#tableWizard'),
    tableWizardBuildButton: $('#tableWizardBuild'),
    changeLink: $('.form-width-change-label'),
    formWidthShowHideDiv: $('.form-width-showhidediv'),
    selectedCells: $('#selectableCells'),
    panelCol: $('#panelCol'),
    panelRowColSeperator: $('#panelRowColSeprator'),
    panelRow: $('#panelRow'),
    widthSlider: $('#widthSlider'),
    spacingSlider: $('#slider'),
    formBuilderForm: $('#formBuilderForm'),
    builderWorkspace: $('#builderWorkspace'),
    formSpacingMinValue: '2',
    formWidthDropDownDefaultVal: 'Default',
    widthSliderMinVal: '1',
    emptyFormWidthErrMsg: 'You must enter the Form Width.',
    minmaxFormWidthErrMsg: 'Form Width must be between 600 pixels (min) to 4000 pixels (max).',
    panelSelectionErrMsg: 'You must select 1 or more Panels before building form.',
    panelError: '#panelError',
    widthError: '#widthError',
    formWidthDropDownOption: $('#formWidthDropDown option'),
    formWidthDropDownOptionSelect: $('#formWidthDropDown option:selected'),
    unitOfMeasure: 'px',
    layoutWizardButton: '#layoutWizardButton'
  };

  function initLayoutWizardControls() {
    LAYOUTSELECTOR_CONST.spacingSlider.slider({
      range: 'min',
      value: 2,
      step: 1,
      min: 2,
      max: 20,
      slide: function (event, ui) {
        LAYOUTSELECTOR_CONST.formSpacing.val(ui.value);
      }
    });

    LAYOUTSELECTOR_CONST.formSpacing.keyup(function (e) {
      var spacing = $(this).val();
      if ((spacing >= 2) && (spacing <= 20)) {
        LAYOUTSELECTOR_CONST.spacingSlider.slider('value', this.value);
      } else if (spacing >= 21) {
        LAYOUTSELECTOR_CONST.spacingSlider.slider('value', '20');
        $(this).val('20');
        return;
      }
    });

    LAYOUTSELECTOR_CONST.formSpacing.focusout(function (e) {
      var spacing = $(this).val();
      if (spacing < 2) {
        LAYOUTSELECTOR_CONST.spacingSlider.slider('value', '2');
        $(this).val('2');
      }
    });

    LAYOUTSELECTOR_CONST.formSpacing.val('2');
    LAYOUTSELECTOR_CONST.formWidthShowHideDiv.hide();
    LAYOUTSELECTOR_CONST.formWidthDropDown.val('Default');
    LAYOUTSELECTOR_CONST.formCustomWidth.val('');

    LAYOUTSELECTOR_CONST.formWidthDropDown.change(function () {
      var val = $(this).val();
      if (val === 'Custom') {
        $(this).hide();
        LAYOUTSELECTOR_CONST.formWidthShowHideDiv.show();
        LAYOUTSELECTOR_CONST.formCustomWidth.val('');

        /* set focus in the form width textbox */
        LAYOUTSELECTOR_CONST.formCustomWidth.focus();
      }
    });
    $('.form-width-change-label').click(function () {
      LAYOUTSELECTOR_CONST.formWidthShowHideDiv.hide();
      LAYOUTSELECTOR_CONST.formWidthDropDown.show();
      LAYOUTSELECTOR_CONST.formWidthDropDown.val(LAYOUTSELECTOR_CONST.formWidthDropDownDefaultVal);

      /* remove form width validation error message if visible;*/

      $(LAYOUTSELECTOR_CONST.widthError).removeClass('errorMessage').text('');
      LAYOUTSELECTOR_CONST.formWidthDropDown.focus();
    });
  }

  function buildSelectableTable() {
    var cols = 6;
    if (wizardLayoutParams.cols < cols) {
      cols = wizardLayoutParams.cols;
    }

    var rows = wizardLayoutParams.rows;

    var $table = $('<table/>');
    $table.attr('id', 'tableLayoutSelect');
    for (var r = 1; r <= rows; r++) {
      var $row = $('<tr/>');
      $row.attr('id', 'row_' + r);

      for (var c = 1; c <= cols; c++) {
        var $col = $('<td/>');
        $col.attr('data-col', c);
        $col.attr('data-row', r);
        $col.addClass('cell');

        $row.append($col);
      }
      $table.append($row);
    }

    var selectableActive = 0;
    var selectedCells = [];

    $('#selectableCells').append($table);
    $table.selectable({
      filter: 'td',//'.cell',
      start: function (event, ui) {
        $('td').removeClass('ui-selected');
        $('#panelCol').text('');
        $('#panelRowColSeprator').text('');
        $('#panelRow').text('');
      },
      selecting: function (event, ui) {
        var selObj = $(ui.selecting);
        var selCol = selObj.attr('data-col');
        var selRow = selObj.attr('data-row');
        if (selCol === '1' && selRow === '1') {
          selectableActive = 1;
        }
        if (selectableActive === '0') {
          $('td').removeClass('ui-selecting');
        } else {
          selectedCells.push(selRow + '-' + selCol);
        }
      },
      stop: function () {
        selectableActive = 0;
        if (selectedCells.length > 0) {
          var selectedVals = selectedCells[selectedCells.length - 1].split('-');
          wizardLayoutParams.cols = selectedVals[1];
          wizardLayoutParams.rows = selectedVals[0];
          var newColSpan = Math.round(Math.floor(WIZARD_CONST.maxColumns / selectedVals[1]));
          wizardLayoutParams.colSpan = newColSpan < 1 ? 1 : newColSpan;
          if (selectedCells.length === 1) {
            $('#tableLayoutSelect').find('tr:lt("' + wizardLayoutParams.rows + '")')
              .find('td:lt("' + wizardLayoutParams.cols + '")').addClass('ui-selected');
          }
          var totalhighlightedCells = $('#tableLayoutSelect').find('.ui-selected').length;
          if (totalhighlightedCells > 0) {
            var rowsSelected = $('td.ui-selected').parent('tr').length;
            $('#panelCol').text(totalhighlightedCells / rowsSelected);
            $('#panelRowColSeprator').text('X');
            $('#panelRow').text(rowsSelected);

          }

        }
        selectedCells.length = 0;
      }
    });
  }

  function resetLayoutWizard() {
    wizardLayoutParams = {
      rowSpan: 1,
      colSpan: 6,
      cols: WIZARD_CONST.minColumns,
      rows: WIZARD_CONST.maxRows
    };
    $('#tableLayoutSelect').selectable('destroy').remove();
    buildSelectableTable();
  }

  function selectWizardOption() {
    var optionState = $('#option').attr('option-state');
    var optionText = 'Advanced...';
    var showControl = '#selectableCells';
    var hideControl = '#manualControls';

    if (optionState === 'Advanced') {
      optionText = '< Grid';
      showControl = '#manualControls';
      hideControl = '#selectableCells';
    }

    $('#option').attr('option-state', optionState).text(optionText);
    $(showControl).show();
    $(hideControl).hide();
  }

  function initLayoutWizard() {

    /* resetLayoutSelector() function resets(refresh) all the controls which are present
     in the layout Selector when user clicks on layoutWizard button*/
    $(LAYOUTSELECTOR_CONST.layoutWizardButton).click(function () {
      resetLayoutSelector();
    });

    layoutWizard = $(LAYOUTSELECTOR_CONST.layoutWizardButton).kendoTooltip({
      width: LAYOUTSELECTOR_CONST.tableWizard.outerWidth() + 20,
      position: 'bottom',
      autoHide: false,
      showOn: 'click',
      show: function (e) {
        this.popup.element.addClass('layout-wizard-grid-panel');
        this.popup.element.parent().addClass('layout-wizard-animator');
        this.popup.element.find('.k-callout').addClass('layout-wizard-arrow');
        $('#tableWizard, #selectableCells').show();
        /* To set form width related control values unchanged and read only*/
        if (workspace.getGridPanelCount() > 0) {
          var formProperties = workspace.formSchemaJson.Properties.ui;
          formWidth = formProperties ? formProperties.width : formWidth;
          var layoutGridSpacing = formProperties.spacing;
          if (isNaN(formWidth)) {
            LAYOUTSELECTOR_CONST.formWidthDropDown.val(formWidth);
            LAYOUTSELECTOR_CONST.formWidthDropDown.prop('disabled', true);
          }
          else {
            var values = [];
            var defaultWidth;

            LAYOUTSELECTOR_CONST.formWidthDropDownOption.each(function () {
              defaultWidth = $(this).attr('value');
              if (defaultWidth !== 'Default' && defaultWidth !== 'Custom') {
                defaultWidth = defaultWidth.replace(LAYOUTSELECTOR_CONST.unitOfMeasure, '');
                values.push(defaultWidth);
              }
            });
            if (values.indexOf(formWidth.toString()) > -1) {
              LAYOUTSELECTOR_CONST.formWidthDropDownOptionSelect.text(formWidth + LAYOUTSELECTOR_CONST.unitOfMeasure);
              LAYOUTSELECTOR_CONST.formWidthDropDown.prop('disabled', true);

            } else {
              LAYOUTSELECTOR_CONST.formWidthDropDown.hide();
              LAYOUTSELECTOR_CONST.formWidthShowHideDiv.show();
              LAYOUTSELECTOR_CONST.formCustomWidth.val(formWidth);
              LAYOUTSELECTOR_CONST.changeLink.css('display', 'none');
              LAYOUTSELECTOR_CONST.formCustomWidth.prop('disabled', true);
            }

          }
          $(LAYOUTSELECTOR_CONST.spacingSlider).slider('disable');
          $(LAYOUTSELECTOR_CONST.spacingSlider).slider('value', layoutGridSpacing);
          LAYOUTSELECTOR_CONST.formSpacing.val(layoutGridSpacing);
          LAYOUTSELECTOR_CONST.formSpacing.prop('disabled', true);
        }
      },
      hide: function (e) {
        this.popup.element.removeClass('layout-wizard-grid-panel');
        this.popup.element.parent().removeClass('layout-wizard-animator');
        this.popup.element.find('.k-callout').removeClass('layout-wizard-arrow');
      },
      content: LAYOUTSELECTOR_CONST.tableWizard
    }).data('kendoTooltip');

    $('#wizardOptions span').click(function () {
      selectWizardOption();
    });
  }

  /* every time when user clicks on layoutWizard button this function gets called
   to reset all controls values in it.*/
  function resetLayoutSelector() {

    if (document.readyState === 'complete') {
      /* initialize widthSlider with Default Value. */
      LAYOUTSELECTOR_CONST.widthSlider.slider('value', LAYOUTSELECTOR_CONST.widthSliderMinVal);

      /* below function call resets the grid layout wizard in Layout Selector.*/
      resetLayoutWizard();

      LAYOUTSELECTOR_CONST.tableLayoutSelect.find('td').removeClass('ui-selected');

      LAYOUTSELECTOR_CONST.panelCol.text('');
      LAYOUTSELECTOR_CONST.panelRowColSeperator.text('');
      LAYOUTSELECTOR_CONST.panelRow.text('');

      /* initialize spacing slider & spacing with default minimum value i.e. 2.*/
      LAYOUTSELECTOR_CONST.spacingSlider.slider('value', LAYOUTSELECTOR_CONST.formSpacingMinValue);
      LAYOUTSELECTOR_CONST.formSpacing.val(LAYOUTSELECTOR_CONST.formSpacingMinValue);

      $('#formCustomWidth, #formWidth').keyup(function (event) {
        if (event.keyCode === 46 || event.keyCode === 8) {
          return true;
        }
        else if (/\D/g.test(this.value)) {
          this.value = this.value.replace(/\D/g, '');
        }
      });
      /* formCustomWidth textbox Validation which allows only numeric values & Max length i.e.4.*/
      $(LAYOUTSELECTOR_CONST.formCustomWidth).keypress(function (event) {
        if (LAYOUTSELECTOR_CONST.formCustomWidth.val().length >= 4 && event.keyCode !== 8 && event.keyCode !== 46) {
          return false;
        }
      });

      /* form spacing Width textbox Validation which allows only numeric values & Max length i.e.2.*/
      $(LAYOUTSELECTOR_CONST.formSpacing).keypress(function (event) {
        if (LAYOUTSELECTOR_CONST.formSpacing.val().length >= 2 && event.keyCode !== 8 && event.keyCode !== 46) {
          return false;
        }
      });
      /* below are the error message divs needs to be removed if messages are visible. */
      $(LAYOUTSELECTOR_CONST.widthError).removeClass('errorMessage').text('');
      $(LAYOUTSELECTOR_CONST.panelError).removeClass('errorMessage').text('');
    }
  }

  function changeSelectableTable() {
    $('#panelCol').html('');
    $('#panelRowColSeprator').html('');
    $('#panelRow').html('');
    $('#tableLayoutSelect').selectable('destroy').remove();
    wizardLayoutParams.rows = WIZARD_CONST.maxRows;

    buildSelectableTable();

    $('#tableLayoutSelect').show();
  }

  function initLayoutSliders() {
    $(LAYOUTSELECTOR_CONST.widthSlider).slider({
      range: 'max',
      min: 1,
      max: WIZARD_CONST.maxColumns,
      value: 1,
      slide: function (event, ui) {
        //inverse = (WIZARD_CONST.maxColumns - ui.value) + 1;

        var colSpan = Math.round(Math.floor(WIZARD_CONST.maxColumns / ui.value));
        colSpan = (colSpan < 1 ? 1 : colSpan);
        wizardLayoutParams.colSpan = colSpan;
        wizardLayoutParams.cols = ui.value;
        changeSelectableTable();
      }
    });
  }

  function initRibbonPanel() {
    var contentElement = $('#ribbonControlsContainer');
    var content = $('#content');
    var isRibbonExpanded = true;
    //expand
    $('#ribbonCollapseBar').on('click', 'span.k-i-arrowhead-s', function (e) {
      $('.ribbonLayoutControlsContainer div span').show();
      layoutCollapse.expandPanel({
        elem: contentElement,
        selector: this,
        hasEasingEffect: true,
        expandClass: 'k-i-arrowhead-s',
        collapseClass: 'k-i-arrowhead-n'
      });
      $(content).toggleClass('contentDown');
      isRibbonExpanded = true;
    });

    //collapse
    $('#ribbonCollapseBar').on('click', 'span.k-i-arrowhead-n', function (e) {
      $('.ribbonLayoutControlsContainer div span').hide();
      layoutCollapse.collapsePanel({
        elem: contentElement,
        selector: this,
        hasEasingEffect: true,
        expandClass: 'k-i-arrowhead-s',
        collapseClass: 'k-i-arrowhead-n'
      });
      $(content).toggleClass('contentDown');
      isRibbonExpanded = false;
    });

    layoutCollapse.expandPanel({
      elem: contentElement,
      hasEasingEffect: true,
      expandClass: 'k-i-arrowhead-s',
      collapseClass: 'k-i-arrowhead-n'
    });

  }

  function appendTooltipElement(data, element, cssClass) {
    $.each(data, function (key, value) {
      $(element).append('</br><div class="' + cssClass + '" id="' + value.id + '">' + value.name + ' </div>');
    });
  }

  function initControlToolbar() {

    $.ajax({
      url: WIZARD_CONST.rootPath + 'fb/ControlToolbox.json',
      success: function (data) {
        appendTooltipElement(data.code, '#codeHeaderTooltip', 'code-tooltip');
        appendTooltipElement(data.layout, '#layoutHeaderTooltip', 'layout-tooltip');
        appendTooltipElement(data.formElement, '#standardControlTooltip', 'standard-control-tooltip');
        appendTooltipElement(data.miscellaneousElement, '#combinedControlTooltip', 'combined-control-tooltip');
      }
    });
  }

  function initRibbonHeader() {

    var codeTooltipFlag, layoutTooltipFlag, standardTooltipFlag, combinedTooltipFlag = true;

    $('#codeHeaderTooltip').hide();
    var codeHeaderKendoTooltip = $('#codeHeaderImage').kendoTooltip({
      autoHide: false,
      showOn: 'click',
      animation: false,
      position: 'bottom',
      width: 120,
      show: function () {
        this.popup.element.addClass('code-header-tooltip');
        $('.code-header-tooltip').removeClass('hidden');
        $('#codeHeaderTooltip').show();
        codeTooltipFlag = true;
      },
      hide: codeTooltipHidden,
      content: $('#codeHeaderTooltip')
    }).data('kendoTooltip');

    $('#codeHeader').click(function (e) {
      $(this).addClass('ribbon-header-click');
      codeHeaderKendoTooltip.show();
      e.stopPropagation();
    });
    function codeTooltipHidden() {
      setTimeout(function () {
        if (codeTooltipFlag) {
          codeHeaderKendoTooltip.show();
        }
      }, 0);
    }

    $(document).on('click', '.code-header-tooltip a.k-icon.k-i-close', function () {
      $('#codeHeader').removeClass('ribbon-header-click');
      $('.code-header-tooltip').addClass('hidden');
      codeTooltipFlag = false;
    });

    $('#layoutHeaderTooltip').hide();
    var layoutHeaderKendoTooltip = $('#layoutHeaderImage').kendoTooltip({
      autoHide: false,
      showOn: 'click',
      animation: false,
      position: 'bottom',
      width: 210,
      show: function () {
        this.popup.element.addClass('layout-header-tooltip');
        $('.layout-header-tooltip').removeClass('hidden');
        $('#layoutHeaderTooltip').show();
        layoutTooltipFlag = true;
      },
      hide: layoutTooltipHidden,
      content: $('#layoutHeaderTooltip')
    }).data('kendoTooltip');

    $('#layoutHeader').click(function (e) {
      $(this).addClass('ribbon-header-click');
      layoutHeaderKendoTooltip.show();
      e.stopPropagation();
    });
    $(document).on('click', '.layout-header-tooltip a.k-icon.k-i-close', function () {
      $('#layoutHeader').removeClass('ribbon-header-click');
      $('.layout-header-tooltip').addClass('hidden');
      layoutTooltipFlag = false;

    });
    function layoutTooltipHidden() {
      setTimeout(function () {
        if (layoutTooltipFlag) {
          layoutHeaderKendoTooltip.show();
        }
      }, 0);
    }

    $('#standardControlTooltip').hide();
    var standardKendoTooltip = $('#standardControlImage').kendoTooltip({
      autoHide: false,
      showOn: 'click',
      animation: false,
      position: 'bottom',
      width: 180,
      show: function () {
        this.popup.element.addClass('standard-control-header-tooltip');
        $('.standard-control-header-tooltip').removeClass('hidden');
        $('#standardControlTooltip').show();
        standardTooltipFlag = true;
      },
      hide: standardTooltipHidden,
      content: $('#standardControlTooltip')
    }).data('kendoTooltip');

    $(document).on('click', '.standard-control-header-tooltip a.k-icon.k-i-close', function () {
      $('#standardControlsHeader').removeClass('ribbon-header-click');
      $('.standard-control-header-tooltip').addClass('hidden');
      standardTooltipFlag = false;
    });

    $('#standardControlsHeader').click(function (e) {
      $(this).addClass('ribbon-header-click');
      standardKendoTooltip.show();
      e.stopPropagation();
    });
    function standardTooltipHidden() {
      setTimeout(function () {
        if (standardTooltipFlag) {
          standardKendoTooltip.show();
        }
      }, 0);
    }

    $('#combinedControlTooltip').hide();

    var combinedKendoTooltip = $('#combinedControlImage').kendoTooltip({
      autoHide: false,
      showOn: 'click',
      animation: false,
      position: 'bottom',
      width: 180,
      show: function () {
        this.popup.element.addClass('combined-control-header-tooltip');
        $('.combined-control-header-tooltip').removeClass('hidden');
        $('#combinedControlTooltip').show();
        combinedTooltipFlag = true;
      },
      hide: combinedTooltipHidden,
      content: $('#combinedControlTooltip')
    }).data('kendoTooltip');

    $('#combinedControlsHeader').click(function (e) {
      $(this).addClass('ribbon-header-click');
      combinedKendoTooltip.show();
      e.stopPropagation();
    });
    function combinedTooltipHidden() {
      setTimeout(function () {
        if (combinedTooltipFlag) {
          combinedKendoTooltip.show();
        }
      }, 0);
    }

    $(document).on('click', '.combined-control-header-tooltip a.k-icon.k-i-close', function () {
      combinedTooltipFlag = false;
      $('#combinedControlsHeader').removeClass('ribbon-header-click');
      $('.combined-control-header-tooltip').addClass('hidden');
    });
  }

  /* below function validates the empty form width textbox & empty grid panel selection
   and sets appropriate error message. */
  function validateControls() {

    var txtError = true, panelError = true;

    /* below are the error message divs needs to be removed if messages are visible. */
    $(LAYOUTSELECTOR_CONST.widthError).removeClass('errorMessage').text('');
    $(LAYOUTSELECTOR_CONST.panelError).removeClass('errorMessage').text('');
    if (LAYOUTSELECTOR_CONST.formWidthDropDown.css('display') === 'none') {
      if (LAYOUTSELECTOR_CONST.formCustomWidth.val().length <= 0) {
        txtError = true;
        $(LAYOUTSELECTOR_CONST.widthError).addClass('errorMessage').text(LAYOUTSELECTOR_CONST.emptyFormWidthErrMsg);
        LAYOUTSELECTOR_CONST.formCustomWidth.focus();
      }
      else if (LAYOUTSELECTOR_CONST.formCustomWidth.val() > 4000 || LAYOUTSELECTOR_CONST.formCustomWidth.val() < 600) {
        txtError = true;
        $(LAYOUTSELECTOR_CONST.widthError).addClass('errorMessage').text(LAYOUTSELECTOR_CONST.minmaxFormWidthErrMsg);
        LAYOUTSELECTOR_CONST.formCustomWidth.focus();
      }
      else {
        txtError = false;
      }
    }
    else {
      txtError = false;
    }
    /* Validation to check there should be at least 1 grid panel to be selected in grid layout wizard.*/
    if (LAYOUTSELECTOR_CONST.selectedCells.find('.ui-selected').length <= 0) {
      panelError = true;
      $(LAYOUTSELECTOR_CONST.panelError).addClass('errorMessage').text(LAYOUTSELECTOR_CONST.panelSelectionErrMsg).focus();
    }
    else {
      panelError = false;
    }
    if (!txtError && !panelError) {
      return true;
    }
  }

  /* below function contains the logic which gets executed on click of Build button
   in Layout Selector Wizard. */
  function buildLayoutOnWorkSpace() {

    LAYOUTSELECTOR_CONST.tableWizardBuildButton.on('click', function (e) {
      e.preventDefault();
      if (validateControls()) {
        /* To set formWidth only once instead of setting it after each Layout Selection*/
        $(ribbonHeader).removeClass('disabled-click');
        $(ribbonHeader).attr('data-disabled-header', 'false');
        if (workspace.getGridPanelCount() === 0) {
          formWidth = LAYOUTSELECTOR_CONST.formWidthDropDown.css('display') !== 'none' ?
            LAYOUTSELECTOR_CONST.formWidthDropDown.val() : LAYOUTSELECTOR_CONST.formCustomWidth.val();
          gridSpacing = LAYOUTSELECTOR_CONST.formSpacing.val();
          if (formWidth !== 'Default') {
            LAYOUTSELECTOR_CONST.formBuilderForm.width(formWidth);
          }
        }

        /* below function generates the grid panel in workspace container. It internally calls Gridster functionality to set grid spacing value & width. */
        layoutGrid.createGridPanels(gridSpacing);

        /* triggers the close(x) button click event of layout selector wizard. */
        layoutWizard.hide();

        /* set "builderWorkspace" div's position property to absolute to position grid panels */
        LAYOUTSELECTOR_CONST.builderWorkspace.css('position', 'absolute');
        /* enables the move/resize mode*/
        $(workSpaceConstant.modeMoveClass).attr('disabled', false);
        $(workSpaceConstant.modePropertyClass).attr('disabled', false);
      }
    });

  }

  return {
    init: function () {
      initLayoutWizard();
      initLayoutSliders();
      initRibbonPanel();
      initLayoutWizardControls();
      initRibbonHeader();
      initControlToolbar();
      /* below function contains the functionality which gets executed after click on
       Build button in Layout Selector Wizard. */
      buildLayoutOnWorkSpace();
    },
    initRibbonControls: function (disabledStatus) {
      $(controlButtonClass).draggable({disabled: disabledStatus, revert: true});
    },
    LAYOUTSELECTOR_CONST: LAYOUTSELECTOR_CONST
  };

}());

elli.builder.layoutribbon.init();
