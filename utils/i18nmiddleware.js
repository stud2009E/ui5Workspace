const config = require("../utils/ConfigContainer.js");
const path = require("path");
const fs = require("fs");
const { Buffer } = require("buffer");

module.exports = function(req, res, next){

    const cwd = process.cwd();

    if (/.*webapp.*i18n.properties/.test(req.url)){
        const i18nUrlPath =  path.join(cwd, path.normalize(decodeURI(req.url)));
        console.log("i18nUrlPath ", i18nUrlPath);
        const linkPath = path.resolve( i18nUrlPath, "../../../");
        console.log("linkPath ", linkPath);
        const filePart = i18nUrlPath.replace(linkPath, "");
        const dirPath = fs.realpathSync(linkPath);

        const file = fs.readFileSync(path.join(dirPath, filePart) , {
            encoding: "utf8"
        });

        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(file),
            'Content-Type': 'text/plain; charset=UTF-8'
            }).end(file);

        return;
    }
    next();
};