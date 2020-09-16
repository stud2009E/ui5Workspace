sap.ui.define([
    "jquery.sap.global", 
    "sap/ui/core/library"
],function(
    jQuery
) {
	"use strict";

	/**
	 * Your controls library.
	 *
	 * @namespace
	 * @name sap.ui.suite
	 * @author SAP SE
	 * @version ${version}
	 * @public
	 */
	sap.ui.getCore().initLibrary({
		name : "<%= nmsp %>",
		version: "${version}",
		dependencies : ["sap.ui.core"],
		types: [
			"<%= nmsp %>.ColorType"
		],
		interfaces: [],
		controls: [
			"<%= nmsp %>.ColorSquare"
		],
		elements: []
	});
	
	/**
	 * Defined color values for the ColorSquare
	 *
	 * @version ${version}
	 * @enum {string}
	 * @public
	 */
	<%= nmsp %>.ColorType = {
	
		/**
		 * Red
		 * @public
		 */
		Red: "Red",
	
		/**
		 * Yellow
		 * @public
		 */
		Yellow: "Yellow",
	
		/**
		 * Green
		 * @public
		 */
		Green: "Green",
	
		/**
		 * Default value
		 * @public
		 */
		Gray: "Gray"
	};

	return <%= nmsp %>;

}, false);