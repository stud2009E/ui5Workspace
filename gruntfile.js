module.exports = function (grunt) {
	grunt.loadTasks("tasks");

	grunt.config.set("showErrorsAndFail", validate => {
		if (validate.errors) {
			grunt.log.error("Errors:")
			validate.errors.forEach(err => {
				grunt.log.error(`${err.message}:\n${err.instancePath}\n${err.schemaPath}`);
				grunt.log.error("")
			});
			grunt.fail.fatal("check config.json!!!");
		}
	});

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

	grunt.registerTask("getMetadata", "public: get metadata for app", [
		"configCollect",
		"_getMetadata"
	]);
};
