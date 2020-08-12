class Property{
	/**
	 * Sets the source.
	 *
	 * @param      {object}  data
	 */
	setSrc(data){
		this._src = data;
	}

	/**
	 * Gets the property from src object
	 *
	 * @param      {Array<string>}  path
	 * @return     {object}         property value
	 */
	get(path){
		let property = this._src;
		
		try{
			path.forEach(part => {
				property = property[part];
			});
		}catch(e){
			console.log(e);
			property = null;
		}
		
		return property;
	}
}

module.exports = Property;