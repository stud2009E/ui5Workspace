sap.ui.define([
    "sap/ui/test/Opa5"
], function (Opa5) {
    "use strict";

    var Frame = Opa5.extend("Frame", {

        fioriLaunchpadPath: "/fiori-remote",

        iStartMyAppWithHash: function (sHash) {
            sHash = (sHash) ? sHash : "#Shell-home";
            var sBasePath = this.fioriLaunchpadPath + "?&sap-language=RU&serverDelay=0";
            this.iStartMyAppInAFrame(sBasePath + "#" + sHash);
        }
    });

    return Frame;
});