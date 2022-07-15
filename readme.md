### ui5 app structure:
```
.
└──webapp
	├──controller
	├──view
	├──fragments
	├──i18n
	├──css
    ├──annotations
    |  └──annotation.xml
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
	|  └──metadata.xml
	|  
	├──Component.js
	└──manifest.json
```

### prerequests:
- download software development kit ui5 [src](https://tools.hana.ondemand.com/#sapui5)
- git clone repository
- cd directory
- npm install (install [docs](https://gruntjs.com) and [docs](https://sap.github.io/ui5-tooling/))
- create config.json (see [baseSchema](./utils/configSchema.js))
- add PATH %AppData%\npm (для windows) for grunt grunt
- grunt dev

To display grunt tasks, enter the command:
```
grunt --help
```

### Implementation details
After running the grunt dev command, the local server will rise on port 8000.
If a system is specified, the environment will create a proxy based on the context for the selected default system (/sap).
The systemDefault, userDefault parameters are used to access data by default, if no other login and password are specified at startup.

In the case of local data, the environment will try to load the /localService/ext/mockExtension.js module of the application and call the apply method, which will pass the mockserver instance for further configuration.