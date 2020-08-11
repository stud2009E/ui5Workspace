const {Parser} = require("xml2js");
const fs = require("fs-extra");

class MetadataParser{

	constructor(path){
		const root = "edmx:Edmx";
		const services = "edmx:DataServices";
		const schema = "Schema";

		this.shemaPath = [root, services, 0, schema, 0];
		this.entityTypePath = [...this.shemaPath, "EntityType"];
		this.entitySetPath = [...this.shemaPath, "EntityContainer", 0, "EntitySet"];

		this.metadataXML = fs.readFileSync(path, {
			encoding: "utf8"
		});
	}

	async parse(){
		const parser = new Parser();
		this.metadata = await parser.parseStringPromise(this.metadataXML);
	}

	get namespace(){
		const namespacePath = this.shemaPath.concat(["$", "Namespace"]);
		return this.getProperty(namespacePath);
	}

	get entitySets(){
		return this.getProperty(this.entitySetPath)
			.map(set => set["$"]);
	}

	get entityTypes(){
		return this.getProperty(this.entityTypePath);
	}

	getEntity(name){
		const entity = this.entitySets.filter(set => set.Name === name);
		return entity[0];
	}

	getEntityType(name){
		const type = this.entityTypes.filter(type => type["$"].Name === name);
		return type[0];
	}

	getProperty(path){
		let property = this.metadata;
	
		path.forEach(part => {
			property = property[part];
		});

		return property;
	}
};

module.exports = {
	MetadataParser: MetadataParser
};