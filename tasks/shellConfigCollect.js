const path = require("path");
const fs = require("fs-extra");
const config = require("../utils/ConfigContainer.js");

module.exports = function (grunt) {

	grunt.registerTask("shellConfigCollect", "collect settings for plugins, apps", function(){

		debugger;

		const cwd = process.cwd();
		const appsDir = path.join(cwd, "workspace/apps");
		const flpPath = path.join(cwd, "workspace/fiori");
		
		let applications = {};
		let resourceroots = {};
		let plugins = {};

		//remove apps symlinks
		fs.emptyDirSync(appsDir);

		//create symlinks for apps
		config.apps.forEach(app => {
			let parts = app.path.split(path.sep);
			let appName = parts[parts.length - 1];

			fs.symlinkSync(app.path, path.join(appsDir, appName), "dir");
		});

		//create symlink for plugin
		config.plugins.forEach(plugin => {
			let parts = plugin.path.split(path.sep);
			let pluginName = parts[parts.length - 1];

			fs.symlinkSync(plugin.path, path.join(appsDir, pluginName), "dir");
		});

		//create settings for app tiles
		grunt.file.recurse(appsDir, function(abspath, rootdir, subdir, filename){
			if(filename.endsWith("manifest.json")){

				const appName = getAppName(abspath);
				const appKey = appName + "-display";
				const manifest = grunt.file.readJSON(abspath);
				const appId = manifest["sap.app"].id;
				const appType = manifest["sap.app"].type;
				
				const appPath = path.join(cwd, "workspace/apps", appName, "webapp");

				if(appType === "component"){
					plugins[appName] = {};
					plugins[appName].component = appId;
				}else if(appType === "application"){
					applications[appKey] = {};
					applications[appKey].additionalInformation = `SAPUI5.Component=${appId}`;
					applications[appKey].applicationType = "URL";
					applications[appKey].description = appName;
					applications[appKey].title = appName;
				}else{
					grunt.fail.fatal("can't parse application type");
				}
				
				resourceroots[appId] = path.relative(flpPath, appPath);
			}
		});

		//lib files path setup, proxy
		let libs = config.libs.map(lib => {
			const item = {};
			const parts = lib.path.split(path.sep);
			const libName = parts[parts.length - 1];

			item.context = `/sap/bc/ui5_ui5/sap/${libName}/`;
			item.namespace = lib.namespace;

			grunt.file.recurse(lib.path, function(absPath, rootdir, subdir, filename) {
				if(filename.endsWith("library.js")){
					item.path = path.relative(flpPath, path.join(lib.path, subdir));
				}
			});

			return item;
		});

		grunt.config.set("resourceroots", JSON.stringify(resourceroots));
		grunt.config.set("applications", applications);
		grunt.config.set("plugins", plugins);
		grunt.config.set("libs", libs);
	});
};


/**
 * Gets the application name.
 *
 * @param      {string}  abspath path to file
 */
function getAppName(abspath){
	const bNotExist = abspath.search(/\/apps\/(\w+.?)+\w\/webapp\//) === -1;
	const start = abspath.search(/\/apps\//);
	const end = abspath.search(/\/webapp\//);

	if(bNotExist){
		grunt.fail.fatal("can't parse application name form application folder");
	}

	return abspath.substring(start + "/apps/".length, end);
}
