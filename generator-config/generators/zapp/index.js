const Generator = require("yeoman-generator");

module.exports = class extends Generator{

	constructor(args, opts){
		super(args,opts)
	}

	_validateEmpty = input => !!input ? true : "required field!"
	
	/**
	 * sap bsp application name
	 * @param {string} app name
	 * @returns {true|string} if true success check, else error with text
	 */
	_validateAppName(input){
		return /^z\W{3,}/.test(input) ? true : "application name must be /^z\W{3,}/"
	}

	async prompting(){
		this._answers = this.prompt([{
			name: "dir",
			message: "path to application dir",
			validate: this._validateEmpty
		},{
			name: "name",
			message: "application name: gateway bsp",
			validate: this._validateAppName
		},{
			name: "id",
			message: "application id like my.new.super.app",
			validate: this._validateEmpty
		}]);
	}

	
}
