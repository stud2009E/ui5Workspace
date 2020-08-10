const path = require("path");
const configJson = require("../config.json");
const defaults = require("./defaults.js");

class SettingContainer {

	constructor(config) {
		this._sdk = null;
		this._apps = [];
		this._libs = [];
		this._plugins = [];
		this._system = null;
		this._port = null;
		this._theme = null;

		this.setPort(config);
		this.setTheme(config);
		this.setSdk(config);
		this.setApps(config);
		this.setLibs(config);
		this.setPlugins(config);
		this.setTheme(config);

		this.setDefaultKeys(config);

		this._system = config.system;
	}

	/**
	 * if no system, then used local development
	 *
	 * @type       {boolean}
	 */
	get isLocalDev(){
		return !this._system;
	}

	/**
	 * Sets the port.
	 *
	 * @param      {Object}  config
	 * @param      {number}  config.port  localhost port
	 */
	setPort({port}){
		this._port = port || defaults.port;
	}

	/**
	 * get loclahost port
	 *
	 * @type       {number}
	 */
	get port(){
		return this._port;
	}

	/**
	 * Sets the theme.
	 *
	 * @param      {Object}  config
	 * @param      {string}  [config.theme="sap_belize"]  The theme
	 */
	setTheme({theme}){
		this._theme = theme || defaults.theme;
	}

	/**
	 * get theme name or url
	 *
	 * @type       {string}
	 */
	get theme(){
		return this._theme;
	}

	/**
	 * Sets the sdk.
	 *
	 * @param      {Object}  config
	 * @param      {string}  config.sdk  path to sdk folder
	 */
	setSdk({sdk}){
		if(typeof sdk !== "string" || sdk.length === 0){
			this.throwErrorShowConfig("can't parse path to sofware development kit");
		}
		this._sdk = sdk;
	}

	/**
	 * get sdk resources path
	 *
	 * @type       {string}
	 */
	get resources(){
		return path.join(this._sdk, "resources");
	}

	/**
	 * get sdk testresources path
	 *
	 * @type       {string}
	 */
	get testresources(){
		return path.join(this._sdk, "test-resources");
	}

	/**
	 * Sets the apps.
	 *
	 * @param      {Object}  config 	
	 * @param      {Array}  config.apps  application settings
	 * @throws restrictions for fiori launchpad functionality 
	 */
	setApps({apps}){
		this._validateArrayByProperty("application", apps, ["path"]);

		apps.forEach(app => {
			const appName = this.lastPathPart(app.path);

			if(/\W/.test(appName)){
				this.throwErrorShowConfig(
					`invalid characters in ${appName}! use only [a-zA-Z0-9_]`,
					true
				);
			}

		});

		this._apps = apps;
	}

	/**
	 * get application settings as array
	 *
	 * @type       {array}
	 */
	get apps(){
		return this._apps.map(app => {
			let name = this.lastPathPart(app.path);

			return {...app, name};
		});
	}

	/**
	 * get application setiing as object
	 *
	 * @type       {object}
	 */
	get appInfo(){
		const appInfo = {};

		this.apps.forEach(app => {
			let name = this.lastPathPart(app.path);

			appInfo[name] = {...app};
		});

		return appInfo;
	}

	/**
	 * Sets the libs.
	 *
	 * @param      {Object}  config
	 * @param      {Array}  config.libs  The libs
	 */
	setLibs({libs}){
		if(libs === undefined){
			this._libs = [];
			return;
		}

		this._validateArrayByProperty("library", libs, ["path", "namespace"]);

		this._libs = libs;
	}


	/**
	 * get libraries
	 *
	 * @type       {Array}
	 */
	get libs(){
		return this._libs.map(lib => {
			const name = this.lastPathPart(lib.path);

			return {
				...lib,
				context:`/sap/bc/ui5_ui5/sap/${name}/`
			};
		});
	}


