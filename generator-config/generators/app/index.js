const path = require("path");

const Generator = require("yeoman-generator");

const AppType = {
	z: "zapp",
	ovp: "ovp",
	op: "op",
	lr: "lr",
	lrop: "lrop",
	lib: "lib",
	plugin: "plugin"
};

module.exports = class extends Generator{

	_validateEmpty = input => !!input ? true : "required field!"
	
	/**
	 * validate sap bsp application id
	 * @param {string} id application
	 * @returns {true|string} if true success, else error text
	 */
	_validateAppId(input){
		return /^[a-z]+(\.[a-z]+)+$/.test(input) ? true : "application id must be like 'my.custom.app.id': /^[a-z]+(\.[a-z]+)+$/";
	}

	/**
	 * validate sap bsp application name
	 * @param {string} input app name
	 * @returns {true|string} if true success, else error text
	 */
	_validateAppName(input){
		return /^[zZ]\w{3,}$/.test(input) ? true : "application name must be like 'z_bsp_name': /^[zZ]\w{3,}$/";
	}

	/**
	 * validate manifest source uri
	 * @param {string} input source uri
	 * @returns {true|string} if true success, else error text
	 */
	_validateSourceUri(input){
		return /^(\/\w+)+\/$/.test(input) ? true: "source uri must be like '/my/odata/service/uri/': /^(\/\w+)+\/$/";
	}

	
	constructor(args, opts){
		super(args, opts);
		
		this.option("root", {
            description: "root path for gruntfile.js",
            type: String,
            required: true
        });
	}

	initializing(){
		const info = [
			"will create next folder structure:",
			"-path/to/dir",
			"\t-application name(bsp)",
			"\t\t-webapp",
			"\t\t\t..." 	
		];

		this.log(info.join('\n'));
	}

	async prompting(){
		this._answers = await this.prompt([{
			name: "appType",
			type: "list",
			message: "select application template",
			choices: [{
				name: "custom application",
				value: AppType.z
			},{
				name: "overview page",
				value: AppType.ovp
			},{
				name: "object page",
				value: AppType.op
			},{
				name: "list report",
				value: AppType.lr
			},{
				name: "list report - object page",
				value: AppType.lrop
			},{
				name: "library",
				value: AppType.lib
			},{
				name: "plugin",
				value: AppType.plugin
			}]
		},{
			name: "dir",
			message: "path to application dir",
			validate: this._validateEmpty,
			default: "C:\\Users\\18547995\\Desktop"
		},{
			name: "appName",
			message: "application name: gateway bsp",
			validate: this._validateAppName
		},{
			name: "nmsp",
			message: "application namespace like my.new.custom.app",
			validate: this._validateAppId
		},{
			name: "sourceUri",
			message: "manifest data source uri",
			default: "/sap/opu/odata/sap/CUSTOM_DATA_SRV/",
			when: answers => answers.appType !== AppType.lib,
			validate: this._validateSourceUri
		},{
			name: "entitySet",
			message: "entity set for fiori application",
			when: answers => [AppType.lr, AppType.lrop, AppType.op, AppType.ovp].includes(answers.appType),
			validate: this._validateEmpty,
			default: "TestDataSet"
		}]);
	}

	writing(){
		const {dir, appType, appName, sourceUri = "", nmsp, entitySet} = this._answers;

		const parts = sourceUri.split("/").filter(part => !!part);
		const srvName = parts[parts.length - 1];
		const destPath = this._getDestinationPath(appType, nmsp);

		this.destinationRoot(`${dir}/${appName}`);

		if([AppType.ovp, AppType.plugin].includes(appType)){
			throw new Error("template not realized!")
		}

		this.fs.copyTpl(
			this.templatePath(`${appType}/**/*`),
			this.destinationPath(destPath),
			{
				path: nmsp.split(".").join("/"),
				nmsp: nmsp,
				model: srvName,
				sourceUri: sourceUri,
				appName: appName,
				entitySet: entitySet
			}
		);

		this._updateConfig();
	}

	_getDestinationPath(appType, nmsp){
		if(AppType.lib === appType){
			return path.join("src", ...nmsp.split("."));
		}else{
			return "webapp";
		}
	}

	_updateConfig(){
		const {appType, dir, appName, nmsp} = this._answers;
		const appPath = path.join(dir, appName);
		const {root} = this.options;

		const configJSON = this.fs.readJSON(path.join(root, "config.json"));
		const appConfig = {
			path: appPath,
			transport: "",
			package: "",
			bsp: appName
		};

		let section;
		if(AppType.lib === appType){
			section = "libs";
			appConfig.namespace = nmsp.split(".").join("/");
		}else if(appType.plugin === appType){
			section = "plugins";
		}else{
			section = "apps";
		}

		if(!configJSON[section]){
			configJSON[section] = [];
		}
		configJSON[section].push(appConfig);

		this.fs.writeJSON(path.join(root, "config.json"), configJSON, "\t");
	}

	end(){
		this.log("Application is builded! Restart workspace: grunt dev");
	}
}
