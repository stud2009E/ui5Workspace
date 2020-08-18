module.exports = function(grunt){

	grunt.loadTasks("tasks");

	grunt.registerTask("dev", "public: start dev server", [
		"shellConfigCollect",
		"flpIndexBuild",
		"serve"
	]);


	grunt.registerTask("build", "public: build Component-preload.js for app", [
		"shellConfigCollect",
		"copyAppToDist",
		"preload"
	]);


	grunt.registerTask("buildExcel", "public: build excel metadata.xlsx based on metadata.xml", [
		"shellConfigCollect",
		"excelMaket"
	]);


	grunt.registerTask("parseExcel", "public: build mockdata jsons from metadata.xlsx", [
		"shellConfigCollect",
		"excel2json"
	]);
};
