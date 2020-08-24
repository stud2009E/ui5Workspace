const config = require("../utils/ConfigContainer.js");
const MetadataParser = require("../utils/metadata/MetadataParser.js");
const exceljs = require("exceljs");
const moment = require("moment");
const path = require("path");
const fs = require("fs-extra");

module.exports = function(grunt){

	grunt.registerTask("excelMaket", "build excel from metadata.xml", function(){
		const done = this.async();
		const appName = grunt.option("app");
		const {appInfo} = config;

		if(!appName){
			grunt.fail.fatal("error: require app name to build metadata.xslx");
		}

		if(appName && !appInfo[appName]){
			grunt.fail.fatal(`error: no app with name ${appName} exist`);
		}

		const appPath = appInfo[appName].path;
		const localServicePath = path.join(appPath, "webapp", "localService")
		const metadataPath = path.join(localServicePath, "metadata.xml");
		const xlsxPath = path.join(localServicePath, "metadata.xlsx");
		const mockDataPath = path.join(localServicePath, "mockdata");

		(async () => {
			let parser = new MetadataParser(metadataPath);
			await parser.parse();

			const workbook = new exceljs.Workbook();

			parser.entitySets.forEach(set => {
				const ws = workbook.addWorksheet(set.Name);
				const type = parser.getEntityType(set.typeName);

				let currentData = [];
				try{
					currentData = fs.readJsonSync(path.join(mockDataPath, `${set.Name}.json`));
				}catch(e){
					grunt.log.writeln(`${set.Name}.json not exists`);
				}

				let keyColumns = [];
				let otherColumns = [];
				type.properties.forEach(property => {
					const item = {
						name: property.Name,
						header: property.Name,
						key: property.Name,
						width: 20,
						type: property.Type
					};

					if(type.key.some(key => key.Name === property.Name)){
						keyColumns.push(item);
					}else{
						otherColumns.push(item);
					}
				});

				const columns = [...keyColumns, ...otherColumns];
				const rows = currentData.map(data => columns.map(column => {
					const value = data[column.name];

					return transform2xls(column.Type, value);
				}));

				if(rows.length === 0){
					rows.push([]);
				}

				ws.addTable({
					name: set.Name,
					ref: "A1",
					headerRow: true,
					columns: columns,
					rows: rows
				});

				ws.columns = columns;
			});

			await workbook.xlsx.writeFile(xlsxPath);

			done();
		})();
	});
};


/**
 * tranform value by type to xlsx
 * @param {any} 	value  value
 * @param {string}	type 
 */
function transform2xls(type, value){
	let transform = value;
	
	switch(type){
		case "Edm.DateTime":
			transform = moment(value).format("DD.MM.YYYY hh:mm:ss");
			break;
		case "Edm.Time":
			transform = transform
				.split(/\D/)
				.filter(part => !!part)
				.join(":")
			break;
	}

	return transform;
}
