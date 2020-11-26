### Окружение требует следующую структуру приложения:
```
.
└──webapp
	├──controller
	├──view
	├──fragments
	├──i18n
	├──css
	├──test
	|  ├──unit
	|  |	├──allTest.js
	|  |	├──allTest.html
	|  |	└──...
	|  └──integration
	|  		├──allTest.js
	|  		├──allTest.html
	|		└──...
	├──localService
	|  ├──mockdata
	|  ├──ext
	|  |  └──mockExtension.js
	|  ├──metadata.xml
	|  └──annotation.xml
	├──Component.js
	└──manifest.json
```

### Начало работы:
- скачать software development kit ui5 нужной версии [src](https://tools.hana.ondemand.com/#sapui5)
- git clone repository
- cd directory
- npm install --global grunt-cli [docs](https://gruntjs.com)
- npm install --global @ui5/cli [docs](https://sap.github.io/ui5-tooling/)
- npm install
- создать config.json
- grunt dev

Для отображения задач grunt введите команду:
```
grunt --help lists
```

### config.json
Для работы окружения необходим настроечный файл config.json, расположенный в корне проекта.
Он имеет следующую структуру: 
```
{	
	sdk: path-to-sdk,
	apps: [
		{
			path: path-to-application,
			[transport]: transport request number,
			[package]: package for application,
			[bsp]: bsp container,
			[action]: semantic object action,
			[mockModelName]: model name for mockserver
		},
		...
	],
	[libs]: [
		{
			namespace: library-namespace,
			path: path-to-library,
			[transport]: transport request number,
			[package]: package for application,
			[bsp]: bsp container
		},
		...
	],
	[plugins]: [
		{
			path: path-to-plugin,
			[transport]: transport request number,
			[package]: package for application,
			[bsp]: bsp container,
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
}
```

### Детали реализации
После запуска команды grunt dev поднимется локальный сервер на 8000 порту.
Если указаны system, то окружение создаст проксирование на основе context для выбранной systemDefault.

Для разработки на данных сервера использовать url: /fiori-remote/index.html.
Для разработки на локальных данных (mockServer) использовать url: /fiori/index.html.
В случае локальных данных окружение попытается загрузить модуль /localService/ext/mockExtension.js 
приложения и вызвать метод apply, в который передаст инстанцию mockserver для дальнейшей конфигурации.