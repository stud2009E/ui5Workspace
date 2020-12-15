const path = require("path");
const yeoman = require("yeoman-environment");

module.exports = function(grunt){
    
    const genPath = path.join(process.cwd(), "generator-config",  "generators");
    const env = yeoman.createEnv();

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

    grunt.registerTask("change", "public: create fiori-elements changes", function(){
        env.register(path.join(genPath, "change"), "config:change");

        const done = this.async();
        env.run("config:change", done);
    });
  
};