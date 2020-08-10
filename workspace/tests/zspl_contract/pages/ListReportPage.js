sap.ui.define([
    "sap/ui/test/Opa5",
    "commons/BasePage"
], function (Opa5, BasePage) {
    "use strict";
    
    Opa5.createPageObjects({
        onListReportPage: {
            baseClass: BasePage,
            viewName: "ListReport.view.ListReport",
            actions: {},
            assertions: {}
        }
    });
});