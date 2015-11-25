/**
 * Created by mgurushanthappa on 7/21/2015.
 */
function setUpHTMLFixture() {
  'use strict';
  jasmine.getFixtures().fixturesPath = 'base/test/fixture';
  loadFixtures('indexfixture.html');
}
setUpHTMLFixture();
define.amd = false;
define(['lib/src/layout/layout.ribbon'], function () {
  'use strict';
  var layoutRibbon = elli.builder.layoutribbon;
  describe('Testing ribbon function in layout ribbon', function () {
    it('Should have defined init', function () {
      expect(layoutRibbon.init).toBeDefined();
    });

    it('Should have called init on calling init', function () {
      spyOn(layoutRibbon, 'init');
      layoutRibbon.init();
      expect(layoutRibbon.init).toHaveBeenCalled();
    });


    it('Should show hide divs on calling init', function () {
      spyOn(layoutRibbon, 'init');
      layoutRibbon.init();
      expect(layoutRibbon.LAYOUTSELECTOR_CONST.formSpacing.val()).toEqual('2');
      expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthShowHideDiv).not.toBeVisible();
      expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown.val()).toEqual('Default');
      expect(layoutRibbon.LAYOUTSELECTOR_CONST.formCustomWidth.val()).toEqual(undefined);
    });

    it('Should init RibbonHeader on calling init', function () {
      spyOn(layoutRibbon, 'init');
      layoutRibbon.init();
      expect($('#codeHeaderTooltip')).not.toBeVisible();
      expect($('#layoutHeaderTooltip')).not.toBeVisible();
      expect($('#standardControlTooltip')).not.toBeVisible();
    });

    /*it('Should get data from toolbox.json on init called', function () {
      spyOn($, 'ajax').and.callFake(function (options) {
        options.success();
      });
      var callback = jasmine.createSpy();
      $.ajax({url: '/api/fb/ControlToolbox.json'}, callback);
      expect(callback).toHaveBeenCalled();
    });*/

     it('should set properties on click of layoutWizardButton', function() {
     $(layoutRibbon.LAYOUTSELECTOR_CONST.layoutWizardButton).trigger('click');
     setTimeout(function() {
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthShowHideDiv).not.toBeVisible();
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown).toBeVisible();
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown.val()).toEqual(
     layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDownDefaultVal);
     expect((layoutRibbon.LAYOUTSELECTOR_CONST.widthSlider).slider('option', 'value')).
     toEqual(layoutRibbon.LAYOUTSELECTOR_CONST.widthSliderMinVal);
     //it should call reset wizard layout
     expect(layoutRibbon.wizardLayoutParams.rowSpan).toEqual(1);
     expect(layoutRibbon.wizardLayoutParams.colSpan).toEqual(6);
     expect(layoutRibbon.wizardLayoutParams.cols).toEqual(layoutRibbon.WIZARD_CONST.minColumns);
     expect(layoutRibbon.wizardLayoutParams.rows).toEqual(layoutRibbon.WIZARD_CONST.maxRows);
     expect($('#selectableCells')).not.toBeVisible();
     expect($('#manualContrls')).not.toBeVisible();
     expect($('#tableLayoutSelect')).not.toBeInDOM();
     //it calls buildSelectableTable
     expect($('#selectableCells').find('table').length).toBeGreaterThan(0);
     expect((layoutRibbon.LAYOUTSELECTOR_CONST.tableLayoutSelect).find('td').hasClass('ui-selected')).toBe(false);
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.panelCol.text()).toEqual('');
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.panelRowColSeperator.text()).toEqual('');
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.panelRow.text()).toEqual('');
     expect((layoutRibbon.LAYOUTSELECTOR_CONST.spacingSlider).slider('option', 'value')).toEqual(
     layoutRibbon.LAYOUTSELECTOR_CONST.formSpacingMinValue);
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formSpacing.val()).toEqual(layoutRibbon.LAYOUTSELECTOR_CONST.formSpacingMinValue);

     expect($(layoutRibbon.LAYOUTSELECTOR_CONST.widthError).hasClass('errorMessage')).toBe(false);
     expect($(layoutRibbon.LAYOUTSELECTOR_CONST.panelError).hasClass('errorMessage')).toBe(false);
     expect($(layoutRibbon.LAYOUTSELECTOR_CONST.widthError).text()).toEqual('');
     expect($(layoutRibbon.LAYOUTSELECTOR_CONST.panelError).text()).toEqual('');

     }, 100);
     });

     it('Should select wizard option on click of wizardOptions span', function() {
     $('#wizardOptions span').trigger('click');
     setTimeout(function() {
     expect($('#option').text()).toEqual('Advanced...');
     expect($('#selectableCells')).toBeVisible();
     expect($('#manualControls')).not.toBeVisible();
     }, 100);
     });

     it('Should expand panel on click of ribbonCollapseBar with class span.k-i-arrowhead-n', function() {
     $('#ribbonCollapseBar.span.k-i-arrowhead-n').trigger('click');
     setTimeout(function() {
     expect($('#ribbonCollapseBar').hasClass('k-i-arrowhead-n')).toBe(false);
     expect($('#ribbonCollapseBar').hasClass('k-i-arrowhead-s')).toBe(true);
     expect($('.ribbonLayoutControlsContainer div span')).not.toBeVisible();
     }, 50);
     });

     it('Should collapse panel on click of ribbonCollapseBar with class span.k-i-arrowhead-s', function() {
     $('#ribbonCollapseBar.span.k-i-arrowhead-s').trigger('click');
     setTimeout(function() {
     expect($('#ribbonCollapseBar').hasClass('k-i-arrowhead-s')).toBe(false);
     expect($('#ribbonCollapseBar').hasClass('k-i-arrowhead-n')).toBe(true);
     expect($('.ribbonLayoutControlsContainer div span')).toBeVisible();
     }, 50);
     });

     it('Should set spacing slider value on keyup event of form spacing', function() {
     $(layoutRibbon.LAYOUTSELECTOR_CONST.formSpacing).trigger('keyup');
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.spacingSlider.slider('option', 'value')).toBeLessThan(21);
     });

     it('Should set spacing slider value on focusout event of form spacing', function() {
     $(layoutRibbon.LAYOUTSELECTOR_CONST.formSpacing).trigger('focusout');
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.spacingSlider.slider('option', 'value')).toBeGreaterThan(1);
     });

     it('Should show div on change event of formWidthDropDown', function() {
     spyOn(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown, 'val').and.returnValue('Custom');
     (layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown).trigger('change');
     setTimeout(function() {
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown).not.toBeVisible();
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthShowHideDiv).toBeVisible();
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formCustomWidth.val()).toEqual('');
     expect(layoutRibbon. LAYOUTSELECTOR_CONST.formCustomWidth.focus).toHaveBeenCalled();
     }, 20);
     });

     it('Should show/hide divs on click of .form-width-change-label', function() {
     $('.form-width-change-label').trigger('click');
     setTimeout(function() {
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthShowHideDiv).not.toBeVisible();
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown).toBeVisible();
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDown.val()).toEqual(
     layoutRibbon.LAYOUTSELECTOR_CONST.formWidthDropDownDefaultVal);
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.widthError).hasClass('errorMessage').toBe(false);
     expect(layoutRibbon.LAYOUTSELECTOR_CONST.widthError.text()).toEqual('');
     }, 20);
     });

     it('Should add class hidden on click of .code-header-tooltip a.k-icon.k-i-close', function() {
     setTimeout(function() {
     ($('.code-header-tooltip a.k-icon.k-i-close')).trigger('click');
     expect($('.code-header-tooltip').hasClass('hidden')).toBe(true);
     }, 100);
     });

     it('Should add class hidden on click of .layout-header-tooltip a.k-icon.k-i-close', function() {
     setTimeout(function() {
     ($('.layout-header-tooltip a.k-icon.k-i-close')).trigger('click');
     expect($('.layout-header-tooltip').hasClass('hidden')).toBe(true);
     }, 100);
     });

     it('Should add class hidden on click of .standard-control-header-tooltip a.k-icon.k-i-close', function() {
     setTimeout(function() {
     ($('.standard-control-header-tooltip a.k-icon.k-i-close')).trigger('click');
     expect($('.standard-control-header-tooltip').hasClass('hidden')).toBe(true);
     }, 100);
     });
  });
});
