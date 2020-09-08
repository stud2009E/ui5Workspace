const beatify = require("xml-beautifier");
const config = require("../utils/ConfigContainer.js");
const path = require("path");
const https = require("https");

module.exports = function(grunt){

    grunt.registerTask("fetchMetadata", "private: synchronize metadata.xml", function(){
        grunt.task.requires("shellConfigCollect");
        
        const done = this.async();

        const appName = grunt.option("app");
        const userKey = grunt.option("user") || config.userDefaultKey;
        const systemKey = grunt.option("sys") || config.systemDefaultKey;

        const user = config.getUser(systemKey, userKey);
        const system = config.getSystem(systemKey);

        if(!appName){
            grunt.fail.fatal("error: require app name, use --app=<app name>");
        }

        const flpAppInfo = grunt.config.get("appInfo");
        const appInfo = flpAppInfo[appName];

        const request = https.request({
            host: system.host,
            port: system.port,
            method: "GET",
            path: `${appInfo.rootUri}$metadata`,
            rejectUnauthorized: false
        });

        const ident = Buffer.from(`${user.login}:${user.pwd}`).toString("base64");

        request.setHeader("Authorization", ` Basic ${ident}`);

        request.on("response", function(response){
            let xml = "";

            if(response.statusCode >= 400){
                grunt.fail.fatal(`error get metadata.xml: ${err}`);
            }

            response
                .on("data", chunk => {
                    xml += chunk;
                })
                .on("close", () => {

                    grunt.file.write(
                        path.join(appInfo.path, "webapp", "localService", "metadata.xml"),
                        beatify(xml),
                        {encoding: "utf8"}
                    );
                    done();
                })
                .on("error", err => {
                    grunt.fail.fatal(`error read response: ${err}`);
                });
        })
        .on("error", err => {
            grunt.fail.fatal(`error get metadata.xml: ${err}`);
        });

        request.end();

    });

}