jQuery.sap.require("sap/ui/generic/app/util/MessageUtil");
var MessageUtil = sap.ui.require("sap/ui/generic/app/util/MessageUtil");

sap.ui.controller("<%= nmsp %>.ext.controller.ObjectPageExt", {
	onInit: function () {
		var oRouter = this.getRouter();
		
		oRouter.getRoute("rootquery").attachMatched(this._onRouteMatch, this);
		this._onRouteMatch();
	},
	
	getRouter: function(){
		var oComponent = this.getOwnerComponent();
		return oComponent.getRouter();
	},
	
	/**
	 * Handle 'rootquery' route match event
	 * @param {sap.ui.base.Event} oEvent route match
	 */
	_onRouteMatch: function(oEvent){
		var oView = this.getView();
		var oModel = this.getOwnerComponent().getModel();
		
		//here need to parse url and bind view for application
	},
	
	/**
	 * get i18n bundle
	 * @returns {sap.base.i18n.ResourceBundle} 
	 */
	getResourceBundle: function () {
		return this.getOwnerComponent().getModel("i18n").getResourceBundle();
	},
	
	/**
	 * Get first parameter value
	 * @param {string} sName parameter name
	 * @returns {string} first parameter value 
	 */
	getUrlParamByName: function(sName){
		var oParams = this.getUrlParams();
		var	sParam = oParams[sName] && oParams[sName][0];
		return sParam;
	},
	
	/**
	 * Get all values for url parameters
	 * @param {string} sName parameter name
	 * @returns {Array} values of parameter
	 */
	getAllUrlParamByName: function(sName){
		var oParams = this.getUrlParams();
		return oParams[sName] || [];
	},
	
	/**
	 * Get url params. Parse location href.
	 * @returns {Object} map key-value pair for url parameters
	 */
	getUrlParams: function(){
		var oParser = sap.ushell.Container.getService("URLParsing");
		var sHash = oParser.getHash(location.href);
		
		return oParser.parseParameters(sHash);
	},
	
	/**
	 * get i18n text
	 * @returns {string} language text 
	 */ 
	i18n: function(){
		var oBundle = this.getResourceBundle();
		return oBundle.getText.apply(oBundle, arguments);
	},
	
	/**
	 * handle backend transient, persistent messages and
	 * show them into special message dialog
	 */
	handleMessage: function(){
		var oView = this.getView();
		var that = this;
		
		function getMessageDialogForView(oThisView, sName, oFragmentController) {
			var sViewId = oThisView.getId();
			var	oFragment;
			
			if(!that[sName]){
				oFragment = sap.ui.xmlfragment(sViewId, sName, oFragmentController);
				oThisView.addDependent(oFragment);
				that[sName] = oFragment;
			}else{
				oFragment = that[sName];
			}
			
			return oFragment;
		}
		
		MessageUtil.handleTransientMessages(getMessageDialogForView.bind(null, oView));
	}

});