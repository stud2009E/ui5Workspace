module.exports = function(grunt){
	grunt.loadTasks("tasks");
	
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
