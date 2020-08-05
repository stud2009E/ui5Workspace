const config = require("../utils/ConfigContainer.js");
const utils = require("grunt-connect-proxy/lib/utils");

module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-connect-proxy");
	grunt.loadNpmTasks("grunt-openui5");

	grunt.config.merge({

		connect:{
			server:{
				options:{
					port: config.port,
					keepalive: true,
					livereload: false,
					middleware: function(connect, options, middlewares){
						middlewares.unshift(utils.proxyRequest);
						return middlewares;
					}
				},
				proxies: config.proxies
			}
		},

		openui5_connect: {
			server: {
				options:{
					appresources: "workspace",
					resources: config.resources,
					testresources: config.testresources
				}
			}
		}
	});

	grunt.registerTask("serve", function(){
		grunt.task.run([
			"configureProxies:server",
			"openui5_connect:server"
		]);
	});

};
