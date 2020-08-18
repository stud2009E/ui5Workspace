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
	grunt.registerTask("excelMaket", "private: build excel from metadata.xml", function(){
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
					// if(column.name){

					// }
					return data[column.name]
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
