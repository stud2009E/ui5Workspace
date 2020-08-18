const path = require("path");
const fs = require("fs-extra");

module.exports = function(grunt){

	grunt.registerTask("preload", "private: build app Component-preload.js", function(){

		grunt.task.requires("copyAppToDist");
		grunt.loadNpmTasks("grunt-openui5");

		const cwd = process.cwd();
		const distPath = path.join(cwd, "workspace/dist");
		const appNames = fs.readdirSync(distPath);
		const preload = {};
		const appInfo = grunt.config.get("appInfo");

		appNames.forEach(name => {
			let appId = appInfo[name].id;
			let prefix = appId.split(".").join("/");

			preload[name] = {};
			preload[name].components = true;
			preload[name].options = {};
			preload[name].options.dest = path.join(distPath, name, "webapp");
			preload[name].options.resources = {
				cwd: path.join(distPath, name, "webapp"),
				prefix: prefix
			};

		});

		grunt.config.merge({
			openui5_preload: preload
		});

		grunt.task.run(["openui5_preload"]);

	});

};