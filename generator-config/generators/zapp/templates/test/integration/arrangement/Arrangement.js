sap.ui.define([
	"sap/ui/test/Opa5"
], function(
    Opa5
){
	"use strict";

	return Opa5.extend("opa.arrangement.Arrangement", {
		iStartMyApp : function (oAdditionalUrlParameters) {

			oAdditionalUrlParameters = oAdditionalUrlParameters || {};
			return this.iStartMyUIComponent({
				componentConfig: {
					name: "<%= ?? %>"
				},
				hash: oAdditionalUrlParameters.hash
			});
		}
	});
});
