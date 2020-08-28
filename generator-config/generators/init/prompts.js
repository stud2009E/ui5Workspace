const composeWhens = (...whens) => answers => whens.every(when => when(answers));
const whenInit = answers => answers.init !== false;
const whenLibAdd = answers => answers["lib-add"]
const whenSystemAdd = answers => answers["system-add"]
const whenPluginAdd = answers => answers["plugin-add"]
const whenThemeRootsAdd = answers => answers["themeRoots-add"]
const validateEmpty = input => !!input ? true : "error: required field!";

let prompts = [{
    name: "init",
    message: "config.json already exists! initialize again?",
    type: "confirm"
},{
    name: "sdk",
    message: "path to software development kit",
    validate: validateEmpty,
    when: whenInit
},{
    name: "app-path",
    message: "path to application",
    validate: validateEmpty,
    when: whenInit
},{
    name: "app-transport",
    message: "application transport number",
    default: "fill it later",
    when: whenInit
},{
    name: "app-package",
    message: "application package",
    default: "fill it later",
    when: whenInit
},{
    name: "app-bsp",
    message: "bsp application name",
    default: "fill it later",
    when: whenInit
},{
    name: "app-action",
    message: "application sematic action",
    default: "display",
    validate: validateEmpty,
    when: whenInit
},{
    name: "app-mockModelName",
    message: "server model name to simulate by mockserver",
    when: whenInit
},{
    name: "lib-add",
    message: "add library?",
    type: "confirm",
    when: whenInit
},{
    name: "lib-path",
    message: "path to library",
    validate: validateEmpty,
    when: composeWhens(
        whenLibAdd,
        whenInit
    )
},{
    name: "lib-namespace",
    message: "library namespace  like 'my/lib/to/reuse/code'",
    validate: validateEmpty,
    when: composeWhens(
        whenLibAdd,
        whenInit
    )
},{
    name: "plugin-add",
    message: "add plugin for flp?",
    type: "confirm",
    when: whenInit
},{
    name: "plugin-path",
    message: "path to plugin",
    validate: validateEmpty,
    when: composeWhens(
        whenPluginAdd,
        whenInit
    )
},{
    name: "theme",
    message: "ui theme",
    default: "sap_belize",
    validate: validateEmpty,
    when: whenInit
},{
    name: "themeRoots-add",
    message: "add custom theme roots url",
    type: "confirm",
    when: whenInit
},{
    name: "themeUrl",
    message: "custom theme roots url",
    validate: validateEmpty,
    when: composeWhens(
        whenThemeRootsAdd,
        whenInit
    )
},{
    name: "system-add",
    message: "add remote system to proxy?",
    type: "confirm",
    when: whenInit
},{
    name: "proxyModule",
    message: "choose proxy module for grunt",
    type: "list",
    choices: [{
        name: "use npm module: grunt-connect-proxy",
        value: "npm",
        short: "npm"
    },{
        name: "use module from https://github.com/drewzboto/grunt-connect-proxy.git",
        value: "git",
        short: "git"
    }],
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "system-key",
    message: "set system alias",
    validate: validateEmpty,
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "system-host",
    message: "system host like 'my.odata.service.com'",
    validate: validateEmpty,
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "system-port",
    message: "system port",
    type: "number",
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "system-context",
    message: "redirect request to system if url starts with",
    default: "/sap",
    validate: validateEmpty,
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "system-https",
    message: "system use https",
    type: "list",
    choices: [{
        name: "true",
        value: true
    },{
        name: "false",
        value: false
    }],
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "system-secure",
    message: "system secure",
    type: "list",
    choices: [{
        name: "true",
        value: true
    },{
        name: "false",
        value: false
    }],
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "user-key",
    message: "system user key alias",
    validate: validateEmpty,
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "user-login",
    message: "system user login",
    validate: validateEmpty,
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
},{
    name: "user-pwd",
    message: "system user password",
    validate: validateEmpty,
    when: composeWhens(
        whenInit,
        whenSystemAdd
    )
}];

module.exports = {
    prompts : [...prompts],
    composeWhens,
    whenInit,
    whenLibAdd,
    whenSystemAdd,
    whenPluginAdd,
    whenThemeRootsAdd,
    validateEmpty
}