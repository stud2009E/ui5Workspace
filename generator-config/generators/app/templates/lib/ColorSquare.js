sap.ui.define([
    "jquery.sap.global",
    "./library",
    "sap/ui/core/Control"
],function(
    jQuery,
    library,
    Control
){
    "use strict";


    /**
	 * Constructor for a new ObjectNumber.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * ColorSquare displays square with  
	 * @extends sap.ui.core.Control
	 * @version ${version}
	 *
	 * @public
	 * @since 1.12
	 * @alias <%= nmsp %>.ColorSquare
	 */
    var ColorSquare = Control.extend("<%= nmsp %>.ColorSquare", {
        /** @lends <%= nmsp %>.ColorSquare.prototype */
        metadata:{
            library: "<%= nmsp %>",
            properties: {
                color: {
                    type: "<%= nmsp %>.ColorType",
                    group: "Appearance",
                    defaultValue: <%= nmsp %>.ColorType.Gray
                },
                size: {
                    type: "sap.ui.core.CSSSize", 
                    group: "Appearance",
                    defaultValue: "200px"
                }, 
                text: {
                    type: "string",
                    group: "Misc",
                    defaultValue: null
                }
            },
            events: {
                press: {}
            }
        }
    });


    /**
     * Event handler for click event
     * @param {sap.ui.base.Event} oEvent
     * @private 
     */
    ColorSquare.prototype.onclick = function(oEvent){
        this.fireEvent("press");
    };

    return ColorSquare;
}, true);