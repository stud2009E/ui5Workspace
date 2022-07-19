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
		const name = this.dataSource(modelName);
		
		return this.dataSourceUri(name);
	}

    dataSourceUri(name = "remote"){
		return this.get(["sap.app", "dataSources", name, "uri"]);
	}

	get(){
		return this._wrapper.get.apply(this._wrapper, arguments);
	}
}