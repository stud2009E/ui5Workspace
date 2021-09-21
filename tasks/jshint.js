module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");

	const app = grunt.option("app");

	grunt.config.merge({
		watch: {
			dev: {
				files:[
					"workspace/apps/**/*.js"
				],
				tasks: [
					"jshint:dev"
				],
				options:{
					spawn: false
				}
			},
			taskDev: {
				files:[
					"tasks/**/*.js",
					"utils/**/*.js"
				],
				tasks: [
					"jshint:tasks"
				],
				options:{
					spawn: false
				}
			}
		},
		jshint:{
			options: {
				eqeqeq: true,
				curly: true,
				undef: true,
				unused: true
			},
			tasks:{
				options: {
					esversion: 9,
					node: true,
					globals: {
						grunt: true
					}
				},
				src: ["tasks/**/*.js", "utils/**/*.js"]
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
						sap: false,
						console: false
					}
				},
				src: "workspace/apps/**/*.js"
			},
			prod: {
				options: {
					esversion: 5,
					camelcase: true,
					undef: true,
					bitwise: true,
					jquery: true,
					browser: true,
					shadow: false,
					forin: true,
					maxerr: 20,
					strict: false,
					unused: "vars",
					leanswitch: true,
					globals: {
						sap: false,
						Promise: false,
						jQuery: false,
						QUnit: false,
						$: false
					}
				},
				src: `workspace/apps/${app}/webapp/**/*.js`
			}
		}
	});
};
