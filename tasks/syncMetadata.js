const beatify = require("xml-beautifier");
const path = require("path");
const objectPath = require("object-path");
const https = require("https");
const fs = require("fs");
const Ajv = require("ajv");
const {systemSchema} = require("../utils/configSchema.js");


module.exports = function(grunt){
    grunt.registerTask("fetchMetadata", "private: synchronize metadata.xml", function(){
        grunt.task.requires("configCollect");
        
        const done = this.async();

        const appName = grunt.option("app");
        const configJSON = grunt.config.get("config");

        if(!appName){
            grunt.fail.fatal("error: require app name, use --app=<app name>");
        }

		const userKey = grunt.option("user") || objectPath.get(configJSON, "userDefaultKey");
		const systemKey = grunt.option("sys") || objectPath.get(configJSON, "systemDefaultKey");
        if(!systemKey || !userKey){
			grunt.fail.fatal("can't find user or system");
		}

        const systemConfig = objectPath.get(config, "system");
        const ajv = new Ajv({useDefaults: true});
        const validate = ajv.compile(systemSchema);
        if(!validate(systemConfig)){
            validate.errors.forEach( err => {
                grunt.log.error(`${err.message}:\n${err.schemaPath}`);
            });
            grunt.fail.fatal(validate.errors[0].message);
        }

        const system = objectPath.get(config, ["system", systemKey]);
        const user = objectPath.get(config, ["system", systemKey, "user", userKey]);

        if(!system || !user){
			grunt.fail.fatal("can't find user or system");
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