const path = require("path");
const fs = require("fs-extra");
const Generator = require("yeoman-generator");
const MetadataParser = require("../../../utils/metadata/MetadataParser.js");

const ChangeType = {
    property: "propertyChange",
    move: "moveControls",
    column: "columnWidthChange",
    binding: "propertyBindingChange"
};

module.exports = class extends Generator{

    _getAppId(appPath){
        const manifestPath = path.join(appPath, "webapp", "manifest.json");
        const manifest = fs.readJsonSync(manifestPath);
        
        return manifest["sap.app"] && manifest["sap.app"]["id"];
    }

    _getApps(){
        const appDirPath = path.join(process.cwd(), "workspace", "apps");
        let apps = fs.readdirSync(appDirPath);
        return apps.map(app => ({
            name: app,
            value: fs.realpathSync(path.join(appDirPath, app))
        }));
    }

    async _getEntityTypes(appPath){
        const metadataPath = path.join(appPath, "webapp", "localService", "metadata.xml");
        this._parser = new MetadataParser(metadataPath);

        try{
            await this._parser.parse();
        }catch(e){
            throw new Error("metadata parse error");
        }
        
        return this._parser.entityTypes.map(entityType => ({
            name: `${entityType.name} - ${entityType.label}` ,
            value: entityType.name
        }));
    }

    _getEntityTypeProperties(entityTypeName){
        if(!this._parser){
            throw new Error("can't find parser");
        }
        const entityType = this._parser.getEntityType(entityTypeName);

        return entityType.properties;
    }

    async prompting(){
        const commonPrompt0 = await this.prompt([
            {
                name: "changeType",
                type: "list",
                message: "select change template",
                choices: [{
                    name: "property change",
                    value: ChangeType.property
                },{
                    name: "property binding change",
                    value: ChangeType.binding
                },{
                    name: "move change",
                    value: ChangeType.move
                },{
                    name: "changes for table columns" ,
                    value: ChangeType.column
                }]
            },
            {
                name: "appPath",
                type: "list",
                message: "application name",
                choices: this._getApps()
            }
        ]);
        const {appPath, changeType} = commonPrompt0;


        const columnPrompt = await this.prompt([
            {
                name: "entityType",
                message: "select entityType (used by table)",
                type: "list",
                when: () => changeType === ChangeType.column,
                choices: await this._getEntityTypes(appPath)
            },
            {
                name: "commonColumnId",
                message: "input common id part (<common id>-<prop name>)",
                default: "common-column-part",
                when: () => changeType === ChangeType.column,
                validate: input => (!!input && input.length ) > 5 ? true : "required field! length > 5"
            }
        ]);

        const commonPrompt1 = await this.prompt([
            {
                name: "fileName",
                message: "input change file name",
                when: () => changeType !== ChangeType.column,
                default: `id_${new Date().getMilliseconds()}_${changeType}`,
                validate: input => (!!input && input.length ) > 5 ? true : "required field! length > 5"
            }
        ]);
        
        this._answers = Object.assign({}, commonPrompt0, commonPrompt1, columnPrompt);
    }

    writing(){
        const {changeType, appPath} = this._answers;
        this.destinationRoot(path.join(appPath, "webapp", "changes"));

        if(changeType === ChangeType.column){
            this._columnsChange();
        }else{
            this._commonChangeHandle()
        }
    }


    _commonChangeHandle(){
        const {changeType, fileName, appPath} = this._answers;
        const appId = this._getAppId(appPath);

        if(!appId){
            throw new Error("can't get application id");
        }

        this.fs.copyTpl(
			this.templatePath(`template/${changeType}.change`),
			this.destinationPath(`${fileName}.change`),
			{
				appId: appId,
                fileName: fileName,
                creationDate: new Date().toISOString()
			}
		);
    }

    _columnsChange(){
        const {changeType, appPath, commonColumnId, entityType} = this._answers;
        const appId = this._getAppId(appPath);
        const fileName = `id_${entityType}`;

        if(!appId){
            throw new Error("can't get application id");
        }

        const properties = this._getEntityTypeProperties(entityType);
        if(!(Array.isArray(properties) && properties.length > 0)){
            throw new Error("can't parse properties from entityType");
        }

        properties.forEach(property => {

            this.fs.copyTpl(
                this.templatePath(`${changeType}.change`),
                this.destinationPath(`${fileName}-${property.Name}.change`),
                {
                    appId: appId,
                    fileName: `${fileName}-${property.Name}`,
                    columnId: `${commonColumnId}-${property.Name}`,
                    columnWidth: "10rem",
                    creationDate: new Date().toISOString()
                }
            );
        });
    }

    end(){
        this.log("end");
    }
}