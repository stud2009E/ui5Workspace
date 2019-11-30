sap.ui.define([
    "sap/ui/model/odata/v2/ODataModel"
], function (ODataModel) {

    var mModelMap = {};
    var SERVICE_PREFIX = "/sap/opu/odata/SAP/";

    return {

        getODataModel: function (sServiceName) {
            return mModelMap[sServiceName];
        },

        metadataLoaded: function (aServices) {
            var aPromises = aServices.map(function (sServiceName) {
                var oModel = new ODataModel(SERVICE_PREFIX + sServiceName);
                mModelMap[sServiceName] = oModel;
                return oModel.metadataLoaded();
            });
            return Promise.all(aPromises);
        },

        createKey: function (sODataService, sEntitySet, oKeyParams) {
            sODataService = sODataService;
            return mModelMap[sODataService].createKey("/" + sEntitySet, oKeyParams);
        },

        getEntitySetNameByUrl: function (sUrl) {
            return sUrl.substring(sUrl.lastIndexOf("/") + 1, sUrl.lastIndexOf("("));
        },

        getKeyByUrl: function (sUrl) {
            return sUrl.substring(sUrl.lastIndexOf("/"));
        },

        addMetadata: function (sODataService, oMockEntity) {
            var sPath = this.createKey(sODataService, oMockEntity.getEntitySetName(), oMockEntity.getProperties());
            var sEntityType = oMockEntity.getEntitySetName().split("Set")[0];
            var oMetadata = {
                id: SERVICE_PREFIX + sODataService + sPath,
                type: sODataService + "." + sEntityType,
                uri: SERVICE_PREFIX + sODataService + sPath
            };
            oMockEntity.properties.__metadata = oMetadata;
        }

    };

});