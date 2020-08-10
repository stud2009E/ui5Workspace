sap.ui.define([
    "sap/ui/test/gherkin/StepDefinitions",
    "commons/Utils",
], function (StepDefinitions, Utils) {
    "use strict";

    var Steps = StepDefinitions.extend("GherkinWithPageObjects.Steps", {

        init: function () {
            this.register(/^Я запустил приложение с семантическим объектом #([a-zA-Z0-9_\-]*)$/i,
                function (sHash, Given, When, Then) {
                    Given.iStartMyAppWithHash(sHash);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я нажал на кнопку$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    var sText = oObject["текст"];
                    var bDialog = (oObject["диалог"] && oObject["диалог"] == "Да") ? true : false;
                    this.getPage(When, sPageName).iPressTheButton(sText, bDialog);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я нажал на кнопку c иконкой$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    var sIcon = oObject["иконка"];
                    this.getPage(When, sPageName).iPressTheButtonWithIcon(sIcon, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я нажал на иконку$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    var sText = oObject["иконка"];
                    var bDialog = (oObject["диалог"] && oObject["диалог"] == "Да") ? true : false;
                    this.getPage(When, sPageName).iPressTheIcon(sText, bDialog);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я указал значение для поиска$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    var sText = oObject["текст"];
                    this.getPage(When, sPageName).iEnterTextInTheSearchField(sText, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил список колонок в реестре$/i,
                function (sPageName, aColumns, Given, When, Then) {
                    this.getPage(When, sPageName).iCheckSmartTableColumns(aColumns, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я нажал на кнопку настройки реестра$/i,
                function (sPageName, Given, When, Then) {
                    this.getPage(When, sPageName).iCheckSmartTableColumns(aColumns, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил список всех доступных колонок в настройках$/i,
                function (sPageName, aColumns, Given, When, Then) {
                    this.getPage(When, sPageName).iCheckSmartTableAllColumns(aColumns, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я нажал на вкладку$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    var sTab = oObject["вкладка"];
                    this.getPage(When, sPageName).iPressTheIconTab(sTab, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я раскрыл заголовок$/i,
                function (sPageName, oContent, Given, When, Then) {
                    this.getPage(When, sPageName).iPressTheHeaderExpand();
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил данные в реестре$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oTableData = Utils.toTable(oContent);
                    var aHeaders = Utils.handleOneRowTable(oContent)[0];
                    this.getPage(When, sPageName).iCheckTableContent(oTableData, aHeaders);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил все данные в реестре$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oTableData = Utils.toTable(oContent);
                    this.getPage(When, sPageName).iCheckTableContent(oTableData);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я указал значение для текстового поля$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    var sText = oObject["текст"];
                    var bDialog = (oObject["диалог"] && oObject["диалог"] == "Да") ? true : false;
                    this.getPage(When, sPageName).iEnterTextInTheTextArea(sText, bDialog);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я нажал в реестре на объект$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    this.getPage(When, sPageName).iSelectSmartTableItem(oObject);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я нажал на закладку$/i,
                function (sPageName, oContent, Given, When, Then) {
                    var oObject = Utils.toObject(oContent);
                    var sTab = oObject["закладка"];
                    this.getPage(When, sPageName).iPressTheAnchorBar(sTab, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил список закладок$/i,
                function (sPageName, aTabs, Given, When, Then) {
                    this.getPage(When, sPageName).iCheckTheAnchorBarTabs(aTabs, false);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил данные в таблице ([a-zA-Z0-9А-Яа-я_\s]*)$/i,
                function (sPageName, sTableHeader, oContent, Given, When, Then) {
                    var oTableData = Utils.toTable(oContent);
                    var aHeaders = Utils.handleOneRowTable(oContent)[0];
                    this.getPage(When, sPageName).iCheckTableContent(oTableData, aHeaders, sTableHeader);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил все данные в таблице ([a-zA-Z0-9А-Яа-я_\s]*)$/i,
                function (sPageName, sTableHeader, oContent, Given, When, Then) {
                    var oTableData = Utils.toTable(oContent);
                    this.getPage(When, sPageName).iCheckTableContent(oTableData, null, sTableHeader);
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил данные ([a-zA-Z0-9А-Яа-я_\s]*) таблице$/i,
                function (sPageName, sTableIndexText, oContent, Given, When, Then) {
                    var oTableData = Utils.toTable(oContent);
                    var aHeaders = Utils.handleOneRowTable(oContent)[0];
                    this.getPage(When, sPageName).iCheckTableContent(oTableData, aHeaders, null, this.getTableIndex(sTableIndexText));
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил все данные ([a-zA-Z0-9А-Яа-я_\s]*) таблице$/i,
                function (sPageName, sTableIndexText, oContent, Given, When, Then) {
                    var oTableData = Utils.toTable(oContent);
                    this.getPage(When, sPageName).iCheckTableContent(oTableData, null, null, this.getTableIndex(sTableIndexText));
                }
            );

            this.register(/^на странице ([a-zA-Z0-9А-Яа-я_\s]*) Я проверил аналитики$/i,
                function (sPageName, oContent, Given, When, Then) {
                    oContent.forEach(function(oItem){
                        this.getPage(When, sPageName).iCheckField(oItem[0], oItem[1]);
                    }.bind(this));
                }
            );

        },

        getPage: function (that, sPageName) {
            var oTextMapping = {
                "Главная": "Main",
                "Реестр": "ListReport",
                "Объект": "Object"
            }
            return that["on" + oTextMapping[sPageName] + "Page"];
        },

        getTableIndex: function(sTableIndexText){
            var oTextMapping = {
                "в первой": 0,
                "во второй": 1,
                "в третьей": 2,
                "в четвертой": 3,
                "в пятой": 4
            }
            return (oTextMapping[sTableIndexText]) ? oTextMapping[sTableIndexText] : 0;
        }

    });

    return Steps;

});