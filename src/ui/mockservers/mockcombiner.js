sap.ui.define([
    "sap/ui/core/util/MockServer"
], function (MockServer) {
    "use strict";

    var ROOT_URI = "/sap/opu/odata/SAP/";
    var aRequests = [];
    var sPath = "";

    var oUriParameters = jQuery.sap.getUriParameters();

    return {

        start: function (aMockservers) {
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: oUriParameters.get("serverDelay") || 100
            });

            this.sFirstNameMockServer = aMockservers[0];
            this.startAll(aMockservers);
        },

        startAll: function (aServiceName) {
            aServiceName.forEach(function (SERVICE_NAME) {
                this.startService(SERVICE_NAME, "sb.fiori.mockserver.spl." + SERVICE_NAME);
            }.bind(this));
        },

        startService: function (SERVICE_NAME, SERVICE_PATH) {
            this[SERVICE_NAME] = new MockServer({
                rootUri: ROOT_URI
            });
            var sPath = jQuery.sap.getModulePath(SERVICE_PATH);
            this[SERVICE_NAME].simulate(sPath + "/metadata.xml", {
                sMockdataBaseUrl: sPath + "/mockdata",
                bGenerateMissingMockData: true
            });

            this.addRequests(this[SERVICE_NAME].getRequests().map(function (oRequest) {
                var sRequestStr = oRequest.path.toString();
                oRequest.path = new RegExp(SERVICE_NAME + "/" + sRequestStr.substring(1, sRequestStr.length - 1));
                return oRequest;
            }));

            this[SERVICE_NAME].setRequests(aRequests);
            aRequests = [];
            this.enableDebugMode(this[SERVICE_NAME], true, SERVICE_NAME);

            this[SERVICE_NAME].start();
        },

        addRequests: function (aNewRequests) {
            aRequests = aRequests.concat(aNewRequests);
        },

        getRequests: function (SERVICE_NAME) {
            // create
            var oGetMockServer = new MockServer({
                rootUri: ROOT_URI
            });

            // simulate
            sPath = jQuery.sap.getModulePath("sb.fiori.mockserver.spl." + SERVICE_NAME);
            oGetMockServer.simulate(sPath + "/metadata.xml", {
                sMockdataBaseUrl: sPath + "/mockdata",
                bGenerateMissingMockData: true
            });

            return oGetMockServer.getRequests().map(function (oRequest) {
                var sRequestStr = oRequest.path.toString();
                oRequest.path = new RegExp(SERVICE_NAME + "/" + sRequestStr.substring(1, sRequestStr.length - 1));
                return oRequest;
            });
        },

        getInstance: function (sName) {
            var oMockServer = this[sName];
            return oMockServer;
        },

        enableDebugMode: function (oMockServer, enabled, SERVICE_NAME) {
            function beautifyUrl(sFullUrl, sCommonPrefix) {
                var beautifiedString = sFullUrl;
                if (sFullUrl.startsWith(sCommonPrefix)) {
                    beautifiedString = sFullUrl.substring(sCommonPrefix.length);
                }
                return beautifiedString;
            }

            function logRequest(oXhr, sTriggeredBy) {
                var sFullServiceUri = ROOT_URI + SERVICE_NAME;
                var sUrl = beautifyUrl(oXhr.url, sFullServiceUri);
                var sMessage = "\nMockServer::" + sTriggeredBy + " " + oXhr.method + "\n" + sUrl + "\n";

                if (oXhr.status >= 400) {
                    // eslint-disable-next-line no-console
                    console.error(sMessage, oXhr);
                } else if (oXhr.status >= 300) {
                    // eslint-disable-next-line no-console
                    console.warn(sMessage, oXhr);
                } else {
                    // eslint-disable-next-line no-console
                    console.log(sMessage, oXhr);
                }
            }

            function handleRequest(oEvent, sTriggeredBy) {
                var oXhr = oEvent.getParameters().oXhr;
                logRequest(oXhr, sTriggeredBy);
            }

            if (enabled) {
                Object.keys(MockServer.HTTPMETHOD).forEach(function (sMethodName) {
                    var sMethod = MockServer.HTTPMETHOD[sMethodName];
                    oMockServer.attachAfter(sMethod, function (oEvent) {
                        handleRequest(oEvent, "after");
                    });
                });
            }
        }

    };

});