const config = require("../utils/ConfigContainer.js");
const MetadataParser = require("../utils/metadata/MetadataParser.js");
const exceljs = require("exceljs");
const path = require("path");
const moment = require("moment");
const fs = require("fs-extra");

module.exports = function(grunt){

	grunt.registerTask("excel2json", "build jsons from metadata.xlsx", function(){
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
			await workbook.xlsx.readFile(xlsxPath);

			const tableData = {};

			workbook.eachSheet(ws => {
				const table = ws.getTable(ws.name).table;
				const entitySet = [];

				const entity = parser.entitySets[ws.name];
				const entityType = parser.getEntityType(entity.typeName);

				ws.eachRow((row, i) => {
					//skip header row
					if(i === 0) return;

					const item = {};

					table.columns.forEach((column, k) => {
						const cell = row.getCell(k + 1);
						const property = entityType.getProperty(column.name);

						validateXLSValue({
							grunt: grunt,
							entitySet: ws.name,
							type: property.Type,
							value: cell.value
						});

						item[column.name] = transform2json(cell.value);
					});

					entitySet.push(item);
				});

				
				tableData[ws.name] = entitySet;
			});


			Object.keys(tableData).map(key => {
				const fileName = path.join(mockDataPath, `${key}.json`);

				fs.writeJsonSync(fileName, tableData[key], {
					spaces: "\t"
				});
			});

			done();
		})();
	});
};

/**
 * tranform value by type
 * @param {any} 	value  value
 * @param {string}	type 
 * 
 * @returns {any}	transformed value
 */
function transform2json(type, value){
	let transform = value;
	
	switch(type){
		case "Edm.DateTime":
			transform = moment(value, "DD.MM.YYYY hh:mm:ss").toDate();
			break;
		case "Edm.Time":
			const [hh, mm, ss] = transform.split(/:/);
			transform = `PT${hh}H${mm}M${ss}S`;
			break;
	}

	return transform;
}

/**
 * validate value by type
 * @param {object} param0 setting
 * @param {object} param0.grunt - task runner
 * @param {string} param0.entitySet - entity set name
 * @param {string} param0.type  - type for validate Edm.
 * @param {any} param0.value - value for validate 
 * 
 * @throws 
 */ 
function validateXLSValue({grunt, entitySet, type, value}){
	const errorMessage = `parse error: in entity set:${entitySet} value:${value} can't be type: ${type}`;
	
	switch(type){
		case "Edm.Guid":
			const regguid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
			if(!regguid.test(value)){
				grunt.fail.fatal(errorMessage);
			}
			break;
		case "Edm.Decimal":
		case "Edm.Float":
		case "Edm.Double":
		case "Edm.Int16":
		case "Edm.Int32":
		case "Edm.Int64":
			if(isNaN(value)){
				grunt.fail.fatal(errorMessage);
			}
			break;
		case "Edm.Byte":
			if(isNaN(value) && value >= 0 && value < 8){
				grunt.fail.fatal(errorMessage);
			}
			break;
		case "Edm.DateTime":
			//15.12.2020  14:23:55
			const regdt = /^([0-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}[\s\t]+([01]\d|2[0-3])(:[0-5]\d){2}$/i;
			//15.12.2020
			const regd = /^([0-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
			if(!(regdt.test(value) || regd.test(value))){
				grunt.fail.fatal(errorMessage);
			}
			break;
		case "Edm.Time":
			//14:23:55
			const regt = /([01]\d|2[0-3])(:[0-5]\d){2}/i;
			if(!regt.test(value)){
				grunt.fail.fatal(errorMessage);
			} 
			break;
		case "Edm.Boolean":
			if(value !== true || value !== false){
				grunt.fail.fatal(errorMessage);
			}
			break;
	}
}