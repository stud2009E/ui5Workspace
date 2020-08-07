const path = require("path");
const fs = require("fs-extra");
const config = require("../utils/ConfigContainer.js");

module.exports = function (grunt) {

	grunt.registerTask("shellConfigCollect", "collect settings for plugins, apps", function(){

		const cwd = process.cwd();
		const appsDir = path.join(cwd, "workspace/apps");
		const flpPath = path.join(cwd, "workspace/fiori");
		const {appInfo} = config;

		const applications = {};
		const resourceroots = {};
		const plugins = {};

		//remove apps symlinks
		fs.emptyDirSync(appsDir);

		//create settings for apps and plugins
		config.apps.concat(config.plugins).forEach(app => {
			const {name} = app;
			const manifest = grunt.file.readJSON(path.join(app.path, "webapp", "manifest.json"));
			const appId = manifest["sap.app"].id;
			const appType = manifest["sap.app"].type;
			const appKey = name + "-display";
			const symlinkPath = path.join(cwd, "workspace/apps", name, "webapp");

			fs.symlinkSync(app.path, path.join(appsDir, name), "dir");

			appInfo[name].id = appId;
			appInfo[name].appType = appType;
			
			if(appType === "component"){
				plugins[name] = {};
				plugins[name].component = appId;
			}else if(appType === "application"){
				applications[appKey] = {};
				applications[appKey].additionalInformation = `SAPUI5.Component=${appId}`;
				applications[appKey].applicationType = "URL";
				applications[appKey].description = name;
				applications[appKey].title = name;
			}else{
				grunt.fail.fatal("can't parse application type");
			}

			resourceroots[appId] = path.relative(flpPath, symlinkPath);
		});

		//lib files path setup, proxy
		const libs = config.libs.map(lib => {
			const item = {
				context: lib.context,
				namespace: lib.namespace
			};

			grunt.file.recurse(lib.path, function(absPath, rootdir, subdir, filename) {
				if(filename.endsWith("library.js")){
					item.path = path.relative(flpPath, path.join(lib.path, subdir));
				}
			});

			return item;
		});

		grunt.config.set("appInfo", appInfo);
		grunt.config.set("resourceroots", JSON.stringify(resourceroots));
		grunt.config.set("applications", applications);
		grunt.config.set("plugins", plugins);
		grunt.config.set("libs", libs);
	});
};
