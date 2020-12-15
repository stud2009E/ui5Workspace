const path = require("path");
const fs = require("fs");
const Generator = require("yeoman-generator");
const MetadataParser = require("../../../utils/metadata/MetadataParser.js");

const ChangeType = {
    property: "property",
    move: "move",
    column: "column"
};

module.exports = class extends Generator{

    _getAppId(appPath){
        //get id from manifest
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
        const commonPrompt = await this.prompt([
            {
                name: "changeType",
                type: "list",
                message: "select change template",
                choices: [{
                    name: "property change",
                    value: ChangeType.property
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
        const {appPath, changeType} = commonPrompt;


        const columnPrompt = await this.prompt([
            {
                name: "entityType",
                message: "select entityType (used by table)",
                type: "list",
                when: () => changeType === ChangeType.column,
                choices: await this._getEntityTypes(appPath)
            },
            {
                name: "tableId",
                message: "input table id (<column id> = <table id>-<prop name>)",
                default: "default-table-id",
                when: () => changeType === ChangeType.column,
                validate: input => !!input ? true : "required field!"
            }
        ]);

        const movePropmpt = await this.prompt([
            {
                name: "fileName",
                message: "input change file name",
                default: ""
            }
        ])
        
        this._answers = Object.assign({}, commonPrompt, columnPrompt);
    }

    writing(){
        const {changeType, appPath, entityType} = this._answers;

        const properites = this._getEntityTypeProperties(entityType);
        

        this.log(
            properites.map(
                property => `${property.Name} \t-\t ${property["sap:label"]}`
            ).join('\n')
        );
    }

    end(){
        this.log("end");
    }
}