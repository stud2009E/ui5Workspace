const path = require("path");

const __THEME__= "__THEME__";
const __USHELL__CONFIG__= "__USHELL__CONFIG__";
const __RESOURCE__ROOTS__CONFIG__= "__RESOURCE__ROOTS__CONFIG__";
const __MOCK__SETTINGS__= "__MOCK__SETTINGS__";

module.exports = function(grunt){

	grunt.registerTask("_flpdIndex", "private: build fiori index.html", function(){
		grunt.task.requires("configCollect");
		grunt.loadNpmTasks("grunt-text-replace");
		grunt.loadNpmTasks("grunt-contrib-clean");

		const cwd = process.cwd();
		const fioriPath = {
			template: path.join(cwd, "workspace/fiori/template.html"),
			index: path.join(cwd, "workspace/fiori/index.html")
		};
		const config = grunt.config.get("config");
		const applications = grunt.config.get("applications");
		const appMap = grunt.config.get("appMap");
		const plugins = grunt.config.get("plugins");
		const resourceroots = grunt.config.get("resourceroots");

		const mockApplications = []; 
        for(let key in applications){
            const {name, serviceUrl} = applications[key]; 
            
            if(appMap[name] && appMap[name].useMockServer === true){
                mockApplications.push({
                    name, serviceUrl
                });
            } 
        }
		
		grunt.config.merge({
			clean: {
				flpIndex:{
					src: [
						fioriPath.index
					]
				}
			},
			replace:{
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
						from: __MOCK__SETTINGS__,
						to: JSON.stringify(mockApplications)
					},{
						from: __THEME__,
						to: config.theme
					}]
				}
			}
		});

		grunt.task.run([
			"clean:flpIndex",
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
        
        window["z-workspace-config"] = {
			applications: ${appsStr}
		};

		window["sap-ushell-config"] = {
			defaultRenderer: "fiori2",
			applications: ${appsStr},
			bootstrapPlugins: ${plugStr}
		};
	`;
}