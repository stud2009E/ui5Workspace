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
                },
                proxies: []
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

    grunt.registerTask("setProxies", function () {
        let proxies = [];
        Config.libs.forEach(function (oLib) {
            let proxy = {
                context: "/sap/bc/ui5_ui5/sap/" + oLib.bspContainer,
                host: "localhost",
                port: Config.server.port,
                https: false,
                rewrite: {}
            };
            proxy.rewrite["^/sap/bc/ui5_ui5/sap/" + oLib.bspContainer + "/"] = "/ui/libs/" + oLib.bspContainer + "/src/" + oLib.name.replace(/[.]/g, "/") + "/";
            proxies.push(proxy);
        });
        grunt.config.set("connect.server.proxies", proxies);
    });

    grunt.registerTask("setProdProxies", function () {
        let proxies = [];
        Config.libs.forEach(function (oLib) {
            let proxy = {
                context: "/sap/bc/ui5_ui5/sap/" + oLib.bspContainer,
                host: "localhost",
                port: Config.server.port,
                https: false,
                rewrite: {}
            };
            proxy.rewrite["^/sap/bc/ui5_ui5/sap/" + oLib.bspContainer + "/"] = "/ui/libs/" + oLib.bspContainer + "/src/" + oLib.name.replace(/[.]/g, "/") + "/";
            proxies.push(proxy);
        });
        let proxySDD = {
            context: "/sap/opu/odata/SAP/",
            host: "sap-sdd001.sigma.sbrf.ru",
            port: 8001,
            secure: false,
            https: true,
            headers: {
                'Authorization': 'Basic cHJlb2JyYXpoZW5zOnN2NGdsNk5N'
            }
        };
        proxies.push(proxySDD);
        grunt.config.set("connect.server.proxies", proxies);
    });

    grunt.registerTask("serve", function () {
        grunt.task.run([
            "setProxies",
            "configureProxies:server",
            "openui5_connect:server"
        ]);
    });

    grunt.registerTask("prod", function () {
        grunt.task.run([
            "setProdProxies",
            "configureProxies:server",
            "openui5_connect:server"
        ]);
    });
};