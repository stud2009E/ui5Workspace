module.exports = function(grunt){

	grunt.loadTasks("tasks");

	grunt.registerTask("dev", [
		"shellConfigCollect",
		"flpIndexBuild",
		"serve"
	]);

	grunt.registerTask("build", [
		"shellConfigCollect",
		"copyAppToDist",
		"preload"
	]);


	grunt.registerTask("buildExcel", [
		"shellConfigCollect",
		"excelMaket"
	]);

	grunt.registerTask("parseExcel", [
		"shellConfigCollect",
		"excel2json"
	]);
	
};
