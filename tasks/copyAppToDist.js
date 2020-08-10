const path = require("path");
const fs = require("fs-extra");
const config = require("../utils/ConfigContainer.js");

module.exports = function (grunt) {
	
	grunt.registerTask("copyAppToDist", "clean application from dist and copy to dist", function(){
		grunt.task.requires("shellConfigCollect");
		grunt.loadNpmTasks("grunt-contrib-clean");

		const cwd = process.cwd();
		const distPath = path.join(cwd, "workspace/dist");
		const appName = grunt.option("app");
		let {apps} = config;

		if(appName){
			apps = config.apps.filter(app => app.name === appName);
		}

		if(appName && apps.length === 0){
			grunt.fail.fatal(`can't find any match with: ${appName}`);
		}

		grunt.registerTask("copyApps", "copy selected apps for build", function(){
			const done = this.async();

			const copyAll = apps.map(app => 
				fs.copy(app.path, path.join(distPath, app.name)
			));

			Promise
				.all(copyAll)
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
