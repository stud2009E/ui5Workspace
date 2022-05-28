const path = require("path");
const objectPath = require("object-path");
const https = require("https");
const fs = require("fs");
const Ajv = require("ajv");
const {systemSchema} = require("../utils/configSchema.js");


module.exports = function(grunt){
    grunt.registerTask("_getMetadata", "private: load metadata.xml", function(){
        grunt.task.requires("configCollect");
        
        const done = this.async();

        const config = grunt.config.get("config");
        const appMap = grunt.config.get("appMap");

		const appName = grunt.option("app");
		const userKey = grunt.option("user") || objectPath.get(config, "userCDKey") || objectPath.get(config, "userDefaultKey");
		const systemKey = grunt.option("sys") || objectPath.get(config, "systemCDKey") || objectPath.get(config, "systemDefaultKey");
		
		if(!userKey || !systemKey){
			grunt.fail.fatal("can't find user or system");
		}
		if(!appName){
			grunt.fail.fatal("can't find application name");
		}

		const app = appMap[appName];
		const system = objectPath.get(config, ["system", systemKey]);
		const user = objectPath.get(config, ["system", systemKey, "user", userKey]);

		if(!app || !system || !user ){
			grunt.fail.fatal("can't define app or system or user");
		}

        const ajv = new Ajv({useDefaults: true});
		const validateSystem = ajv.compile(systemSchema);
		if(!validateSystem(system)){
			grunt.config.get("showErrorsAndFail")(validateSystem);
		}

        const metadataPath = path.join(appInfo.path, "webapp", "localService", "metadata.xml");

        appInfo.rootUri = appInfo.rootUri.endsWith("/") ? appInfo.rootUri : `${appInfo.rootUri}/`;

        https.get({
            host: system.host,
            port: system.port,
            auth: `${user.login}:${user.pwd}`,
            path: `${appInfo.rootUri}$metadata?sap-client=${mandt}`
        }, res => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
        
            let error;
            if(statusCode >= 400 && statusCode < 600){
                error = new Error( `Request Failed.\nStatus Code: ${statusCode}`);
            }
        
            if(!/^application\/xml/.test(contentType)){
                error = new Error(
                    `Invalid content-type.\nExpected application/json but received ${contentType}`
                );
            }
        
            if(error){
                console.error(error.message);
                res.resume();
                done();

                return;
            }
        
            const fws = fs.createWriteStream(metadataPath);
            res.pipe(fws);
        
            fws.on('finish',() => {
                console.log('Download Completed'); 
                fws.close();
                done();
            });
        }).on("error", console.error);

    });
}