	/**
	 * Gets the sap proxies.
	 *
	 * @param      {string}  systemKey  The system key
	 * @param      {string}  userKey    The user key
	 * @return     {Array}   The sap proxies.
	 */
	getSystemProxies(systemKey, userKey){
		const system = this.getSystem(systemKey);
		const user = this.getUser(systemKey, userKey);
		const ident = Buffer.from(`${user.login}:${user.pwd}`).toString("base64");

		if(!system){
			return [];
		}

		return [{
            context: "/sap/",
            host: system.host,
            port: system.port,
            secure: false,
            https: true,
            headers: {
                Authorization: `Basic ${ident}`
            }
        }];
	}

	/**
	 * Sets the plugins.
	 *
	 * @param      {Object}  config
	 * @param      {Array}  config.plugins  The plugins
	 */
	setPlugins({plugins}){
		if(plugins === undefined){
			this._plugins = [];
			return;
		}

		this._validateArrayByProperty("plugins", plugins, ["path"]);

		this._plugins = plugins;
	}

	/**
	 * get plugins settings
	 *
	 * @type       {array}
	 */
	get plugins(){
		return this._plugins.map(plugin => {
			let name = this.lastPathPart(plugin.path);

			return {...plugin, name};
		});
	}

	/**
	 * Sets the default keys for system and user.
	 *
	 * @param      {Object}  config
	 * @param      {string}  config.systemDefault  The system default
	 * @param      {string}  config.userDefault    The user default
	 */
	setDefaultKeys({systemDefault, userDefault}){
		this._systemDefaultKey = systemDefault;
		this._userDefaultKey = userDefault;
	}

	/**
	 * system default key
	 *
	 * @type       {string}
	 */
	get systemDefaultKey(){
		return this._systemDefaultKey;
	}

	/**
	 * default user key
	 *
	 * @type       {string}
	 */
	get userDefaultKey(){
		return this._userDefaultKey;
	}

	/**
	 * Gets the user.
	 *
	 * @param      {string}  systemKey  The system key
	 * @param      {string}  userKey    The user key
	 * @return     {object}  The user.
	 */
	getUser(systemKey, userKey){
		const system = this.getSystem(systemKey);
		const user = system.user && system.user[userKey];

		if(!user){
			this.throwErrorShowConfig(`can't find user: '${userKey}' for system: '${systemKey}' from config`);
		}

		if(!user.login || !user.pwd){
			this.throwErrorShowConfig(`user require fields: login, pwd`);
		}

		return user;
	}


	/**
	 * Gets the system.
	 *
	 * @param      {sting}  key - system key
	 * @return     {object}  system info.
	 */
	getSystem(key){
		const system = this._system && this._system[key];
		if(!system){
			this.throwErrorShowConfig(`can't find system: '${key}' from config`);
		}

		if(!system.host || !system.port){
			this.throwErrorShowConfig(`system require fields: host, port`);
		}

		return system;
	}


	/**
	 * throw error and log in console config template
	 *
	 * @param      {string}  message        error message
	 * @param      {boolean}  bHideTemplate  hide template
	 * @throws
	 */
	throwErrorShowConfig(message, bHideTemplate){
		if(!bHideTemplate){
			console.error(defaults.configTemplate);
		}
		throw new Error(message);
	}

	/**
	 * get subdir name
	 *
	 * @param      {string}  src     path to folder
	 * @return     {string}  subdir name
	 */
	lastPathPart(src){
		let parts = src.split(path.sep);
		return parts[parts.length - 1]; 
	}

	/**
	 * check array item has proprty
	 *
	 * @param      {string}  checkName  The check name
	 * @param      {Array<object>}  items      The items
	 * @param      {Array<strings>}  keys       The keys
	 */
	_validateArrayByProperty(checkName, items, keys){

		if(!Array.isArray(items) || items.length === 0){
			this.throwErrorShowConfig();
		}

		items.forEach(item => {
			keys.forEach(key => {
				if(!item.hasOwnProperty(key)){
					this.throwErrorShowConfig(
						`can't parse ${checkName} settings: require ${key} property`
					);
				}
			});

		});
	}
}

module.exports = new SettingContainer(configJson);
