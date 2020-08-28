sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],function(
    JSONModel,
    Device
) {
    "use strict";

    return {

        /**
         * create device model
         * @returns {sap.ui.model.json.JSONModel} 
         */
        createDeviceModel : function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        /**
         * create state model
         * @returns {sap.ui.model.json.JSONModel}
         */
        createStateModel: function(){
            var oModel = new JSONModel();
            return oModel;
        }
    };

});