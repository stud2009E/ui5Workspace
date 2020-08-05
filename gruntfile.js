module.exports = function(grunt){

	grunt.loadTasks("tasks");

	grunt.registerTask("buildIndex", ["shellConfigCollect", "flpIndexBuild"]);


	grunt.registerTask("dev", [
		"shellConfigCollect",
		"flpIndexBuild",
		"serve"
	]);
};
