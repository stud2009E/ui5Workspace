sap.ui.define([
    "jquery.sap.global"
], function(
    jQuery
){
    "use strict";

    /**
     * @class ColorSquare Renderer
     * @static
     */
    var ColorSquareRenderer = {};

    /**
     * Renders the HTML for the given control
     * 
     * @param {sap.ui.core.RenderManager} oRm RenderManager that can be used for writing to the Render-Output-Buffer 
     * @param {<%= nmsp %>.ColorSquare} oColorSquare instance of control that should be rendered
     */
    ColorSquareRenderer.render = function(oRm, oColorSquare){

        var sColor = oColorSquare.getColor();
        var sColorClass = "ColorSquare" + sColor;

        oRm.write("<div"); 

        // writes the Control ID and enables event handling - important!
        oRm.writeControlData(oColorSquare);
        
        // write the Control property size; the Control has validated it 
        oRm.addStyle("width", oColorSquare.getSize());  
        oRm.addStyle("height", oColorSquare.getSize());
        oRm.writeStyles();
        
        // add a CSS class for styles common to all Control instances
        oRm.addClass("ColorSquare");
        oRm.addClass(sColorClass);
        // this call writes the above class plus enables support
        oRm.writeClasses(); 

        oRm.write(">");

        // write another Control property, with protection
        oRm.writeEscaped(oColorSquare.getText()); 

        // against cross-site-scripting
        oRm.write("</div>");
    };

    return ColorSquareRenderer;

}, true);