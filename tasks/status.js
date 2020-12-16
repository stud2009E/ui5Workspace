const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const exec = util.promisify(require("child_process").exec);

module.exports = function(grunt){

    grunt.registerTask("git-status", "git status for all repo in workspace", function(){
        const cwd = process.cwd();
        const configPath = path.join(cwd, "config.json");
        const config = fs.readJsonSync(configPath);
        const done = this.async();

        let appPaths = [];
        if(Array.isArray(config.apps)){
            config.apps.map(app => app.path)
                .forEach(p => appPaths.push(p))
        }
        if(Array.isArray(config.libs)){
            config.libs.map(app => app.path)
                .forEach(p => appPaths.push(p))
        }
        if(Array.isArray(config.plugins)){
            config.libs.map(app => app.path)
                .forEach(p => appPaths.push(p))
        }

        (async() => {
            for(const appPath of appPaths){
                const {stdout} = await exec("git status",{
                    cwd: appPath
                });
    
                if(stdout.includes("nothing to commit, working tree clean") 
                    && stdout.includes("Your branch is up to date")){
                }else{
                    console.log("=".repeat(80))
                    console.log("\x1b[41m%s\x1b[0m", appPath);
                    console.log(stdout);
                }
            }

            done();
        })();
        
    });
}
