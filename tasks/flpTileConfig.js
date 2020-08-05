const path = require("path");
const _ = require("lodash");
const fs = require("fs-extra");
const config = require("../utils/ConfigContainer.js");

const __USHELL__CONFIG__= "__USHELL__CONFIG__";
const __RESOURCE__ROOTS__CONFIG__= "__RESOURCE__ROOTS__CONFIG__";

module.exports = function (grunt) {
	const cwd = process.cwd();
	const appsDir = path.join(cwd, "workspace/apps");
	const fioriPath = {
		tepmlate: path.join(cwd, "workspace/fiori/template.html"),
		templateRemote: path.join(cwd, "workspace/fiori-remote/template.html"),
		index: path.join(cwd, "workspace/fiori/index.html"),
		indexRemote: path.join(cwd, "workspace/fiori-remote/index.html"),
	};
	const applications = {};
	const resourceroots = {};
	const plugins = {};

	grunt.loadNpmTasks("grunt-text-replace");
	grunt.loadNpmTasks("grunt-contrib-clean");

	//clean symlinks from apps
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
			const {name: appName, webapp: isWebapp} = getAppName(abspath);
			const appKey = appName + "-display";
			const manifest = grunt.file.readJSON(abspath);
			const appId = _.get(manifest, "sap.app.id");
			const appType = _.get(manifest, "sap.app.type");
			const flpPath = path.join(cwd, "workspace/fiori");

			let appPath = path.join(cwd, "workspace/apps", appName);

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
				throw new Error("can't parse application type");
			}
			

			resourceroots[appId] = path.relative(flpPath, appPath);
		}
	});

	grunt.config.merge({
		clean: {
			index:{
				src: [
					fioriPath.index,
					fioriPath.indexRemote
				]
			}
		},
		replace:{
			flpRemote: {
				src: fioriPath.templateRemote,
				dest: fioriPath.indexRemote,
				replacements:[{
					from:__USHELL__CONFIG__,
					to: getShellConfigStr({
						apps: applications,
						plugins: plugins
					})
				}, {
					from: __RESOURCE__ROOTS__CONFIG__,
					to: getResourceRootsStr(resourceroots)
				}]
			},
			flp: {
				src: fioriPath.template,
				dest: fioriPath.index,
				replacements:[{
					from: __USHELL__CONFIG__,
					to: getShellConfigStr({
						apps: applications,
						plugins: plugins
					})
				}, {
					from: __RESOURCE__ROOTS__CONFIG__,
					to: getResourceRootsStr(resourceroots)
				}]
			}
		}
	});


	grunt.registerTask("flpConfig", "config tiles for flp", function () {

		grunt.task.run([
			"clean:index",
			"replace:flpRemote",
			// "replace:flp"
		]);
	});

};

function getResourceRootsStr(resourceroots){
	return JSON.stringify(resourceroots);
}

function getShellConfigStr({apps, plugins}){
	let appsStr = JSON.stringify(apps);
	let plugStr = JSON.stringify(plugins);

	return `
		window["sap-ushell-config"] = {
			defaultRenderer: "fiori2",
			applications: ${appsStr},
			bootstrapPlugins: ${plugStr}
		}
	`;
}


function getAppName(abspath){
	const bNotExist = abspath.search(/\/apps\/(\w+.?)+\w\/(webapp)\//) === -1;
	const start = abspath.search(/\/apps\//);
	const end = abspath.search(/\/(webapp)\//);
	const isWebapp = abspath.search(/\/webapp\//);

	if(bNotExist){
		throw new Error("can't parse application name form file structure");
	}

	return name: abspath.substring(start + "/apps/".length, end);
}
