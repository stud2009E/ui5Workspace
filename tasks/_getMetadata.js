const path = require("path");
const objectPath = require("object-path");
const http = require("http");
const fs = require("fs-extra");
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
        const localServiceDir = path.join(app.path, "webapp", "localService");
        const metadataPath = path.join(localServiceDir, "metadata.xml");
        const annotationPath = path.join(localServiceDir, "annotation.xml");
        fs.ensureDirSync(localServiceDir);

        let serviceUrl = manifest.serviceUrl();
        let annotationUrl = manifest.dataSourceUri(app.annoDataSource);
        serviceUrl = serviceUrl.endsWith("/") ? serviceUrl : `${app.serviceUrl}/`;

        const save = (url, path, resolve, reject) => res => {
            const { statusCode } = res;
            const contentType = res.headers["content-type"];
        
            let error;
            if(statusCode >= 400 && statusCode < 600){
                error = new Error(
                    `Request for ${url} failed. Status Code: ${statusCode}`
                );
            }
        
            if(!error && !/^application\/xml/.test(contentType)){
                error = new Error(
                    `Invalid content-type for ${url}. Expected 'application/xml' but received ${contentType}`
                );
            }
        
            if(error){
                reject(error.message);
                return;
            }
        
            const fws = fs.createWriteStream(path);
            res.pipe(fws);
            fws.on("finish", () => {
                grunt.log.ok(`Request for ${url} ok`); 
                grunt.log.ok(`Save in ${path} completed`); 
                fws.close();
                resolve();
            }).on("error", reject);
        };

        let p1 = new Promise((resolve, reject) => {
            if(serviceUrl){ 
                http.get({
                    host: "localhost",
                    port: 8000,
                    auth: `${user.login}:${user.pwd}`,
                    path: `${serviceUrl}$metadata?sap-client=${user.mandt}&sap-language=${user.language}`
                }, save(`${serviceUrl}$metadata`, metadataPath, resolve, reject));
            }else{
                reject("no serviceUrl");
            }
        }).catch(grunt.log.error);

        let p2 = new Promise((resolve, reject) => {
            if(annotationUrl){
                http.get({
                    host: "localhost",
                    port: 8000,
                    auth: `${user.login}:${user.pwd}`,
                    path: `${annotationUrl}?sap-client=${user.mandt}&sap-language=${user.language}`
                }, save(annotationUrl, annotationPath, resolve, reject));
            }else{
                reject("no annotationUrl");
            }
        }).catch(grunt.log.error);

        Promise.allSettled([p1, p2]).finally(done);
    });
}