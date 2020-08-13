const config = require("../utils/ConfigContainer.js");
const defaults = require("../utils/defaults.js");
const utilsNpm = require("grunt-connect-proxy/lib/utils");
const utilsGit = require("grunt-connect-proxy-git/lib/utils");

module.exports = function(grunt){

	grunt.registerTask("serve", function(){
		grunt.task.requires("shellConfigCollect");

		grunt.loadNpmTasks("grunt-contrib-connect");
		grunt.loadNpmTasks("grunt-openui5");

		if(config.proxyModule === "git"){
			grunt.loadNpmTasks("grunt-connect-proxy-git");
			utils = utilsGit;
		}
		if(config.proxyModule === "npm"){
			grunt.loadNpmTasks("grunt-connect-proxy");
			utils = utilsNpm;
		}

		const systemKey = grunt.option("sys") || config.systemDefaultKey;
		const userKey = grunt.option("user") || config.userDefaultKey;

		let systemProxies = [];
		if(!config.isLocalDev){
			systemProxies = config.getSystemProxies(systemKey, userKey); 
		}

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
