const {Parser} = require("xml2js");
const fs = require("fs-extra");
const Property = require("./Property.js");
const EntityType = require("./EntityType.js");

class MetadataParser extends Property{

	constructor(path){
		super();

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

	/**
	 * parse xml to js
	 *
	 * @return     {Promise}  result of parsing
	 */
	async parse(){
		const parser = new Parser();
		const src = await parser.parseStringPromise(this.metadataXML);
		
		this.setSrc(src);
	}

	/**
	 * schema namespace 
	 *
	 * @type       {string}
	 */
	get namespace(){
		const namespacePath = this.shemaPath.concat(["$", "Namespace"]);

		return this.get(namespacePath);
	}

	/**
	 * entity sets
	 *
	 * @type       {Array<object>}
	 */
	get entitySets(){
		if(!this._entitySets){
			this._entitySets = this.get(this.entitySetPath)
				.map(set => {
					const item = Object.assign(set["$"]);
					const {EntityType} = item;
					item.typeName = EntityType.replace(`${this.namespace}.`, "");

					return item;
				});
		}

		return this._entitySets;
	}

	/**
	 * entity types
	 *
	 * @type       {Array<object>}
	 */
	get entityTypes(){
		if(!this._entityTypes){
			this._entityTypes = this.get(this.entityTypePath)
				.map(data => new EntityType(data));
		}
		return this._entityTypes;
	}

	/**
	 * Gets the entity.
	 *
	 * @param      {string}  name    entity name
	 * @return     {object}  entity
	 */
	getEntity(name){
		const entity = this.entitySets.filter(set => set.Name === name);
		return entity[0];
	}

	/**
	 * Gets the entity type.
	 *
	 * @param      {string}  name    type name
	 * @return     {object}  entity type
	 */
	getEntityType(name){
		const type = this.entityTypes.filter(type => type.name === name);
		return type[0];
	}
};

module.exports = MetadataParser;