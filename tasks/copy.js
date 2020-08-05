const path = require('path');

module.exports = function (grunt) {

	grunt.loadNpmTasks("grunt-contrib-copy");

	const app = grunt.option("app");

	grunt.config.merge({
		copy: {
			selected: {
				
			},
			all: {

			}
		}
	});
};
