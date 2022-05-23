const utilsNpm = require("grunt-connect-proxy/lib/utils");
const utilsGit = require("grunt-connect-proxy-git/lib/utils");
const path = require("path");
const objectPath = require("object-path");
const Ajv = require("ajv");
const {systemSchema} = require("../utils/configSchema.js");

module.exports = function(grunt){
	grunt.registerTask("serve", "private: setup proxy server", function(){
		grunt.task.requires("configCollect");

		const config = grunt.config.get("config");
		const systemKey = grunt.option("sys") || objectPath.get(config, "systemDefaultKey");
		const userKey = grunt.option("user") || objectPath.get(config, "userDefaultKey");
	
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

		if(!systemKey || !userKey){
			grunt.fail.fatal("can't find user or system");
		}

		const systemProxies = [];
		if(systemKey !== "local"){
			const systemConfig = objectPath.get(config, "system");
			const ajv = new Ajv({useDefaults: true});
			const validate = ajv.compile(systemSchema);
			if(!validate(systemConfig)){
				validate.errors.forEach( err => {
					grunt.log.error(`${err.message}:\n${err.schemaPath}`);
				});
				grunt.fail.fatal(validate.errors[0].message);
			}
			
			const system = objectPath.get(config, ["system", systemKey]);
			const user = objectPath.get(config, ["system", systemKey, "user", userKey]);
			const ident = Buffer.from(`${user.login}:${user.pwd}`).toString("base64");
			const { host, port, context = "/sap", secure = false, https = true} = system;
			
			systemProxies.push({
				context, host, port, secure, https,
				headers: {
					Authorization: `Basic ${ident}`
				}
			});
		}
		
		const libProxies = grunt.config.get("libraries").map(({path, context}) => {
			return {
				context: context,
				host: "localhost",
				port: 8000,
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
						port: 8000,
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
						resources: path.join(objectPath.get(config, "sdk"), "resources"),
						testresources: path.join(objectPath.get(config, "sdk"), "test-resources")
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