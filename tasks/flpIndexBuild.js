const path = require("path");

const __USHELL__CONFIG__= "__USHELL__CONFIG__";
const __RESOURCE__ROOTS__CONFIG__= "__RESOURCE__ROOTS__CONFIG__";
const __LIB__PATHS__= "__LIB__PATHS__";


module.exports = function(grunt){

	grunt.registerTask("flpIndexBuild", "build fiori index.html", function(){
		grunt.task.requires("shellConfigCollect");

		const cwd = process.cwd();
		const fioriPath = {
			tepmlate: path.join(cwd, "workspace/fiori/template.html"),
			templateRemote: path.join(cwd, "workspace/fiori-remote/template.html"),
			index: path.join(cwd, "workspace/fiori/index.html"),
			indexRemote: path.join(cwd, "workspace/fiori-remote/index.html"),
		};
		const applications = grunt.config.get("applications");
		const plugins = grunt.config.get("plugins");
		const resourceroots = grunt.config.get("resourceroots");
		const libs = grunt.config.get("libs");


		grunt.loadNpmTasks("grunt-text-replace");
		grunt.loadNpmTasks("grunt-contrib-clean");

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
							plugins: plugins
						})
					},{
						from: __RESOURCE__ROOTS__CONFIG__,
						to: resourceroots
					},{
						from: __LIB__PATHS__,
						to: JSON.stringify(libs)
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
						to: resourceroots
					}]
				}
			}
		});

		grunt.task.run([
			"clean:flpIndex",
			"replace:flpRemote",
			// "replace:flp"
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