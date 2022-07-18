const Ajv = require("ajv");

module.exports = function (grunt){
	grunt.loadTasks("tasks");

	grunt.config.set("showErrorsAndFail", validate => {
		if (validate.errors){
			grunt.log.error("Errors:")
			validate.errors.forEach(err => {
				grunt.log.error(`${err.message}:\n${err.instancePath}\n${err.schemaPath}`);
				grunt.log.error("")
			});
			grunt.fail.fatal("check config.json!!!");
		}
	});

	const ajv = new Ajv({
		useDefaults: true, 
		allErrors: true,
		verbose: true
	});
	grunt.config.set("ajv", ajv)

	grunt.registerTask("preload", "public: preload application", [
		"configCollect",
		"_preload"
	]);

	grunt.registerTask("upload", "public: deploy application", [
		"preload",
		"_upload"
	]);

	grunt.registerTask("dev", "public: start dev server", [
		"configCollect",
		"_flpdIndex",
		"_serve"
	]);

	grunt.registerTask("getMetadata", "public: get metadata for app", function(appName){
		let task = "_getMetadata";
		if(appName){
			task = "_getMetadata:" + appName;
		} 

		grunt.task.run([
			"configCollect",
			task
		])
	});
};
