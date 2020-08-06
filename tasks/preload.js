const path = require("path");
const config = require("../utils/ConfigContainer.js");
const fs = require("fs-extra");

module.exports = function(grunt){

	grunt.registerTask("preload", "build app component preload", function(){

		grunt.task.requires("copyAppToDist");
		grunt.loadNpmTasks("grunt-openui5");

		const cwd = process.cwd();
		const distPath = path.join(cwd, "workspace/dist");

		const appNames = fs.readdirSync(distPath);
		const preload = {};
		const appInfo = grunt.config.get("appInfo");

		appNames.forEach(appName => {
			let appId = appInfo[appName].id;
			let prefix = appId.split(".").join("/");

			preload[appName] = {};
			preload[appName].components = true;
			preload[appName].options = {};
			preload[appName].options.dest = path.join(distPath, appName, "webapp");
			preload[appName].options.resources = {
				cwd: path.join(distPath, appName, "webapp"),
				prefix: prefix
			};

		});

		grunt.config.merge({
			openui5_preload: preload
		});

		grunt.task.run(["openui5_preload"]);

	});

}