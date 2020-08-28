const config = require("../utils/ConfigContainer.js");
const MetadataParser = require("../utils/metadata/MetadataParser.js");
const exceljs = require("exceljs");
const path = require("path");
const moment = require("moment");
const {LoremIpsum} = require("lorem-ipsum");
const fs = require("fs-extra");
const { v4: uuidv4 } = require('uuid');

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

				const entity = parser.getEntity(ws.name);
				const entityType = parser.getEntityType(entity.typeName);

				ws.eachRow((row, i) => {
					//skip header row
					if(i === 1) return;

					const item = {};

					table.columns.forEach((column, k) => {
						const cell = row.getCell(k + 1);
						const property = entityType.getProperty(column.name);

						item[column.name] = transform2json({
							grunt: grunt,
							entitySet: ws.name,
							type: property.Type,
							value: cell.value
						});
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

const lorem = new LoremIpsum({
	sentencesPerParagraph:{
		max: 2,
		min: 1
	},
	wordsPerSentence: {
		max: 4,
		min: 2
	}
});

/**
 * transform value by type
 * if value is incompatible to type, it will be generate
 * @param {object} param0 setting
 * @param {object} param0.grunt - task runner
 * @param {string} param0.entitySet - entity set name
 * @param {string} param0.type  - type for validate Edm.
 * @param {any} param0.value - value for validate 
 * 
 * @returns {any} parsed value for json 
 */ 
function transform2json({grunt, entitySet, type, value}){
	const errorMessage = `parse error: in set:'${entitySet}' value:'${value}' can't be type:'${type}'. Will be replaced!`;
	let transform = value;
	
	switch(type){
		case "Edm.Guid":
			const regguid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
			if(!regguid.test(transform)){
				grunt.log.error(errorMessage);
				transform = uuidv4();
			}
			break;
		case "Edm.DateTime":
			//15.12.2020  14:23:55
			const regdt = /^([0-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}[\s\t]+([01]\d|2[0-3])(:[0-5]\d){2}$/i;
			//15.12.2020
			const regd = /^([0-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
			if(!(regdt.test(value) || regd.test(value))){
				grunt.log.error(errorMessage);
				transform = moment().valueOf();
			}else{
				transform = moment(value, "DD.MM.YYYY hh:mm:ss").valueOf();
			}
			transform = `\/Date(${transform})\/`;
			break;
		case "Edm.Time":
			let hh, mm, ss;
			const regt = /^([01]\d|2[0-3])(:[0-5]\d){2}$/i;
			if(regt.test(transform)){
				[hh, mm, ss] = transform.split(/:/);
			}else{
				grunt.log.error(errorMessage);
			}
			hh = hh || "23";
			mm = mm || "59";
			ss = ss || "59";

			transform = `PT${hh}H${mm}M${ss}S`;
			break;
		case "Edm.String":
			if(!transform){
				transform = lorem.generateSentences();
			}
			break;
		case "Edm.Int":
		case "Edm.Int16":
		case "Edm.Int32":
		case "Edm.Int64":
			if(isNaN(parseInt(transform))){
				grunt.log.error(errorMessage);
				transform = Math.random() * 1000;
			}
			transform = parseInt(transform);
			break;
		case "Edm.Double":
		case "Edm.Decimal":
			if(transform && transform.replace){
				transform = transform.replace(",", ".");
			}
			if(isNaN(parseFloat(transform))){
				grunt.log.error(errorMessage);
				transform = Math.random() * 1000;
			}
			transform = parseFloat(transform);
			break;
		case "Edm.Boolean":
			transform = !!transform;
			break;
	}

	return transform;
}