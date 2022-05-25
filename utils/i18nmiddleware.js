const path = require("path");
const fs = require("fs");
const { Buffer } = require("buffer");

module.exports = function(grunt){
    const regexp = /apps\W+(\w+)\W+webapp.+i18n.properties/;
    const libMap = grunt.config.get("libMap");
	const pluginMap = grunt.config.get("pluginMap");
	const appMap = grunt.config.get("appMap");

    return function(req, res, next){
        const url = decodeURI(req.url); 
        if (regexp.test(url)){
            const urlExec = regexp.exec(url);
            const appName = urlExec[1];

            const app = appMap[appName] || libMap[appName] || pluginMap[appName];

            if(!app){
                next();
            }

            const i18nPath =  path.join(app.path, "webapp", "i18n", "i18n.properties");

            const file = fs.readFileSync(i18nPath, {
                encoding: "utf8"
            });

            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(file),
                'Content-Type': 'text/plain; charset=UTF-8'
            }).end(file);
        }else{
            next()
        }
    }
};