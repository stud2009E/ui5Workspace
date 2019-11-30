let Config = require('./Config');

module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks("grunt-connect-proxy");
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: Config.server.port,
                    livereload: false,
                    keepalive: true,
                    middleware: function (connect, options, middlewares) {
                        middlewares.unshift(require("grunt-connect-proxy/lib/utils").proxyRequest);
                        return middlewares;
                    }
                }
            }
        },

        openui5_connect: {
            server: {
                options: {
                    appresources: "src",
                    resources: Config.localSDKPath + "/resources",
                    testresources: Config.localSDKPath + "/test-resources"
                }
            }
        }
    });

    grunt.registerTask("serve", function () {
        grunt.task.run([
            "configureProxies:server",
            "openui5_connect:server"
        ]);
    });
};