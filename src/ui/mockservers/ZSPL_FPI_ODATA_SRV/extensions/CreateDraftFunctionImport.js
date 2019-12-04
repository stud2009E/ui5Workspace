sap.ui.define([
    "sb/fiori/mockserver/spl/mockcombiner"
], function (mockcombiner) {

    return {

        apply: function () {
            mockcombiner.addRequests([this.onCreateDraft()]);
        },

        onCreateDraft: function () {
            return {
                method: "GET",
                path: /ZSPL_FPI_ODATA_SRV\/CreateDraft\?.*/,
                response: function (oXhr) {
                    var sUrl = oXhr.url;
                    var sFpiNumber = this.parseNumber(sUrl);
                    var headers = {
                        "Content-Type": "application/json;charset=utf-8"
                    };
                    oXhr.respond(200, headers, JSON.stringify({
                        d: {
                            "FpiNum": sFpiNumber,
                            "FpiPos": "0001"
                        }
                    }));
                }.bind(this)
            };
        },

        parseNumber: function (sUrl) {
            var rgNumber = /.*FpiNum='(.*)'$/;
            var aMatchedGroups = rgNumber.exec(sUrl);
            if (aMatchedGroups.length < 2) {
                throw new Error("Expected 'FpiNum' url parameter");
            }
            return aMatchedGroups[1];
        }
    };
});