sap.ui.define([
    "./BaseController"
], function (
    BaseController
) {
    "use strict";

    return BaseController.extend("<%= dotnsp %>otnsp %>.controller.Main", {

        onInit : function () {

            this.getRouter().getRoute("main").attachMatched(this._onRouteMatch, this);
        },

        /**
         * handle route match event
         * @param {sap.ui.base.Event} oEvent 
         */
        _onRouteMatch: function(oEvent){



        }

    });

});