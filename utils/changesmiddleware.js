const path = require("path");
const fs = require("fs");
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
            let dirChanges = null;

            for(let name in appMap){
                if( appMap.hasOwnProperty( name ) ) {
                    const app = appMap[name];
                    if(app.name === semanticObject && app.action === action){
                        dirChanges = path.join(app.path,  "/webapp/changes");
                        break; 
                    }
                }
            }

            if(!dirChanges){
                return next();
            }

            const changefiles = fs.readdirSync(dirChanges) || [];
            changefiles.forEach(path => {
                const changeJson = fs.readJSONSync(path, {
                    encoding: "utf8"
                });
                changes.push(changeJson);
            });

            const result = {
                changes: changes,
                settings: {
                    isKeyUser: true,
                    isAtoAvailable: false,
                    isProductiveSystem: false
                }
            };

            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(file),
                'Content-Type': 'application/json; charset=UTF-8'
            }).end(result);
        }else{
            return next();
        }
    }
};