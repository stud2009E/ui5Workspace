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
	grunt.registerTask("excel2json", "build excel from service metadata", function(){
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
