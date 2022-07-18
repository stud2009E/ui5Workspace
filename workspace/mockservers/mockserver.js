sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(
	MockServer
){
	"use strict";
	
	const oModule = {

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

			const allSetup = settings.map(this.setupServer.bind(this));
			return Promise.all(allSetup)
				.finally(() => MockServer.startAll());
		},

		/**
		 * setup server 
		 *
		 * @param      {object}   setting
		 * @param      {string}   setting.name application name
		 * @param      {string}   setting.serviceUrl odata service url
		 * @return     {Promise}  mock server setup promise 
		 */
		setupServer(setting){
			const {name, serviceUrl} = setting;
			const metadataPath = `../apps/${name}/webapp/localService/metadata.xml`;
			const mockdataPath = `../apps/${name}/webapp/localService/mockdata`;

			const mockserver = new MockServer({
				rootUri: serviceUrl
			});

			mockserver.simulate(metadataPath, {
				sMockdataBaseUrl: mockdataPath
			});

			if(this.isLogMode()){
				this.attachLog(mockserver, serviceUrl, name);
			}

			return new Promise(resolve => {
				sap.ui.require([
					`flp/root/apps/${name}/webapp/localService/ext/mockExtension`
				], mockExtension => {
					if(mockExtension && typeof mockExtension.apply === "function"){
						mockExtension.apply(mockserver);
					}
					resolve(mockserver);
				}, err => {
					console.error(`mock server for app '${name}' started without mockExtension: ${err}`);
					resolve(mockserver);
				});
			});
		},

		/**
		 * Determines if log mode.
		 *
		 * @return     {boolean}  True if log mode, False otherwise.
		 */
		isLogMode(){
			const bLogMode = /\WmockLogMode=false(\W|$)/.test(location.href);

            return !bLogMode;
		},

		/**
		 * Attaches the log.
		 *
		 * @param      {sap.ui.core.util.MockServer}  mockserver  The mockserver
		 * @param      {string}                       serviceUrl     The root uri
		 * @param      {string}                       name        application name
		 */
		attachLog(mockserver, serviceUrl, name){

            function logGetRequest(oEvent){
                const oXhr = oEvent.getParameter("oXhr");
				const oEntry = oEvent.getParameter("oEntry");
                const oFilteredData = oEvent.getParameter("oFilteredData")
                const aResults = oFilteredData && oFilteredData.results || oEntry;
                const sUrl = decodeURIComponent(oXhr.url).replace(serviceUrl, "");

				let [entitySet, params] = sUrl.split("?");
				params = params && params.split("&").join("\n\t") || "";
				let sMessage = `\nMockServer::${oEvent.getId()} /${entitySet}\nparams:${params}\n`;

                if (oXhr.status >= 400){
                    console.error(sMessage, aResults, name);
                } else {
                    console.info(sMessage, aResults, name);
                }
            }

			function logChangeRequest(oEvent){
                const oXhr = oEvent.getParameter("oXhr");
                const sUrl = decodeURIComponent(oXhr.url).replace(serviceUrl, "");
                let [entitySet] = sUrl.split("?");

				let requestBody = JSON.parse(oXhr.requestBody);
				let sMessage = `\nMockServer::${oEvent.getId()} /${entitySet}\n`;

                if (oXhr.status >= 400){
                    console.error(sMessage, requestBody, name);
                } else {
                    console.info(sMessage, requestBody, name);
                }
            }

			mockserver.attachAfter(MockServer.HTTPMETHOD.GET, logGetRequest);
			mockserver.attachBefore(MockServer.HTTPMETHOD.POST, logChangeRequest);
			mockserver.attachBefore(MockServer.HTTPMETHOD.MERGE, logChangeRequest);
			mockserver.attachBefore(MockServer.HTTPMETHOD.DELETE, logChangeRequest);
        }

	};

	return oModule;
});