const config = require("../utils/ConfigContainer.js");

module.exports = function(grunt){

	grunt.registerTask("test", "public: start unit test for application", function(){

		grunt.loadNpmTasks("grunt-contrib-qunit");
		grunt.loadNpmTasks("grunt-contrib-connect");
		grunt.loadNpmTasks("grunt-openui5");

		const appName = grunt.option("app");
		if(!appName){
			grunt.fail.fatal("error: require app name, use --app=<app name>");
		}

		grunt.config.merge({
			qunit: {
				all: {
					options: {
						urls: [
							`http://localhost:8000/apps/${appName}/webapp/test/unit/allTests.html`
						]
					}
				}
			},
			connect:{
				server:{
					options:{
						port: 8000,
						keepalive: false
					}
				}
			},
			openui5_connect: {
				server: {
					options:{
						appresources: "workspace",
						resources: config.resources,
						testresources: config.testresources
					}
				}
			}
		});

		grunt.task.run([
			"openui5_connect:server",
			"qunit"
		]);
	});

}