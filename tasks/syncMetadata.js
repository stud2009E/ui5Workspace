const beatify = require("xml-beautifier");
const path = require("path");
const https = require("https");
const fs = require("fs");

module.exports = function(grunt){
    grunt.registerTask("fetchMetadata", "private: synchronize metadata.xml", function(){
        grunt.task.requires("configCollect");
        
        const done = this.async();

        const appName = grunt.option("app");
        const mandt = grunt.option("mandt");
        const userKey = grunt.option("user") || config.userCDKey;
        const systemKey = grunt.option("sys") || config.systemCDKey;

        const user = config.getUser(systemKey, userKey);
        const system = config.getSystem(systemKey);

        if(!appName){
            grunt.fail.fatal("error: require app name, use --app=<app name>");
        }
        if( !mandt){
            grunt.fail.fatal("error: require mandt, use --mandt=<mandt>");
        }
        
        const flpAppInfo = grunt.config.get("appInfo");
        const appInfo = flpAppInfo[appName];
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