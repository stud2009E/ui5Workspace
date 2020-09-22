const path = require("path");
const fs = require("fs-extra");
const config = require("../utils/ConfigContainer.js");

module.exports = function (grunt) {

	getServiceUri = getServiceUri.bind(grunt);

	grunt.registerTask("shellConfigCollect", "private: collect settings for plugins, apps, libs", function(){

		const cwd = process.cwd();
		const appsDir = path.join(cwd, "workspace/apps");
		const flpPath = path.join(cwd, "workspace/fiori");
		const {appInfo} = config;

		const applications = {};
		const resourceroots = {};
		const plugins = {};

		//remove apps symlinks
		fs.emptyDirSync(appsDir);

		//create app settings for flp index.html`
		config.apps.forEach(app => {
			const {name, action = "display", mockModelName = ""} = app;
			const manifest = grunt.file.readJSON(path.join(app.path, "webapp", "manifest.json"));
			const appId = manifest["sap.app"].id;
			const appType = manifest["sap.app"].type;
			const symlinkPath = path.join(cwd, "workspace/apps", name, "webapp");
			const appKey = `${name}-${action}`;
			const serviceUri = getServiceUri({manifest, name, mockModelName});

			fs.symlinkSync(app.path, path.join(appsDir, name), "dir");

			appInfo[name].id = appId;
			appInfo[name].appType = appType;
			appInfo[name].rootUri = serviceUri;
			
			if(appType === "application"){
				applications[appKey] = {};
				applications[appKey].additionalInformation = `SAPUI5.Component=${appId}`;
				applications[appKey].applicationType = "URL";
				applications[appKey].description = name;
				applications[appKey].title = name;
				applications[appKey].url = path.relative(flpPath, symlinkPath);
			} else{
				grunt.fail.fatal(`can't parse application type for app: ${name}`);
			}

			resourceroots[appId] = path.relative(flpPath, symlinkPath);
		});

		//create plugins settings for flp index.html`
		config.plugins.forEach(app => {
			const {name} = app;
			const manifest = grunt.file.readJSON(path.join(app.path, "webapp", "manifest.json"));
			const appId = manifest["sap.app"].id;
			const appType = manifest["sap.app"].type;
			const symlinkPath = path.join(cwd, "workspace/apps", name, "webapp");

			fs.symlinkSync(app.path, path.join(appsDir, name), "dir");
			
			if(appType === "component"){
				plugins[name] = {};
				plugins[name].component = appId;
			} else{
				grunt.fail.fatal(`can't parse plugin type for app: ${name}`);
			}

			resourceroots[appId] = path.relative(flpPath, symlinkPath);
		});

		//lib files path setup, proxy
		const libs = config.libs.map(lib => {
			const item = {
				context: lib.context,
				namespace: lib.namespace
			};

			fs.symlinkSync(lib.path, path.join(appsDir, lib.name), "dir");

			grunt.file.recurse(lib.path, function(absPath, rootdir, subdir, filename) {
				if(filename.endsWith("library.js")){
					item.path = path.join("apps", lib.name, subdir);
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


/**
 * Gets the service uri.
 *
 * @param      {object}  manifest  The manifest
 * @param      {string}  name   aplication name
 * @return     {string}  The service uri.
 */
function getServiceUri({manifest, name, mockModelName = ""}){
	let dataSource;
	let serviceUri;

	try{
		dataSource = manifest["sap.ui5"].models[mockModelName].dataSource;
		serviceUri = manifest["sap.app"].dataSources[dataSource].uri;
	}catch(e){
		this.fail.fatal(`can't find serviceUri for app:'${name}' model:'${mockModelName}'`);
	}

	return serviceUri;
}