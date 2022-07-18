const path = require("path");
const fs = require("fs-extra");
const { Buffer } = require("buffer");

module.exports = function(grunt){
    const regexp = /appChanges\?semanticObject=(\w+)&action=(\w+)/;
	const appMap = grunt.config.get("appMap");

    return function(req, res, next){
        const url = decodeURI(req.url);
        const changes = [];

        if (regexp.test(url)){
            const urlExec = regexp.exec(url);
            const semanticObject = urlExec[1];
            const action = urlExec[2];
            let changesDir = null;

            for(let name in appMap){
                if( Object.prototype.hasOwnProperty.call(appMap, name) ){
                    const app = appMap[name];
                    if(app.name === semanticObject && app.action === action){
                        changesDir = path.join(app.path, "/webapp/changes");
                        break; 
                    }
                }
            }

            if(!changesDir || !fs.pathExistsSync(changesDir)){
                return next();
            }

            const changefiles = fs.readdirSync(changesDir) || [];
            if(changefiles.length === 0){
                return next();
            }
            
            changefiles.forEach(filename => {
                const changeJson = fs.readJSONSync(path.join(changesDir, filename), {
                    encoding: "utf8"
                });
                changes.push(changeJson);
            });

            const data = {
                changes: changes,
                settings: {
                    isKeyUser: true,
                    isAtoAvailable: false,
                    isProductiveSystem: false
                }
            };
            const result = JSON.stringify(data);
            res.writeHead(200, {
                "Content-Length": Buffer.byteLength(result),
                "Content-Type": "application/json; charset=UTF-8"
            }).end(result);
        }else{
            return next();
        }
    }
};