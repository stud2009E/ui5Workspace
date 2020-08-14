const configTemplate = `config.json structure:
	{
		sdk: path-to-sdk,
		apps: [
			{
				path: path-to-application,
				[transport]: transport request number,
				[package]: package for application,
				[action]: semantic object action,
				[mockModelName]: model for mockserver
			},
			...
		],
		[libs]: [
			{
				namespace: library-namespace,
 				path: path-to-library
			},
			...
		],
		[plugin]: [
			{
				path: path-to-plugin
			},
			...
		],
		[theme]: theme-name = sap_belize,
		[themeRoots]: {
			[theme-name] : url-to-theme,
			...
		},
		[systemDefault]: system-key-1,
		[userDefault]: user-key-1,
		[proxyModule] : npm|git = git,
		[system]: {
			system-key-1: {
				host: server-host,
				port: server-port,
				[context]: context = /sap,
				[secure]: true|false = false,
				[https]: true|false = true,
				user: {
					user-key-1: {
						login: system login,
						pwd: system password
					},
					...
				}
			},
			...
		}
	}`;

module.exports = {
	localhost: "localhost",
	port: 8000,
	theme: "sap_belize",
	configTemplate: configTemplate
};