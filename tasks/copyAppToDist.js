const path = require("path");
const fs = require("fs-extra");
const config = require("../utils/ConfigContainer.js");

module.exports = function (grunt) {
	const cwd = process.cwd();
	const distPath = path.join(cwd, "workspace/dist");

	grunt.registerTask("copyAppToDist", "clean application from dist and copy to dist", function(){
		grunt.task.requires("shellConfigCollect");
		grunt.loadNpmTasks("grunt-contrib-clean");

		let appNames = grunt.option("app");
		let appPaths = [];

		if(appNames && appNames.split){
			appNames = appNames.split(",");
			appPaths = config.apps
				.map(app => app.path)
				.filter(appPath => 
					appNames.some(appName => appPath.endsWith(appName))
				);
		}

		if(appNames && appPaths.length === 0){
			grunt.fail.fatal(`
				can't find any match with:
				${appPaths.join('\n')}
			`);
		}

		if(!appNames){
			appPaths = config.apps.map(app => app.path);
		}

		grunt.registerTask("copyApps", "copy selected apps for build", function(){
			const done = this.async();

			const AllPromise = appPaths.map(appPath => {
				const parts = appPath.split(path.sep);
				const appName = parts[parts.length -1];
				return fs.copy(appPath, path.join(distPath, appName));
			});

			Promise
				.all(AllPromise)
				.catch(() => grunt.fail.fatal(`Can't copy files`))
				.finally(done);
		});

		grunt.config.merge({
			clean: {
				distAll: [path.join(distPath, "*")]
			}
		});

		grunt.task.run([
			"clean:distAll",
			"copyApps"
		]);

	});
};
