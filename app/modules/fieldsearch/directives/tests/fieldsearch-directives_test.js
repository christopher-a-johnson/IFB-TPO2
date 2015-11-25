(function () {
  'use strict';
  describe('Test Field Search Directives', function () {
    var rootscope, scope, compile;
    //Load app module
    beforeEach(module('elli.encompass.web'));

    //Assign injected services/mocked http to the local variables
    beforeEach(inject(function ($rootScope, $compile) {
      rootscope = $rootScope;
      scope = rootscope.$new();
      compile = $compile;
    }));

    function compileDirective(html) {
      //Get the jqLite or jQuery element
      var elem = angular.element(html);

      //Compile the element into a function to process the view.
      var compiled = compile(elem);

      //Run the compiled view -- Link the template with the scope
      compiled(scope);

      //CSS styles are not applied to elements until they get added to the DOM.
      //This is how a browser engine works
      angular.element(document).find('body').append(elem);

      //Call digest on the scope!
      //All $watched expressions or functions are checked for model change
      //And if a mutation is detected, the $watch listener is called.
      scope.$digest();

      return elem;
    }

    //Test enter key
    //it('Enter Key should call a method defined in controller', function () {
    //  scope.enterFunc = function () {
    //  };
    //  spyOn(scope, 'enterFunc');
    //
    //  var elem = compileDirective('<input type="text" field-search-enterkey="enterFunc()">');
    //
    //  //Defined the enter event
    //  var event = angular.element.Event('keydown');
    //  event.which = 13;
    //
    //  //Hit the enter key
    //  elem.trigger(event);
    //
    //  //Assertion
    //  expect(scope.enterFunc).toHaveBeenCalled();
    //});

    //Test splitter directive
    it('Splitter should change the div height ', inject(function (SearchService, FSCONSTANTS) {
      var testHtml = '<div field-search-splitter>' +
        '<div class="analysisrightupper-kendo" style="height: 250px">' +
        '<div id="upperGrid1" style="height: 200px">' +
        '<div class="k-grid-header" style="height: 25px"></div>' +
        '<div class="k-grid-content"></div>' +
        '</div>' +
        '</div>' +
        '<div id="searchHistoryGrid1" class="fs-search-history" style="height: 30px">' +
        '<div class="k-grid-content"></div>' +
        '</div>' +
        '</div>' +
        '<div style="height: 100px" class="fs-detail-results-section">' +
        '<div class="analysislowerleft"/>' +
        '<div class="analysislowerleft-inline"/>' +
        '<div class="analysislowerright-kendo"/>' +
        '<div class="ngen-lower-right-tab-strip" style="height: 30px">' +
        '<div id="fs-lower-right-grid" class="fs-lower-right-grid-div">' +
        '<div class="k-grid-content"></div>' +
        '</div>' +
        '</div>' +
        '</div>';

      var testElem = compileDirective(testHtml);

      //CSS styles are not applied to elements until they get added to the DOM.
      //This is how a browser engine works
      angular.element(document).find('body').append(testElem);

      SearchService.broadcastSearch(FSCONSTANTS.SPLITTEREVENT);

      //Assertion
      //Per line 11 of fieldsearch-splitter-directive.js: rightUpperSection.offsetHeight - 24
      expect(angular.element('#upperGrid1').css('height')).toEqual('226px');
      //Per line 16 of fieldsearch-splitter-directive.js:upperGrid.offsetHeight - 193
      expect(angular.element('.fs-search-history').css('height')).toEqual('35px');
      //Per line 20 of fieldsearch-splitter-directive.js:upperGrid.offsetHeight - upperGridHeader.offsetHeight - 3
      expect(angular.element('#upperGrid1 div.k-grid-content').css('height')).toEqual('201px');
      //Per line 26 of fieldsearch-splitter-directive.js:searchHistoryGrid.offsetHeight - 3 and line 16
      expect(angular.element('#searchHistoryGrid1 div.k-grid-content').css('height')).toEqual('33px');
      //Per line 31 of fieldsearch-splitter-directive.js:lowerSection.offsetHeight - 44
      expect(angular.element('.analysislowerleft').css('height')).toEqual('72px');
      //Per line 32 of fieldsearch-splitter-directive.js:lowerSection.offsetHeight - 36
      expect(angular.element('.analysislowerleft-inline').css('height')).toEqual('60px');
      //Per line 33 of fieldsearch-splitter-directive.js:lowerSection.offsetHeight - 28
      expect(angular.element('.analysislowerright-kendo').css('height')).toEqual('74px');
      //Per line 37 of fieldsearch-splitter-directive.js:lowerSection.offsetHeight - lowerRightTabStripHeader.offsetHeight - 30
      expect(angular.element('#fs-lower-right-grid').css('height')).toEqual('30px');
      //Per line 38 of fieldsearch-splitter-directive.js:lowerSection.offsetHeight - lowerRightTabStripHeader.offsetHeight - 49
      expect(angular.element('#fs-lower-right-grid div.k-grid-content').css('height')).toEqual('11px');
    }));

    //Test clearable directive
    it('Clearable should toggle the clearable class for mousover and mouseout event', inject(function (FSCONSTANTS) {
      var elem = compileDirective('<input type="text" value="test" class="clearable" field-search-clearable>');

      //Unit testing line #23 of fieldsearch-clearable-directive.js
      //NGEN-1997
      var event = angular.element.Event(FSCONSTANTS.MOUSEOVEREVENT);

      //Trigger event
      elem.trigger(event);

      //Assertion
      expect(elem.hasClass('x')).toBe(true);

      //Unit testing line #27 of fieldsearch-clearable-directive.js
      var inputEvent = angular.element.Event(FSCONSTANTS.INPUTEVENT);
      var moEvent = angular.element.Event(FSCONSTANTS.MOUSEOUTEVENT);

      //Trigger event, need to trigger input event first to have x class added
      //NGEN-1997: remove the following line after this story is fixed.
      elem.trigger(inputEvent);

      //Trigger mouseout event to have x class removed
      elem.trigger(moEvent);

      //Assertion
      expect(elem.hasClass('x')).toBe(false);
    }));

    it('Clearable should toggle the clearable class for input and focusout event', inject(function (FSCONSTANTS) {
      var elem = compileDirective('<input type="text" value="test" class="clearable" field-search-clearable>');

      //Unit testing line #8 of fieldsearch-clearable-directive.js
      //Defined the input event
      var event = angular.element.Event(FSCONSTANTS.INPUTEVENT);

      //Trigger event
      elem.trigger(event);

      //Assertion
      expect(elem.hasClass('x')).toBe(true);

      //Unit testing line #17 of fieldsearch-clearable-directive.js
      event = angular.element.Event(FSCONSTANTS.FOCUSOUTEVENT);

      //Trigger event
      elem.trigger(event);

      //Assertion
      expect(elem.hasClass('x')).toBe(false);
    }));

    it('Clearable should toggle the clearable class for mousemove and click event', inject(function (FSCONSTANTS) {
      var elem = compileDirective('<input type="text" value="test" class="clearable" field-search-clearable>');

      //Unit testing line #11 of fieldsearch-clearable-directive.js
      var inputEvent = angular.element.Event(FSCONSTANTS.INPUTEVENT);
      var event = angular.element.Event(FSCONSTANTS.MOUSEMOVEEVENT);
      event.clientX = '181';

      //Trigger event, need to trigger input event first to have x class added
      elem.trigger(inputEvent);
      elem.trigger(event);

      //Assertion
      //expect(elem.hasClass('onX')).toBe(true);

      //Unit testing line #14 of fieldsearch-clearable-directive.js
      event = angular.element.Event(FSCONSTANTS.CLICKEVENT);

      //Trigger event
      elem.trigger(event);

      //Assertion
      expect(elem.hasClass('onX')).toBe(false);
    }));

    afterEach(function () {
      //Stop propagation of $digest calls into the child scope
      scope.$destroy();
    });
  });
})();
