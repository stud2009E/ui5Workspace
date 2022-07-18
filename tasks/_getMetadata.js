const path = require("path");
const objectPath = require("object-path");
const https = require("https");
const fs = require("fs");
const {systemSchema} = require("../utils/configSchema.js");
const Manifest = require("../utils/Manifest.js");

module.exports = function(grunt){
    grunt.registerTask("_getMetadata", "private: load metadata.xml", function(appNameArg){
        grunt.task.requires("configCollect");
        
        const done = this.async();

        const config = grunt.config.get("config");
        const appMap = grunt.config.get("appMap");

		const appName = grunt.option("app") || appNameArg;
		const userKey = grunt.option("user") || objectPath.get(config, "userCDKey") || objectPath.get(config, "userDefaultKey");
		const systemKey = grunt.option("sys") || objectPath.get(config, "systemCDKey") || objectPath.get(config, "systemDefaultKey");
		
		if(!userKey || !systemKey){
			grunt.fail.fatal("can't find user or system");
		}
		if(!appName){
			grunt.fail.fatal("can't find application name");
		}

        const ajv = grunt.config.getRaw("ajv");
		const validateSystem = ajv.compile(systemSchema);
		if(!validateSystem(objectPath.get(config, "system"))){
            grunt.config.get("showErrorsAndFail")(validateSystem);
		}
        
        const app = appMap[appName];
        const user = objectPath.get(config, ["system", systemKey, "user", userKey]);
        const system = objectPath.get(config, ["system", systemKey]);

        if(!app || !system || !user ){
			grunt.fail.fatal("can't define app or system or user");
		}
        
        const manifest = new Manifest(path.join(app.path, "webapp"));
        const metadataPath = path.join(app.path, "webapp", "localService", "metadata.xml");

        let serviceUrl = manifest.serviceUrl();
        serviceUrl = serviceUrl.endsWith("/") ? serviceUrl : `${app.serviceUrl}/`;

        https.get({
            host: system.host,
            port: system.port,
            auth: `${user.login}:${user.pwd}`,
            path: `${serviceUrl}$metadata?sap-client=${user.mandt}`
        }, res => {
            const { statusCode } = res;
            const contentType = res.headers["content-type"];
        
            let error;
            if(statusCode >= 400 && statusCode < 600){
                error = new Error( `Request Failed.\nStatus Code: ${statusCode}`);
            }
        
            if(!/^application\/xml/.test(contentType)){
                error = new Error(
                    `Invalid content-type.\nExpected 'application/xml' but received ${contentType}`
                );
            }
        
            if(error){
                console.error(error.message);
                done();

                return;
            }
        
            const fws = fs.createWriteStream(metadataPath);
            res.pipe(fws);
        
            fws.on("finish", () => {
                console.log("Download Completed"); 
                fws.close();
                done();
            });
        }).on("error", console.error);

    });
}