const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);
const yeoman = require("yeoman-environment");

module.exports = function(grunt){
    
    const confPath = path.join(process.cwd(), "generator-config");
    const genPath = path.join(confPath, "generators");
    const env = yeoman.createEnv();

    grunt.registerTask("yo-init", "symlink a global module to our local generator", function(){
        const done = this.async();

        (async () => {
            const {stderr, stdout} = await exec("npm link", {
                cwd: confPath
            });
    
            console.log(stderr);
            console.log(stdout);
            
            done();
        })();
    });

    grunt.registerTask("newapp", "public: create new custom application from template", function(){
        env.register(path.join(genPath, "app"), "config:app");
        
        const done = this.async();
        env.run("config:app", {
            root: process.cwd()
        }, done);
    });

    grunt.registerTask("config", "public: create workspace main setup config.json", function(){
        env.register(path.join(genPath, "init"), "config:init");

        const done = this.async();
        env.run("config:init", done);
    });
  
};