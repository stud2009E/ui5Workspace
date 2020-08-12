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

};

module.exports = EntityType;