(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineViewListData', PipelineViewListData);

  function PipelineViewListData(Restangular, _, PipelineDataStore, PipelineConst) {
    return {
      resolvePromise: function () {
        PipelineDataStore.ManageViewListLoaded = false;
        return Restangular.all('pipeline/view/getlistofviews').getList().then(function (response) {
          var listOfViews = _.sortBy(response, function (item) {
            return item.Type + item.ViewName.toLowerCase();
          });
          // find first item with type System and set isSeparator true
          var separatorPosition = _.findWhere(listOfViews, {
            Type: PipelineConst.System
          });
          // using !! to handle null condition
          if (separatorPosition !== 'undefined' && !!separatorPosition) {
            separatorPosition.isSeparator = true;
          }
          angular.copy(Restangular.stripRestangular(listOfViews), PipelineDataStore.PipelineViewListDataStore.items);
          _.each(PipelineDataStore.PipelineViewListDataStore.items, function (dataItem) {
            dataItem.Name = dataItem && dataItem.Type && dataItem.Type === PipelineConst.System ?
            dataItem.PersonaName + ' - ' + dataItem.ViewName : dataItem.ViewName;
            dataItem.Default = dataItem && dataItem.IsDefault ? 'Yes' : '';
          });
          PipelineDataStore.ManageViewListLoaded = true;
        });
      }
    };
  }
}());
