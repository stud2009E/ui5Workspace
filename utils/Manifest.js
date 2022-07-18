const objectPath = require("object-path"); 
const path = require("path");
const fs = require("fs-extra");

module.exports = class Manifest{

	constructor(appPath){
		this._manifest = fs.readJSONSync(path.join(appPath, "manifest.json"), {
			encoding: "utf8"
		});
		
		this._wrapper = objectPath(this._manifest);
	}

	id(){
		return this.get(["sap.app", "id"]);
	}

	type(){
		return this.get(["sap.app", "type"]);
	}

	dataSource(modelName = ""){
		return this.get(["sap.ui5", "models", modelName, "dataSource"]);
	}
	
	serviceUrl(modelName = ""){
		const source = this.dataSource(modelName);
		
		return this.get(["sap.app", "dataSources", source, "uri"]) ;
	}

	get(){
		return this._wrapper.get.apply(this._wrapper, arguments);
	}
}