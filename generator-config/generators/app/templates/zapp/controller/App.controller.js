sap.ui.define([
    "./BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("<%= nmsp %>.controller.App", {

        onInit : function () {
            var oView = this.getView();
            var oServerModel = this.getOwnerComponent().getModel();
            var fnBusy = function() {
                oView.setBusy(false);
            };

            oView.setBusy(true);
            
            Promise.allSettled([
                oServerModel.metadataLoaded(),
                oServerModel.annotationsLoaded()
            ]).then(fnBusy);

            oServerModel.attachMetadataFailed(fnBusy);
            oServerModel.attachAnnotationsFailed(fnBusy);

            oView.addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }

    });

});