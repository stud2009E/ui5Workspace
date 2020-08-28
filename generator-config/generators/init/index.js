const Generator = require('yeoman-generator');
const {prompts, whenInit} = require("./prompts");  

module.exports = class extends Generator {
    
    constructor(args, opts){
        super(args, opts);

        this.argument("gruntroot", {
            desc: "root path for gruntfile.js",
            type: String,
            required: true
        });
    }

    initializing(){
        this.destinationRoot(this.options.gruntroot);

        if(!this.existsDestination("config.json")){
            prompts.shift();
        }
    }

    async prompting(){
        this._answers = await this.prompt(prompts);
    }
    
    processAnswers(){
        const answers = this._answers;
        const configTemplate = {
            sdk: null,
            apps: [],
            libs: [],
            plugins: [],
            themeRoots: undefined,
            theme: undefined,
            systemDefault: undefined,
            userDefault: undefined,
            proxyModule: undefined,
            system: undefined
        };

        configTemplate.sdk = answers.sdk;
        configTemplate.theme = answers.theme;

        const app = {};
        ["path", "transport", "package", "bsp", "action", "mockModelName"]
            .forEach(prop => app[prop] = answers[`app-${prop}`]);
        configTemplate.apps.push(app);

        if(answers["lib-add"]){
            const lib = {};
            ["path", "namespace"].forEach(prop => lib[prop] = answers[`lib-${prop}`]);
            configTemplate.libs.push(lib);
        }

        if(answers["plugin-add"]){
            const plugin = {};
            ["path"].forEach(prop => plugin[prop] = answers[`plugin-${prop}`]);
            configTemplate.plugins.push(plugin);
        }

        if(answers["themeRoots-add"]){
            configTemplate.themeRoots = {
                [answers.theme]: answers.themeUrl
            }
        }

        if(answers["system-add"]){
            const system = {};
            ["host", "port", "context", "secure", "https"]
                .forEach(prop => system[prop] = answers[`system-${prop}`]);

            const user = {};
            ["login", "pwd"].forEach(prop => user[prop] = answers[`user-${prop}`]);

            system.user = {
                [answers["user-key"]]: user
            };

            configTemplate.system = {
                [answers["system-key"]]: system
            }

            configTemplate.systemDefault = answers["system-key"];
            configTemplate.userDefault = answers["user-key"];
            configTemplate.proxyModule = answers.proxyModule;
        }

        this._config = configTemplate;
    }

    writing(){
        if(!whenInit(this._answers)) {
            return;
        }
        this.writeDestinationJSON("config.json", this._config, "\t");
    }

    end(){
        this.log();
    }

    
};