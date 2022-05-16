const path = require("path");
const fs = require("fs-extra");
const objectPath = require("object-path");
const Manifest = require("../utils/Manifest.js");
const {baseSchema} = require("../utils/configSchema.js");
const Ajv = require("ajv");

module.exports = function (grunt) {

	grunt.registerTask("configCollect", "private: collect settings for plugins, apps, libs", function(){
		const cwd = process.cwd();
		const appsDir = path.join(cwd, "workspace/apps");
		const flpPath = path.join(cwd, "workspace/fiori");
		
		const resourceroots = {"flp.root": "/"};
		
		//remove apps symlinks
		fs.emptyDirSync(appsDir);
		
		const configJSON = fs.readJSONSync(path.join(cwd, "config.json"), {
			encoding: "utf8"
		});
		const ajv = new Ajv({useDefaults: true});
		const validate = ajv.compile(baseSchema);
		if(!validate(configJSON)){
			validate.errors.forEach( err => {
				grunt.log.error(`${err.message}:\n${err.schemaPath}`);
			});
			grunt.fail.fatal(validate.errors[0].message);
		}
		
		const applications = {};
		const appMap = {};
		const applicationsConfig = objectPath.get(configJSON, "apps") || [];
		//create settings for flpd index.html
		applicationsConfig.forEach(app => {
			const {name, action = "display"} = app;
			const manifest = new Manifest(app.path);
			const symlinkPath = path.join(cwd, "workspace/apps", name, "webapp");
			
			fs.symlinkSync(app.path, path.join(appsDir, name), "dir");
			
			if(manifest.type() === "application"){
				const appKey = `${name}-${action}`;
				
				applications[appKey] = {};
				applications[appKey].id = manifest.id();
				applications[appKey].type = manifest.type();
				applications[appKey].rootUri = manifest.serviceUrl(app.modelName);
				applications[appKey].additionalInformation = `SAPUI5.Component=${manifest.id()}`;
				applications[appKey].applicationType = "URL";
				applications[appKey].description = appKey;
				applications[appKey].title = name;
				applications[appKey].url = path.relative(flpPath, symlinkPath);
			} else{
				grunt.fail.fatal(`${name}: app type must be 'application'`);
			}
			
			appMap[name] = app; 

			resourceroots[manifest.id()] = path.relative(flpPath, symlinkPath);
		});
		
		const plugins = {};
		const pluginMap = {};
		const pluginsConfig = objectPath.get(configJSON, "plugins") || [];
		//create plugins settings for flp index.html`
		pluginsConfig.forEach(app => {
			const {name} = app;
			const manifest = new Manifest(app.path);
			const symlinkPath = path.join(cwd, "workspace/apps", name, "webapp");

			fs.symlinkSync(app.path, path.join(appsDir, name), "dir");
			
			if(appType === "component"){
				plugins[name] = {};
				plugins[name].component = manifest.id();
				plugins[name].config = app.config || {};
			} else{
				grunt.fail.fatal(`${name}: app type for plugin must be 'component'`);
			}

			pluginMap[name] = app;

			resourceroots[manifest.id()] = path.relative(flpPath, symlinkPath);
		});

		
		const libMap = {};
		const liblariesConfig = objectPath.get(configJSON, "libs") || [];
		//lib files path setup, proxy
		const libraries = liblariesConfig.map(lib => {
			const {name} = lib;
			const item = Object.assign({}, lib);

			fs.symlinkSync(lib.path, path.join(appsDir, name), "dir");
			
			item.context = path.join(lib.context, name);
			grunt.file.recurse(lib.path, (absPath, rootdir, subdir, filename) => {
				if(filename.endsWith("library.js")){
					item.path = path.join("/apps", name, subdir);
					return false;
				}
			});

			libMap[name] = lib;

			return item;
		});

		grunt.config.set("resourceroots", JSON.stringify(resourceroots));
		grunt.config.set("applications", applications);
		grunt.config.set("plugins", plugins);
		grunt.config.set("libraries", libraries);
		grunt.config.set("libMap", libMap);
		grunt.config.set("pluginMap", pluginMap);
		grunt.config.set("appMap", appMap);
	});
};