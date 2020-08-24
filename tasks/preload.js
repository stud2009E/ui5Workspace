const config = require("../utils/ConfigContainer.js");
const util = require("util");
const path = require("path");
const fs = require("fs-extra");
const exec = util.promisify(require("child_process").exec);

module.exports = function(grunt){

	grunt.registerTask("preload", "public: build app Component-preload.js", function(){

		const appName = grunt.option("app"); 
		const appInfo = config.appInfo;
		const done = this.async();

		if(!appName){
			grunt.fail.fatal("error: require app name, use --app=<app name>");
		}

		if(!appInfo[appName]){
			grunt.fail.fatal(`error: can't find app with name ${appName}`);
		}

		const appPath = appInfo[appName].path;

		(async () => {

			const bPackage = fs.existsSync(path.join(appPath, "package.json"));
			if(!bPackage){
				const {stderr, stdout} = await exec("npm init -y", {
					cwd: appPath
				});

				console.error(stderr);
				console.log(stdout);
			}

			const bUi5 = fs.existsSync(path.join(appPath, "ui5.yaml"));
			if(!bUi5){
				const {stderr, stdout} = await exec("ui5 init", {
					cwd: appPath
				});

				console.error(stderr);
				console.log(stdout);
			}

			const {stderr, stdout} = await exec("ui5 build preload", {
				cwd: appPath
			});
	
			console.error(stderr);
			console.log(stdout);

			done();

		})();

	});
};
