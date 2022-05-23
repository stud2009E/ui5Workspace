module.exports = function (grunt) {
	grunt.loadTasks("tasks");

	grunt.config.set("showErrorsAndFail", validate => {
		if (validate.errors) {
			validate.errors.forEach(err => {
				grunt.log.error(`${err.message}:\n${err.schemaPath}`);
			});
			grunt.fail.fatal(validate.errors[0].message);
		}
	});

	grunt.registerTask("preload", "public: preload application", [
		"configCollect",
		"preload_build"
	]);

	grunt.registerTask("upload", "public: deploy application", [
		"preload",
		"uploadProd"
	]);

	grunt.registerTask("dev", "public: start dev server", [
		"configCollect",
		"flpIndexBuild",
		"serve"
	]);

	grunt.registerTask("syncMetadata", "public: sync metadata for app", [
		"configCollect",
		"fetchMetadata"
	]);
};
