sap.ui.define([
    "sb/fiori/mockserver/spl/ODataUtils",
    "sb/fiori/mockserver/spl/mockcombiner",
    "sb/fiori/mockserver/spl/utils/urlParser"
], function (ODataUtils, MockServer, urlParser) {

    return {

        getAllServices: function () {
            return [
                "ZFPI_ODATA_SRV"
            ];
        },

        start: function () {
            var aServiceNamesToStart = this.getAllServices();
            var aPromises = aServiceNamesToStart.map(function (sServiceName) {
                return this.prepareCustomRequests(sServiceName)
                    .then(function () {
                        this.startService(sServiceName);
                    }.bind(this))
                    .then(function () {
                        return this.attachHooks(sServiceName);
                    }.bind(this));
            }.bind(this));
            return Promise.all(aPromises).then(function () {
                return ODataUtils.metadataLoaded(aServiceNamesToStart);
            });
        },

        startService: function (sServiceName) {
            var sServicePath = "sb.fiori.mockserver.spl." + sServiceName;
            MockServer.startService(sServiceName, sServicePath);
        },

        prepareCustomRequests: function (sServiceName) {
            return new Promise(function (res, rej) {
                var sBaseMockServerPath = "sb/fiori/mockserver/spl/" + sServiceName;
                var sPathToConfig = sBaseMockServerPath + "/config";
                $.getJSON($.sap.getModulePath(sPathToConfig) + ".json", function (Config) {
                    var sExtensionsDir = Config.basePath;
                    var aRequestPaths = Config.customRequests.map(function (sRequestName) {
                        return sBaseMockServerPath + "/" + "/" + sExtensionsDir + "/" + sRequestName;
                    });
                    sap.ui.require(aRequestPaths, function () {
                        Array.from(arguments).forEach(function (oRequest) {
                            oRequest.apply();
                        });
                        res();
                    });
                });
            });
        },

        attachHooks: function (sServiceName) {
            return new Promise(function (res, rej) {
                var sBaseMockServerPath = "sb/fiori/mockserver/spl/" + sServiceName;
                var sPathToConfig = sBaseMockServerPath + "/config";
                $.getJSON($.sap.getModulePath(sPathToConfig) + ".json", function (Config) {
                    var sExtensionsDir = Config.basePath;
                    var aRequestPaths = Config.hooks.map(function (sRequestName) {
                        return sBaseMockServerPath + "/" + sExtensionsDir + "/" + sRequestName;
                    });
                    sap.ui.require(aRequestPaths, function () {
                        Array.from(arguments).forEach(function (oRequest) {
                            oRequest.apply();
                        });
                        res();
                    });
                });
            });
        }
    };

});