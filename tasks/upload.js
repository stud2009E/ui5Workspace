const fs = require("fs-extra");
const path = require("path");
const config = require("../utils/ConfigContainer.js");

module.exports = function(grunt){

	grunt.registerTask("uploadApp", "upload application to server", function(){
		grunt.task.requires("build");
		// grunt.task.requires("jshint");
		// grunt.task.requires("test");

		grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

		const cwd = process.cwd();
		const distPath = path.join(cwd, "workspace/dist");

		const appName = grunt.option("app");
		const userKey = grunt.option("user") || config.userDefaultKey;
		const systemKey = grunt.option("sys") || config.systemDefaultKey;

		const system = config.getSystem(systemKey);
		const user = config.getUser(userKey);

		if(!appName){
			grunt.fail.fatal("can't find application name");
		}

		const distAppNames = fs.readdirSync(distPath);
		if(!distAppNames.some(distName => distName === appName)){
			grunt.fail.fatal(`can't find application ${appName}`);
		}

		const appInfo = grunt.config.get("appInfo");
		const uploadAppInfo = appInfo[appName];

		if(!uploadAppInfo.package){
			grunt.fail.fatal(`require package to upload application`);
		}

		if(!uploadAppInfo.transport){
			grunt.fail.fatal(`require transport to upload application`);
		}

		grunt.config.merge({
			nwabap_ui5uploader:{
				options: {
	                conn: {
	                    useStrictSSL: false,
	                    server:`${system.host}:${system.port}`
	                },
	                auth: {
	                    user: user.login,
	                    pwd: user.pwd
	                }
	            },
	            upload_build: {
	                options: {
	                    ui5: {
	                        package: uploadAppInfo.package,
	                        transportno: uploadAppInfo.transport,
	                        bspcontainer: appName,
	                        bspcontainer_text: `deploy ${appName}` 
	                    },
	                    resources: {
	                        cwd: path.join(distPath, appName, "webapp"),
	                        src: "**/*.*"
	                    }
	                }
	            },
			}
		});

		grunt.task.run(["nwabap_ui5uploader"]);
	});

};