const config = require("../utils/ConfigContainer.js");
const defaults = require("../utils/defaults.js");
const utils = require("grunt-connect-proxy/lib/utils");

module.exports = function(grunt){

	grunt.registerTask("serve", function(){

		debugger;

		grunt.loadNpmTasks("grunt-contrib-connect");
		grunt.loadNpmTasks("grunt-connect-proxy");
		grunt.loadNpmTasks("grunt-openui5");


		const systemKey = grunt.option("sys") || config.systemDefaultKey;
		const userKey = grunt.option("user") || config.userDefaultKey;

		grunt.task.requires("shellConfigCollect");

		const systemProxies = config.getSystemProxies(systemKey, userKey); 
		const libProxies = grunt.config.get("libs").map(({path, context}) => {
			return {
				context: context,
				host: "localhost",
				port: defaults.port,
				https: false,
				rewrite: {
					[`^${context}`]: path
				}
			};
		});

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
					proxies: systemProxies.concat(libProxies)
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

	
		grunt.task.run([
			"configureProxies:server",
			"openui5_connect:server"
		]);
	});

};
