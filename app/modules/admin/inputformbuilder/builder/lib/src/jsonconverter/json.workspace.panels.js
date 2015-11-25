elli.builder.workspacePanels = (function () {
  'use strict';
  var builder = elli.builder,
    formSchemaConstant = builder.constant.formSchema,
    formschemaupdate = builder.update;
  return {
    getAllPanels: function () {
      var panels = [];

      if ($('.workspace .gridContainer .gridListContainer li').length > 0) {
        $('.workspace .gridContainer .gridListContainer li.grid_panel').each(function () {
          var panel = {
            id: this.getAttribute('id'),
            row: this.getAttribute('data-row'),
            col: this.getAttribute('data-col'),
            rowspan: this.getAttribute('data-sizey'),
            colspan: this.getAttribute('data-sizex'),
            style: this.getAttribute('style')
          };
          panels.push(panel);
        });

        return panels;
      }
    },
    updateFormPanelsSchema: function () {
      formschemaupdate.updateFormSchema(formSchemaConstant.Panels, builder.workspacePanels.getAllPanels());
    }
  };

}());
