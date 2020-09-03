const { registerTask } = require("grunt");

module.exports = function(grunt){
	grunt.loadTasks("tasks");

	grunt,registerTask("upload", "public: deploy application", [
		// "jshint:prod",
		// "test",
		"preload",
		"uploadProd"
	]);

	grunt.registerTask("dev", "public: start dev server", [
		"shellConfigCollect",
		"flpIndexBuild",
		"serve"
	]);
};
