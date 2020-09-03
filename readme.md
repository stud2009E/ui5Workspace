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
	|  ├──integration
	|  ├──allTest.js
	|  └──allTest.html
	├──localService
	|  ├──mockdata
	|  ├──ext
	|  |  └──mockExtension.js
	|  ├──metadata.xml
	|  ├──annotation.xml
	|  └──mockserver.html
	├──index.html
	├──Component.js
	└──manifest.json
```

### Начало работы:
- git clone https://sbtatlas.sigma.sbrf.ru/stash/scm/sapsus/zspl_workspace.git
- cd zspl_workspace
- npm install --global grunt-cli [docs](https://gruntjs.com)
- npm install --global @ui5/cli [docs](https://sap.github.io/ui5-tooling/)
- npm install --global yo [docs](https://yeoman.io/)
- npm install

Для отображения реализованных задач grunt введите команду:
```
grunt --help lists
```
