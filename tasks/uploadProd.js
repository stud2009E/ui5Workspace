const path = require("path");
const Ajv = require("ajv");
const objectPath = require("object-path");
const {systemSchema, deploySchema} = require("../utils/configSchema.js");

module.exports = function(grunt){

	grunt.registerTask("uploadProd", "private: upload application to server", function(){
		grunt.task.requires("preload");
		grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

		const appMap = grunt.config.get("appMap");
		const pluginMap = grunt.config.get("pluginMap");
		const libMap = grunt.config.get("libMap");
		const configJSON = grunt.config.get("config");

		const appName = grunt.option("app");
		const userKey = grunt.option("user") || objectPath.get(configJSON, "userCDKey") || objectPath.get(configJSON, "userDefaultKey");
		const systemKey = grunt.option("sys") || objectPath.get(configJSON, "systemCDKey") || objectPath.get(configJSON, "systemDefaultKey");
		
		if(!userKey || !systemKey){
			grunt.fail.fatal("can't find user or system");
		}
		if(!appName){
			grunt.fail.fatal("can't find application name");
		}

		const app = appMap[appName] || pluginMap[appName] || libMap[appName];
		const system = objectPath.get(configJSON, ["system", systemKey]);
		const user = objectPath.get(configJSON, ["system", systemKey, "user", userKey]);

		if(!app || !system || !user ){
			grunt.fail.fatal("can't define app or system or user");
		}

		const ajv = new Ajv({useDefaults: true});
		const validateSystem = ajv.compile(systemSchema);
		if(validateSystem(system)){
			grunt.fail.fatal(validateSystem.errors);
		}
		const validateDeploy = ajv.compile(deploySchema) ;
		if(validateDeploy(app)){
			grunt.fail.fatal(validateDeploy.errors);
		}

		grunt.config.merge({
			nwabap_ui5uploader:{
				options: {
	                conn: {
	                    useStrictSSL: false,
	                    server:`https://${system.host}:${system.port}`
	                },
	                auth: {
	                    user: user.login,
	                    pwd: user.pwd
	                }
	            },
	            upload_build: {
	                options: {
	                    ui5: {
	                        package: app.package,
	                        transportno: app.transport,
	                        bspcontainer: app.bsp,
							calc_appindex: true,
							create_transport: false
	                    },
	                    resources: {
	                        cwd: path.join(app.path, "dist"),
	                        src: "**/*.*"
	                    }
	                }
	            },
			}
		});

		grunt.task.run(["nwabap_ui5uploader"]);
	});

};