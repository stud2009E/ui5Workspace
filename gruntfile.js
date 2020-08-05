const connectTask = require("./tasks/connect.js");
const jshintTask = require("./tasks/jshint.js");
const flpTileConfigTask = require("./tasks/flpTileConfig");

module.exports = function(grunt){

	flpTileConfigTask(grunt);
	connectTask(grunt);
	jshintTask(grunt);

	grunt.registerTask("dev", ["flpConfig", "serve"]);
};
