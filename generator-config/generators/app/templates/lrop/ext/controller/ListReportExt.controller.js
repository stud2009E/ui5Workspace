sap.ui.define([
	"sb/fiori/lib/spl/util/CommonUtils",
	"sb/fiori/lib/spl/util/GridTableExtension"
], function(
	CommonUtils
){
	"use strict";
	
	sap.ui.controller("<%= nmsp %>.ext.controller.ListReportExt", {
		onInit: function(){
			CommonUtils.inject(this);

		}
	});
});