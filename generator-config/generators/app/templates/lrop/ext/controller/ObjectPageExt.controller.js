sap.ui.define([
	"sb/fiori/lib/spl/util/CommonUtils",
	"sb/fiori/lib/spl/util/GridTableExtension"
], function(
	CommonUtils,
	GridTableExtension
){
	"use strict";

	sap.ui.controller("<%= nmsp %>.ext.controller.ObjectPageExt", {
		onInit: function() {
			CommonUtils.inject(this);
			
		}

	});
});