const util = require("util");
const exec = util.promisify(require("child_process").exec);

module.exports = function(grunt){

    grunt.registerTask("git-status", "git status for all repo in workspace", function(){
        grunt.task.requires("configCollect");

        const done = this.async();
        const applications = grunt.config.get("applications");
        const libraries = grunt.config.get("libraries");
        const plugins = grunt.config.get("plugins");

        let appPaths = [];
        if(applications){
            applications.map(app => app.path)
                .forEach(p => appPaths.push(p))
        }
        if(libraries){
            libraries.map(app => app.path)
                .forEach(p => appPaths.push(p))
        }
        if(plugins){
            plugins.map(app => app.path)
                .forEach(p => appPaths.push(p))
        }

        (async() => {
            for(let appPath of appPaths){
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
