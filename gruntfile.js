module.exports = function(grunt){
	grunt.loadTasks("tasks");

	grunt.registerTask("upload", "public: deploy application", [
		"configCollect",
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
