const path = require("path");
const configJson = require("../config.json");
const defaults = require("./defaults.js");

class SettingContainer {

	constructor(config) {

		const props = [
			"port", "sdk", "apps", "libs", "plugins",
			"proxyModule", "defaultKeys", "system",
			"theme"
		];

		props.forEach(prop => this[prop] = config);
	}

	/**
	 * if no system, then local development is used
	 *
	 * @type       {boolean}
	 */
	get isLocalDev(){
		return !this.system;
	}

	/**
	 * set system settings @see ./defaults.js
	 * 
	 * @param      {Object}  config
	 * @param      {string}  config.system
	 * @type       {object}
	 */
	set system({system}){
		this._system = system;
	}


	/**
	 * get system settings @see ./defaults.js
	 * 
	 * @type       {object}
	 */
	get system(){
		return this._system;
	}

	/**
	 * Sets the port.
	 *
	 * @param      {Object}  config
	 * @param      {number}  config.port  localhost port
	 * @type       {number}
	 */
	set port({port}){
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
	 * which proxy module use:
	 * if npm then grunt-connect-proxy
	 * if git then https://github.com/drewzboto/grunt-connect-proxy.git
	 * 
	 * @param      {Object} config
	 * @param      {string} config.proxyModule
	 * 
	 * @type       {string}
	 */
	set proxyModule({proxyModule = "git"}){
		if(!["git", "npm"].includes(proxyModule)){
			this.throwErrorShowConfig("error: proxyModule must be git|npm", true);
		}

		this._proxyModule = proxyModule;
	}

	/**
	 * get proxy module
	 *
	 * @type       {string}
	 */
	get proxyModule(){
		return this._proxyModule;
	}

	/**
	 * Sets the theme.
	 *
	 * @param      {Object}  config
	 * @param      {string}  [config.theme="sap_belize"]  The theme
	 */
	set theme({theme = defaults.theme, themeRoots = {}}){
		this._theme = theme;
		this._themeRoots = themeRoots;
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
	 * map theme-path
	 *
	 * @type       {Object}
	 */
	get themeRoots(){
		return this._themeRoots;
	}

	/**
	 * Sets the sdk.
	 *
	 * @param      {Object}  config
	 * @param      {string}  config.sdk  path to sdk folder
	 */
	set sdk({sdk}){
		if(typeof sdk !== "string" || sdk.length === 0){
			this.throwErrorShowConfig("error: require path to sofware development kit");
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
	 * @throws 	   application name restrictions for fiori launchpad functionality 
	 */
	set apps({apps}){
		this.validateArrayByProperty("application", apps, ["path"]);

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
	 * get library setting as object
	 * 
	 * @type {object}
	 */
	get libInfo(){
		const libInfo = {};

		this.libs.forEach(lib => {
			let name = this.lastPathPart(lib.path);

			libInfo[name] = {...lib};
		});

		return libInfo;
	}

	/**
	 * Sets the libs.
	 *
	 * @param      {Object}  config
	 * @param      {Array}  config.libs  The libs
	 */
	set libs({libs}){
		if(libs === undefined){
			this._libs = [];
			return;
		}

		this.validateArrayByProperty("library", libs, ["path", "namespace"]);

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
				name,
				context:`/sap/bc/ui5_ui5/sap/${name}`
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

		const { host, port, context = "/sap", secure = false, https = true} = system;

		const proxy =  [{
			context, host, port, secure, https,
            headers: {
                Authorization: `Basic ${ident}`
            }
        }];

        return proxy;
	}

	/**
	 * Sets the plugins.
	 *
	 * @param      {Object}  config
	 * @param      {Array}  config.plugins  The plugins
	 */
	set plugins({plugins}){
		if(plugins === undefined){
			this._plugins = [];
			return;
		}

		this.validateArrayByProperty("plugins", plugins, ["path"]);

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
	set defaultKeys({systemDefault, userDefault}){
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
		const system = this.system && this.system[key];
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
	validateArrayByProperty(checkName, items, keys){

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
