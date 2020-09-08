sap.ui.define([
	"sap/ui/test/Opa5",
	"opa/arrangement/Arrangement",
	"./example/WelcomeJourney"
], function (Opa5, Arrangement) {
	"use strict";

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		viewNamespace: "<%= ?? %>",
		autoWait: true
	});
});
