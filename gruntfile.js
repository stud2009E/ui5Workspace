module.exports = function(grunt){
	grunt.loadTasks("tasks");

	grunt.registerTask("upload", "public: deploy application", [
		"shellConfigCollect",
		"preload",
		"uploadProd"
	]);

	grunt.registerTask("dev", "public: start dev server", [
		"shellConfigCollect",
		"flpIndexBuild",
		"serve"
	]);

	grunt.registerTask("syncMetadata", "public: sync metadata for app", [
		"shellConfigCollect",
		"fetchMetadata"
	]);
};
