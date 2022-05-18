const utilsNpm = require("grunt-connect-proxy/lib/utils");
const utilsGit = require("grunt-connect-proxy-git/lib/utils");
const objectPath = require("object-path");
const {systemSchema} = require("../utils/configSchema.js");
const Ajv = require("ajv");

module.exports = function(grunt){
	grunt.registerTask("serve", "private: setup proxy server", function(){
		grunt.task.requires("configCollect");

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

		const config = grunt.config.get("config");
		const systemKey = grunt.option("sys") || objectPath.get(config, "systemDefaultKey");
		const userKey = grunt.option("user") || objectPath.get(config, "userDefaultKey");
		const system = objectPath.get(config, "system");

		// getSystemProxies(systemKey, userKey){
		// 	const system = this.getSystem(systemKey);
		// 	const user = this.getUser(systemKey, userKey);
		// 	const ident = Buffer.from(`${user.login}:${user.pwd}`).toString("base64");
	
		// 	const { host, port, context = "/sap", secure = false, https = true} = system;
	
		// 	const proxy =  [{
		// 		context, host, port, secure, https,
		// 		headers: {
		// 			Authorization: `Basic ${ident}`
		// 		}
		// 	}];
	
		// 	return proxy;
		// }

		const ajv = new Ajv({useDefaults: true});
		const validate = ajv.compile(systemSchema);
		if(!validate(system)){
			validate.errors.forEach( err => {
				grunt.log.error(`${err.message}:\n${err.schemaPath}`);
			});
			grunt.fail.fatal(validate.errors[0].message);
		}

		const systemProxies = [];
		if(!config.isLocalDev){
			systemProxies = config.getSystemProxies(systemKey, userKey);
		}
		
		const libProxies = grunt.config.get("libs").map(({path, context}) => {
			return {
				context: context,
				host: "localhost",
				port: config.port,
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
					proxies: [
						...libProxies,
						...systemProxies
					]
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