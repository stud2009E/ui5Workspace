sap.ui.define([
    "sap/ui/test/Opa5",
    "commons/BasePage"
], function (Opa5, BasePage) {
    "use strict";

    Opa5.createPageObjects({
        onObjectPage: {
            baseClass: BasePage,
            viewName: "ObjectPage.view.Details",
            actions: {},
            assertions: {}
        }
    });
});