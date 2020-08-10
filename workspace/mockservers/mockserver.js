sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log",
], function(
	MockServer,
	Log
){
	"use strict";

	var oModule = {

		/**
		 * Initialize mockserver for apps
		 *
		 * @param      {Array}   settings  The settings
		 * @return     {Promise}  promise to load all mock extension
		 */
		init(settings = []){

			MockServer.config({
				autoRespond: true,
				autoRespondAfter: 500
			});

			const allSetup = settings.map(this.setupServer);
			return Promise.all(allSetup)
				.finally(() => MockServer.startAll());
		},


		/**
		 * setup server 
		 *
		 * @param      {object}   setting
		 * @param      {string}   setting.name application name
		 * @param      {string}   setting.rootUri odata service url
		 * @return     {Promise}  mock server setup promise 
		 */
		setupServer(setting){
			const {name, rootUri} = setting;
			const metadataPath = `../apps/${name}/webapp/localService/metadata.xml`;
			const mockdataPath = `../apps/${name}/webapp/localService/mockdata`;

			 new URI(location.href);

			const mockserver = new MockServer({
				rootUri: rootUri
			});

			mockserver.simulate(metadataPath, {
				sMockdataBaseUrl: mockdataPath
			});

			if(this.isLogMode()){
				// mockserver.attach();
			}

			return new Promise((resolve, reject) => {
				sap.ui.require([
					`flp/root/apps/${name}/webapp/localService/mockExtension`
				], mockExtension => {
					if(mockExtension && typeof mockExtension.apply === "function"){
						mockExtension.apply(mockserver);
					}
					resolve(mockserver);
				}, err => {
					Log.error(`mock server for app '${name}' started without mockExtension: ${err}`);
					resolve(mockserver);
				});
			});
		},


		isLogMode(){
			const uri = new URI(location.href);
			const usp = new URLSearchParams(uri.query());

			return usp.get("log-mode") === "mock";
		}

	};

	return oModule;
});