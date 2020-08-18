const Property = require("./Property.js");

class EntityType extends Property{
	constructor(data){
		super();

		this.setSrc(data);

		this.namePath = ["$", "Name"];
		this.labelPath = ["$", "sap:label"];
		this.keyPath = ["Key", 0, "PropertyRef"];
		this.propertyPath = ["Property"];
	}

	/**
	 * entity type keys
	 *
	 * @type       {Array<string>}
	 */
	get key(){
		return this.get(this.keyPath)
			.map(item => item["$"]);
	}

	/**
	 * entity type label
	 *
	 * @type       {string}
	 */
	get label(){
		return this.get(this.labelPath);
	}

	/**
	 * entity type name 
	 *
	 * @type       {string}
	 */
	get name(){
		return this.get(this.namePath);
	}

	/**
	 * entity type properties
	 *
	 * @type       {Array<object>}
	 */
	get properties(){
		return this.get(this.propertyPath)
			.map(item => item["$"]);
	}

	/**
	 * property map: property name -> property object
	 *
	 * @type       {object}
	 */
	get propMap(){
		if(!this._map){
			this._map = {};
			this.properties.forEach(prop => this._map[prop.Name] = prop);
		}

		return this._map;
	}

	/**
	 * Gets the property.
	 *
	 * @param      {string}  name    property name
	 * @return     {object}  The property.
	 */
	getProperty(name){
		return this.propMap[name];
	}

};

module.exports = EntityType;