const path = require('path');

module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");

	const app = grunt.option("app");

	grunt.config.merge({
		watch: {
			scripts: {
				files:[
					"workspace/apps/**/*.js",
					"tasks/**/*.js"
				],
				tasks:[
					"jshint:tasks",
					"jshint:dev"
				],
				options:{
					spawn:false
				}
			}
		},
		jshint:{
			options: {
				eqeqeq:true,
				curly: true,
				undef: true,
				unused: true
			},
			tasks:{
				options: {
					esversion: 6,
					node: true,
					globals: {
						grunt: true
					}
				},
				src: "tasks/**/*.js"
			},
			dev: {
				options: {
					strict: true,
					esversion: 5,
					camelcase: true,
					bitwise: true,
					jquery: true,
					browser: true,
					globals: {
						sap: true,
						console: true
					}
				},
				src: "workspace/apps/**/*.js"
			},
			prod: {
				options: {
					strict: true,
					esversion: 5,
					camelcase: true,
					bitwise: true,
					jquery: true,
					browser: true,
					shadow: true,
					maxerr: 100,
					globals: {
						sap: true,
						Promise: true
					}
				},
				src: `workspace/apps/${app}/**/*.js`
			}
		}
	});

	grunt.registerTask("jshintprod", function () {

		if(!app){
			grunt.log.error("need to specify parameter: --app=<appname>");
			return false;
		}

		grunt.task.run("jshint:prod");
	});

};
