const path = require("path");
const config = require("../utils/ConfigContainer.js");

const __THEME__= "__THEME__";
const __USHELL__CONFIG__= "__USHELL__CONFIG__";
const __RESOURCE__ROOTS__CONFIG__= "__RESOURCE__ROOTS__CONFIG__";
const __LIB__PATHS__= "__LIB__PATHS__";
const __MOCK__SETTINGS__= "__MOCK__SETTINGS__";

module.exports = function(grunt){

	grunt.registerTask("flpIndexBuild", "private: build fiori index.html", function(){
		grunt.task.requires("configCollect");
		grunt.loadNpmTasks("grunt-text-replace");
		grunt.loadNpmTasks("grunt-contrib-clean");

		const cwd = process.cwd();
		const fioriPath = {
			template: path.join(cwd, "workspace/fiori/template.html"),
			templateRemote: path.join(cwd, "workspace/fiori-remote/template.html"),
			index: path.join(cwd, "workspace/fiori/index.html"),
			indexRemote: path.join(cwd, "workspace/fiori-remote/index.html"),
		};
		const applications = grunt.config.get("applications");
		const plugins = grunt.config.get("plugins");
		const resourceroots = grunt.config.get("resourceroots");
		const libs = grunt.config.get("libs");

		const appInfo = grunt.config.get("appInfo");
		const mockSettings = config.apps.map(app => {
			const {name} = app;
			return {
				name,
				rootUri: appInfo[name].rootUri
			};
		});
		
		grunt.config.merge({
			clean: {
				flpIndex:{
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
							plugins: plugins,
							themeRoots: config.themeRoots
						})
					},{
						from: __RESOURCE__ROOTS__CONFIG__,
						to: resourceroots
					},{
						from: __LIB__PATHS__,
						to: JSON.stringify(libs)
					},{
						from: __THEME__,
						to: config.theme
					}]
				},
				flp: {
					src: fioriPath.template,
					dest: fioriPath.index,
					replacements:[{
						from:__USHELL__CONFIG__,
						to: getShellConfigStr({
							apps: applications,
							plugins: plugins,
							themeRoots: config.themeRoots
						})
					},{
						from: __RESOURCE__ROOTS__CONFIG__,
						to: resourceroots
					},{
						from: __LIB__PATHS__,
						to: JSON.stringify(libs)
					},{
						from: __MOCK__SETTINGS__,
						to: JSON.stringify(mockSettings)
					},{
						from: __THEME__,
						to: config.theme
					}]
				}
			}
		});

		grunt.task.run([
			"clean:flpIndex",
			"replace:flpRemote",
			"replace:flp"
		]);

	});
};


/**
 * Gets the shell configuration string.
 *
 * @param      {Object}  param          settings for apps and plugins
 * @param      {object}  param.apps     The apps settings
 * @param      {object}  param.plugins  The plugins settings
 * @return     {string}  The shell configuration string.
 */
function getShellConfigStr({apps, plugins, themeRoots}){
	const appsStr = JSON.stringify(apps);
	const plugStr = JSON.stringify(plugins);
	const themeStr = JSON.stringify(themeRoots);

	return `
		window["sap-ui-config"] = {
			themeRoots: ${themeStr}
		};

		window["sap-ushell-config"] = {
			defaultRenderer: "fiori2",
			applications: ${appsStr},
			bootstrapPlugins: ${plugStr}
		};
	`;
}