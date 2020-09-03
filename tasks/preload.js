const config = require("../utils/ConfigContainer.js");
const util = require("util");
const path = require("path");
const fs = require("fs-extra");
const exec = util.promisify(require("child_process").exec);

module.exports = function(grunt){

	grunt.registerTask("preload", "public: build app Component-preload.js", function(){

		const appName = grunt.option("app"); 
		const {appInfo, libInfo} = config;

		const done = this.async();

		if(!appName){
			grunt.fail.fatal("error: require app name, use --app=<app name>");
		}

		if(!(appInfo[appName] || libInfo[appName])){
			grunt.fail.fatal(`error: can't find app/lib with name ${appName}`);
		}

		let appPath = appInfo[appName] && appInfo[appName].path;
		if(!appPath){
			appPath = libInfo[appName] && libInfo[appName].path;
		}

		if(!appPath){
			grunt.fail.fatal(`error: can't define path to ${appName}`);
		}


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
