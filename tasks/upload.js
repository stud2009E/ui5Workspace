const path = require("path");
const config = require("../utils/ConfigContainer.js");

module.exports = function(grunt){

	grunt.registerTask("upload", "private: upload application to server", function(){
		// grunt.task.requires("jshint");
		// grunt.task.requires("test");
		// grunt.task.requires("preload");

		grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

		const appName = grunt.option("app");
		const userKey = grunt.option("user") || config.userDefaultKey;
		const systemKey = grunt.option("sys") || config.systemDefaultKey;
	
		const system = config.getSystem(systemKey);
		const user = config.getUser(systemKey, userKey);

		if(!appName){
			grunt.fail.fatal("can't find application name");
		}

		const app = config.appInfo[appName];

		["transport", "package", "bsp"].forEach(prop => {
			if(!app[prop]){
				grunt.fail.fatal(`require '${prop}' to upload application`);
			}
		});

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
	                        bspcontainer_text: `deploy ${appName}` 
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