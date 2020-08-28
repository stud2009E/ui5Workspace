sap.ui.define([
    "./BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("<%= dotnsp %>.controller.App", {

        onInit : function () {
            var oView = this.getView();
            var oServerModel = this.getOwnerComponent().getModel();
            var fnBusy = function() {
                oView.setBusy(false);
            };

            oView.setBusy(true);
            oServerModel.metadataLoaded().then(fnBusy);
            oServerModel.attachMetadataFailed(fnBusy);

            oView.addStyleClass(this.getOwnerComponent().getContentDensityClass());
        }

    });

});