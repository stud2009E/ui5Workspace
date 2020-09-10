const Generator = require("yeoman-generator");

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
		}]);
	}

	writing(){
		const {dir, appName, sourceUri, nmsp} = this._answers;
		const parts = sourceUri.split("/")
			.filter(part => !!part);
		const modelName = parts[parts.length - 1];

		this.destinationRoot(`${dir}/${appName}`);

		this.fs.copyTpl(
			this.templatePath("./**/*"),
			this.destinationPath("webapp/"),
			{
				path: nmsp.split(".").join("/"),
				nmsp: nmsp,
				model: modelName,
				sourceUri: sourceUri,
				appName: appName
			}
		);
	}

	end(){
		this.log("Application is builded! Restart workspace: grunt dev");
	}
}
