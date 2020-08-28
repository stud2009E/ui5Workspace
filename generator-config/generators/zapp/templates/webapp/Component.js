sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "<%/%>/module/models",
    "sap/ui/thirdparty/jquery"
], function (
    UIComponent, 
    Device, 
    models,
    jQuery
) {
	"use strict";

	return UIComponent.extend("<%= dotnsp %>.Component", {

		metadata : {
			manifest : "json"
		},

		init : function () {

			this.setModel(models.createDeviceModel(), "device");
            this.setModel(models.createStateModel(), "state");

			UIComponent.prototype.init.apply(this, arguments);

			this.getRouter().initialize();
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class
		 */
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
                    this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});
});