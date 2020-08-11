sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/Log",
], function(
	MockServer,
	Log
){

	const LOG_COMPONENT = "MOCK_SERVER"; 

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
				this.attachLog(mockserver, rootUri, name);
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

		/**
		 * Determines if log mode.
		 *
		 * @return     {boolean}  True if log mode, False otherwise.
		 */
		isLogMode(){
			return /\WmockLogMode=true(\W|$)/.test(location.href);
		},

		/**
		 * Attaches the log.
		 *
		 * @param      {sap.ui.core.util.MockServer}  mockserver  The mockserver
		 * @param      {string}                       rootUri     The root uri
		 * @param      {string}                       name        application name
		 */
		attachLog(mockserver, rootUri, name) {
			Log.setLevel(3, name);

            function logRequest(oEvent) {
            	const oXhr = oEvent.getParameter("oXhr");
            	const oFilteredData = oEvent.getParameter("oFilteredData")
            	const aResults = oFilteredData && oFilteredData.results || [];
                const sUrl = decodeURIComponent(oXhr.url).replace(rootUri, "");
                
                let [entitySet, params] = sUrl.split("?");
               	params = params.split("&").join('\n\t');

                const sMessage = `\nMockServer::${oEvent.getId()} /${entitySet}\nparams:${params}\n`;

                if (oXhr.status >= 400) {
                    Log.error(sMessage, aResults, name);
                } else if (oXhr.status >= 300) {
                    Log.warning(sMessage, aResults, name);
                } else {
                    Log.info(sMessage, aResults, name);
                }
            }

            Object.keys(MockServer.HTTPMETHOD)
            	.map(key => MockServer.HTTPMETHOD[key])
            	.forEach(method => mockserver.attachAfter(method, logRequest));
        }

	};

	return oModule;
});