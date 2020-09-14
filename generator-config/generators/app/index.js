const Generator = require("yeoman-generator");

const EntityType = {
	z: "custom app",
	ovp: "overview page",
	op: "object page",
	lr: "list report",
	lrop: "list report - object page",
	lib: "custom library"
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
			message: "select application template",
			choices: [{
				name: "custom application",
				value: EntityType.z
			},{
				name: "overview page",
				value: EntityType.ovp
			},{
				name: "object page",
				value: EntityType.op
			},{
				name: "list report",
				value: EntityType.lr
			},{
				name: "list report - object page",
				value: EntityType.lrop
			},{
				name: "library",
				value: EntityType.lib
			}]
		},{
			name: "dir",
			message: "path to application dir",
			validate: this._validateEmpty
		},{
			name: "appName",
			message: "application name: gateway bsp",
			validate: this._validateAppName
		},{
			name: "nmsp",
			message: "application id like my.new.custom.app",
			validate: this._validateAppId
		},{
			name: "sourceUri",
			message: "manifest data source uri",
			default: "/sap/opu/odata/sap/CUSTOM_DATA_SRV/",
			validate: this._validateSourceUri
		},{
			name: "entitySet",
			message: "entity set for fiori application",
			when: answers => [EntityType.lr, EntityType.lrop, EntityType.op, EntityType.ovp].contains(answers.appType),
			validate: this._validateEmpty
		}]);
	}

	writing(){
		const {dir, appType, appName} = this._answers;

		this.destinationRoot(`${dir}/${appName}`);

		if([EntityType.lr, EntityType.lrop, EntityType.op, EntityType.ovp, EntityType.lib].includes(appType)){
			throw new Error("template not realized!")
		}

		switch (appType) {
			case "zapp":
				this._copyAppTemplate();
				break;
			default:
				break;
		}
	}

	_copyAppTemplate(answers){
		const {appType, appName, sourceUri, nmsp, entitySet} = answers;
		const parts = sourceUri.split("/")
			.filter(part => !!part);
		const srvName = parts[parts.length - 1];

		this.fs.copyTpl(
			this.templatePath(`${appType}/**/*`),
			this.destinationPath("webapp"),
			{
				path: nmsp.split(".").join("/"),
				nmsp: nmsp,
				model: srvName,
				sourceUri: sourceUri,
				appName: appName,
				entitySet: entitySet
			}
		);
	}

	end(){
		this.log("Application is builded! Restart workspace: grunt dev");
	}
}
