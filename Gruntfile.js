/*
    RUNNING SCRIPT EXAMPLES:
    1) grunt serve
    2) grunt build
    3) grunt deploy --user=preobrazhens --pwd=sv4gl6NM --app=ZSPL_FPI
    4) grunt deploy_lib --user=preobrazhens --pwd=sv4gl6NM --lib=ZSPL_LIB
	5) grunt deploy --user=preobrazhens --pwd=sv4gl6NM --app=ZSPL_OVP
*/

let Config = require('./Config');

module.exports = function (grunt) {

    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-openui5");
    grunt.loadNpmTasks("grunt-connect-proxy");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-nwabap-ui5uploader");

    // Parameters for deploy (comes from console command)
    let sUser = grunt.option("user");
    let sPwd = grunt.option("pwd");
    let sApp = grunt.option("app");
    let sLib = grunt.option("lib");
    let sSystem = grunt.option("system");

	let mRequest = {
		ZSPL_FPI: "SDDK902757",
		ZSPL_OVP: "SDDK902601",
		ZSPL_LIB: "SDDK902786",
		ZSPL_TOOL_PAGE: "SDDK902786"
	};

    grunt.initConfig({

        clean: [
            "src/dist/ui/apps/ZSPL_FPI",
			"src/dist/ui/apps/ZSPL_OVP",
			"src/dist/ui/apps/ZSPL_TOOL_PAGE",
            "src/dist/ui/libs/ZSPL_LIB"
        ],

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
        },

        openui5_preload: {
            ZSPL_FPI: {
                options: {
                    resources: {
                        cwd: "src/ui/apps/ZSPL_FPI/webapp",
                        prefix: "sb/fiori/app/spl/fpi"
                    },
                    dest: "src/dist/ui/apps/ZSPL_FPI/webapp"
                },
                components: true
            },

			ZSPL_OVP: {
                options: {
                    resources: {
                        cwd: "src/ui/apps/ZSPL_OVP/webapp",
                        prefix: "sb/fiori/app/spl/ovp"
                    },
                    dest: "src/dist/ui/apps/ZSPL_OVP/webapp"
                },
                components: true
            },

			ZSPL_TOOL_PAGE: {
                options: {
                    resources: {
                        cwd: "src/ui/apps/ZSPL_TOOL_PAGE",
                        prefix: "sb/fiori/app/spl/launchpad/viewPortContainer"
                    },
                    dest: "src/dist/ui/apps/ZSPL_TOOL_PAGE/webapp"
                },
                components: true
            },

            ZSPL_LIB: {
                options: {
                    resources: {
                        cwd: "src/ui/libs/ZSPL_LIB/src/sb/fiori/lib/spl",
                        prefix: "sb/fiori/lib/spl"
                    },
                    dest: "src/dist/ui/libs/ZSPL_LIB/src/sb/fiori/lib/spl"
                },
                components: false,
                libraries: true
            }
        },

        nwabap_ui5uploader: {
            options: {
                conn: {
                    useStrictSSL: false,
                    server: "https://sap-sdd001.sigma.sbrf.ru:8001"
                },
                auth: {
                    user: sUser,
                    pwd: sPwd
                }
            },
            upload_build: {
                options: {
                    ui5: {
                        package: "ZSPL",
                        transportno: mRequest[sApp],
                        bspcontainer: sApp,
                        bspcontainer_text: "Grunt deploy"
                    },
                    resources: {
                        cwd: `src/dist/ui/apps/${sApp}/webapp`,
                        src: "**/*.*"
                    }
                }
            },

            upload_library: {
                options: {
                    ui5: {
                        package: "ZSPL",
                        transportno:  mRequest[sLib],
                        bspcontainer: sLib,
                        bspcontainer_text: "Grunt deploy"
                    },
                    resources: {
                        cwd: `src/dist/ui/libs/${sLib}/src/sb/fiori/lib/spl`,
                        src: "**/*.*"
                    }
                }
            }
        }
    });

    grunt.registerTask("copy", function (target) {
        grunt.file.copy(`src/ui/apps/ZSPL_FPI/webapp/`, `src/dist/ui/apps/ZSPL_FPI/webapp`);
		grunt.file.copy(`src/ui/apps/ZSPL_OVP/webapp/`, `src/dist/ui/apps/ZSPL_OVP/webapp`);
		grunt.file.copy(`src/ui/apps/ZSPL_TOOL_PAGE/`, `src/dist/ui/apps/ZSPL_TOOL_PAGE/webapp`);
        grunt.file.copy(`src/ui/libs/ZSPL_LIB/src/sb/fiori/lib/spl`, `src/dist/ui/libs/ZSPL_LIB/src/sb/fiori/lib/spl`);
    });

    grunt.registerTask("setProxies", function () {
        let proxies = [];
        let proxyLib = {
            context: "/sap/bc/ui5_ui5/sap/ZSPL_LIB",
            host: "localhost",
            port: Config.server.port,
            https: false,
            rewrite: {}
        };
        proxyLib.rewrite["^/sap/bc/ui5_ui5/sap/ZSPL_LIB/"] = "/ui/libs/ZSPL_LIB/src/sb/fiori/lib/spl/";
        proxies.push(proxyLib);
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

    grunt.registerTask("build", [
        "clean",
        "openui5_preload:ZSPL_FPI",
		"openui5_preload:ZSPL_OVP",
        "openui5_preload:ZSPL_LIB",
		"openui5_preload:ZSPL_TOOL_PAGE",
        "copy"
    ]);

    grunt.registerTask("deploy", ["nwabap_ui5uploader:upload_build"]);

    grunt.registerTask("deploy_lib", ["nwabap_ui5uploader:upload_library"]);
};
