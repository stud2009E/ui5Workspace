module.exports = function(grunt){
	grunt.loadTasks("tasks");

	grunt.registerTask("dev", "public: start dev server", [
		"shellConfigCollect",
		"flpIndexBuild",
		"serve"
	]);
};
