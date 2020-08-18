const MetadataParser = require("../utils/metadata/MetadataParser.js");
const exceljs = require("exceljs");
const path = require("path");
const fs = require("fs-extra");

module.exports = function(grunt){

	/* 
	 * TODO 
	 * type restrictions: date, numbers, booleans
	 * column: string maxlength, labels
	*/
	grunt.registerTask("excel2json", "private: build jsons from metadata.xlsx", function(){
		grunt.task.requires("shellConfigCollect");

		const done = this.async();
		const cwd = process.cwd();
		const appName = grunt.option("app");
		const appInfo = grunt.config.get("appInfo");

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

				ws.eachRow(row => {
					const item = {};

					table.columns.forEach((column, i) => {
						const cell = row.getCell(i + 1);

						item[column.name] = cell.value;
					});

					entitySet.push(item);
				});

				//skip header row
				tableData[ws.name] = entitySet.slice(1);
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


function validateValue({grunt, entitySet, type, value}){
	const errorMessage = `parse error: in entity set:${entitySet} value:${value} can't be type: ${type}`;

	switch(type){
		case "Edm.Guid":
			const reguid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

			if(!regexp.test(value)){
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
			const redt = /^([0-2]\d|3[01])\.(0[1-9]|1[0-2])\.\d{4}\s\s([01]\d|2[0-3])(:[0-5]\d){2}/i;
			if(!redt.test(value)){
				grunt.fail.fatal(errorMessage);
			}
			break;
		case "Edm.Time":
			//14:23:55
			const ret = /([01]\d|2[0-3])(:[0-5]\d){2}/i;
			if(!redt.test(value)){
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