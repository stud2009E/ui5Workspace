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
	grunt.registerTask("excelMaket", "build excel from service metadata", function(){
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

			parser.entitySets.forEach(set => {
				const ws = workbook.addWorksheet(set.Name);
				const type = parser.getEntityType(set.typeName);

				let currentData = [];
				try{
					currentData = fs.readJsonSync(path.join(mockDataPath, `${set.Name}.json`));
				}catch(e){
					grunt.log.writeln(`${set.Name}.json not exists`);
				}

				const columns = type.properties.map(property => {
					return {
						name: property.Name,
						header: property.Name,
						key: property.Name,
						width: 20
					};
				});

				const rows = currentData.map(data => columns.map(column => data[column.key]));

				if(rows.length === 0){
					rows.push([]);
				}

				ws.addTable({
					name: set.Name,
					ref: "A1",
					headerRow: true,
					style: {
						theme: 'TableStyleLight10',
						showRowStripes: true,
					},
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
