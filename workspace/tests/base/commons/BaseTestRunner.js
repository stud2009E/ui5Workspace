sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/gherkin/opa5TestHarness",
    "commons/Frame",
    "commons/BasePage"
], function (Opa5, opa5TestHarness, Arrangement, BasePage) {

    return {

        run: function (oConfig) {
            Opa5.extendConfig({
                viewNamespace: oConfig.viewNamespace,
                arrangements: new Arrangement(),
                timeout: oConfig.timeout || 15,
                asyncPolling: true,
                pollingInterval: 1000
            });

            var aPages = oConfig.pages;
            sap.ui.require(aPages);
           
            var aFeatureFiles = oConfig.features;
            var fnAppSteps = oConfig.steps;
            this.start(aFeatureFiles, fnAppSteps);
        },

        start: function (aFeatureFiles, fnSteps) {
            aFeatureFiles.forEach(function (sFeaturePath) {
                opa5TestHarness.test({
                    featurePath: sFeaturePath,
                    steps: fnSteps,
                    generateMissingSteps: true
                });
            });
        }

    };

});