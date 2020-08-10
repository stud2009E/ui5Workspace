sap.ui.define([
	"commons/BaseSteps"
], function (Steps) {

	return {
		pages: [
            "test/pages/ListReportPage",
            "test/pages/ObjectPage"
		],
		steps: Steps,
		viewNamespace: "sap.suite.ui.generic.template.",
		features: [
			"test.features.Test",
			"test.features.Test2"
		]
	};
});