const util = require("util");
const path = require("path");
const fs = require("fs-extra");
const yaml = require("yaml");
const objectPath = require("object-path");
const exec = util.promisify(require("child_process").exec);

module.exports = function(grunt){
	grunt.registerTask("_preload", "private: build app Component-preload.js", function(){
		grunt.task.requires("configCollect");
		
		const appName = grunt.option("app"); 
		const done = this.async();

		const appMap = grunt.config.get("appMap");
		const pluginMap = grunt.config.get("pluginMap");
		const libMap = grunt.config.get("libMap");

		if(!appName){
			grunt.fail.fatal("require app name, use --app=<app name>");
		}

		const app = appMap[appName] || libMap[appName] || pluginMap[appName];
	
		if(!app){
			grunt.fail.fatal(`can't find application||library||plugin with name ${appName}`);
		}

		const appPath = app.path;
		if(!appPath){
			grunt.fail.fatal(`can't get path for ${appName}`);
		}

		(async () => {
			const bPackage = fs.existsSync(path.join(appPath, "package.json"));
			if(!bPackage){
				const {stderr, stdout} = await exec("npm init -y", {
					cwd: appPath
				});

				if(stderr){
					grunt.fail.fatal(stderr);
				}
				grunt.log.writeln(stdout);
			}

			const bUi5 = fs.existsSync(path.join(appPath, "ui5.yaml"));
			if(!bUi5){
				const {stderr, stdout} = await exec("ui5 init", {
					cwd: appPath
				});

				if(stderr){
					grunt.fail.fatal(stderr);
				}
				grunt.log.writeln(stdout);
			}

			let ui5Yaml = fs.readFileSync(path.join(appPath, "ui5.yaml"), {
				encoding : "utf8"
			});
			const uiJson = yaml.parse(ui5Yaml);
			if(objectPath.get(uiJson, "type") === "application"){
				let needChange = false;
				if(!objectPath.get(uiJson, [ "resources", "configuration", "paths", "webapp"])){
					objectPath.set(uiJson, [ "resources", "configuration", "paths", "webapp"], "webapp");
					needChange = true;
				}

				if(!objectPath.get(uiJson, [ "builder", "resources", "excludes"])){
					objectPath.set(uiJson, [ "builder", "resources", "excludes"], ["localService/**", "test/**"]);
					needChange = true;
				}
				
				if(needChange){
					ui5Yaml = yaml.stringify(uiJson);
					fs.outputFileSync(path.join(appPath, "ui5.yaml"), ui5Yaml, {
						encoding : "utf8"
					});
				}
			}

			const {stdout, stderr} = await exec("ui5 build preload --clean-dest=true --dest='./dist'", {
				cwd: appPath
			});
			
			if(/Build succeeded/.test(stderr)){
				grunt.log.ok(stderr);
			}
			if(/Build succeeded/.test(stdout)){
				grunt.log.ok(stdout);
			}

			if(/error/.test(stderr)){
				grunt.fail.fatal(stderr);
			}
			if(/error/.test(stdout)){
				grunt.fail.fatal(stdout);
			}
			done();
		})();
	});
};