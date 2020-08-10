sap.ui.define([
    "sap/ui/test/Opa5",
    "commons/TableUtils",
    "sap/ui/test/matchers/Properties",
    "sap/ui/test/matchers/PropertyStrictEquals",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText"
], function (Opa5, TableUtils, Properties, PropertyStrictEquals, Press, EnterText) {
    "use strict";

    return Opa5.extend("BasePage", {

        iPressTheButton: function (sText, bDialog) {
            return this.waitFor({
                controlType: "sap.m.Button",
                matchers: new Properties({
                    text: sText
                }),
                actions: new Press(),
                searchOpenDialogs: bDialog,
                success: function () {
                    Opa5.assert.ok(true, "Кнопка " + sText + " успешно нажата");
                },
                errorMessage: "Не удается нажать на кнопку с текстом " + sText
            });
        },

        iPressTheIcon: function (sIcon, bDialog) {
            return this.waitFor({
                controlType: "sap.ui.core.Icon",
                matchers: new Properties({
                    src: "sap-icon://" + sIcon
                }),
                actions: new Press(),
                searchOpenDialogs: bDialog,
                success: function () {
                    Opa5.assert.ok(true, "Иконка " + sIcon + " успешно нажата");
                },
                errorMessage: "Не удается нажать на иконку " + sIcon
            });
        },

        iPressTheButtonWithIcon: function (sIcon) {
            return this.waitFor({
                controlType: "sap.m.Button",
                matchers: [
                    new PropertyStrictEquals({
                        name: "icon",
                        value: "sap-icon://" + sIcon
                    })
                ],
                actions: new Press(),
                success: function () {
                    Opa5.assert.ok(true, "Кнопка c иконкой " + sIcon + " успешно нажата");
                },
                errorMessage: "Не удается нажать на кнопку с текстом " + sIcon
            });
        },

        iEnterTextInTheSearchField: function (sText) {
            return this.waitFor({
                controlType: "sap.m.SearchField",
                actions: new EnterText({
                    text: sText
                }),
                success: function () {
                    Opa5.assert.ok(true, "Значение " + sText + " успешно указано для поиска");
                },
                errorMessage: "Не удается указать значение " + sText + " для поиска"
            });
        },

        iCheckSmartTableColumns: function (aColumnNames, sTableHeader, sTableIndex) {
            return this.waitFor({
                controlType: "sap.ui.comp.smarttable.SmartTable",
                success: function (aTables) {
                    var oTable = TableUtils.getTable(aTables, sTableHeader, sTableIndex);
                    if(oTable){
                        var aHeaders = TableUtils.getColumnHeaders(oTable);
                        Opa5.assert.deepEqual(aHeaders, aColumnNames, "Колонки в реестре успешно проверены");
                    }else{
                        Opa5.assert.ok(false, "Не найдена таблица");
                    }
                    
                },
                errorMessage: "Не удается найти реестр"
            });
        },

        iCheckSmartTableAllColumns: function (aColumnNames) {
            return this.waitFor({
                controlType: "sap.m.Text",
                searchOpenDialogs: true,
                success: function (aTexts) {
                    var aAllColumnNames = aTexts.map(function (oItem) {
                        return oItem.getText()
                    }).slice(1);
                    Opa5.assert.deepEqual(aAllColumnNames, aColumnNames, "Все колонки в реестре успешно проверены");
                },
                errorMessage: "column is not found",
                timeout: 5
            });
        },

        iPressTheIconTab: function (sTab) {
            return this.waitFor({
                controlType: "sap.m.IconTabFilter",
                matchers: new Properties({
                    text: sTab
                }),
                actions: new Press(),
                success: function () {
                    Opa5.assert.ok(true, "Вклакда " + sTab + " успешно нажата");
                },
                errorMessage: "Не удается нажать на вкладку с текстом " + sTab
            });
        },

        iPressTheHeaderExpand: function () {
            return this.waitFor({
                controlType: "sap.m.Button",
                matchers: [
                    new PropertyStrictEquals({
                        name: "icon",
                        value: "sap-icon://slim-arrow-down"
                    })
                ],
                actions: new Press(),
                success: function () {
                    Opa5.assert.ok(true, "Заголовок успешно раскрыт");
                },
                errorMessage: "Не удается нажать на кнопку с иконкой slim-arrow-down "
            });
        },

        iCheckTableContent: function (oTableContent, aHeaders, sTableHeader, sTableIndex) {
            return this.waitFor({
                controlType: "sap.ui.comp.smarttable.SmartTable",
                success: function (aTables) {
                    var oTable = TableUtils.getTable(aTables, sTableHeader, sTableIndex);
                    debugger;
                    if(oTable){
                        if (!aHeaders) {
                            aHeaders = TableUtils.getColumnHeaders(oTable);
                        }
                        var oActualContent = TableUtils.getTableContent(oTable, aHeaders);
                        Opa5.assert.deepEqual(oActualContent, oTableContent, "Данные успешно проверены");
                    }else{
                        Opa5.assert.ok(false, "Не найдена таблица");
                    }
                    
                },
                errorMessage: "Не удается найти реестр"
            });
        },

        iSelectSmartTableItem: function (oItemData , sTableHeader, sTableIndex) {
            return this.waitFor({
                controlType: "sap.ui.comp.smarttable.SmartTable",
                success: function (aTables) {
                    var oTable = TableUtils.getTable(aTables, sTableHeader, sTableIndex);
                    if(oTable){
                        var mHeaderToODataProperty = TableUtils.collectHeaderToODataPropertyMap(oTable);
                        var oActualItemContext = Object.fromEntries(
                            Object.entries(oItemData).map(([sKey, sValue]) => [mHeaderToODataProperty[sKey], sValue])
                        );
                        var aTableActualItems = oTable
                            .getItems().filter(function (oItem) {
                                var oItemContext = oItem.getBindingContext().getObject();
                                var bValue = true;
                                for (var sKey in oActualItemContext) {
                                    if (!oItemContext.hasOwnProperty(sKey) || oItemContext[sKey].valueOf() !== oActualItemContext[sKey].valueOf()) {
                                        bValue = false;
                                    }
                                }
                                return bValue;
                            }.bind(this));
                        Opa5.assert.strictEqual(aTableActualItems.length, 1, "Есть только один объект в реестре с такими параметрами");
                        aTableActualItems[0].firePress();
                    }else{
                        Opa5.assert.ok(false, "Не найдена таблица");
                    }
                    
                },
                errorMessage: "Не удается найти реестр"
            });
        },

        iEnterTextInTheTextArea: function (sText, bDialog) {
            return this.waitFor({
                controlType: "sap.m.TextArea",
                actions: new EnterText({
                    text: sText
                }),
                searchOpenDialogs: bDialog,
                success: function () {
                    Opa5.assert.ok(true, "Значение " + sText + " успешно указано для текстового поля");
                },
                errorMessage: "Не удается проверить видимость кнопку с текстом " + sText
            });
        },

        iPressTheAnchorBar: function (sTab) {
            return this.waitFor({
                controlType: "sap.uxap.AnchorBar",
                success: function (aAnchorBars) {
                    var oAnchorBar = aAnchorBars[0];
                    var aTabs = oAnchorBar.getContent().filter(function (oItem) {
                        return oItem.getText() === sTab
                    });
                    var oControl = aTabs[0];
                    if (oControl.isA("sap.m.Button")) {
                        oControl.firePress();
                    }
                    if (oControl.isA("sap.m.MenuButton")) {
                        oControl.fireDefaultAction();
                    }
                    Opa5.assert.ok(true, "Закладка " + sTab + " успешно нажата");
                },
                errorMessage: "Не удается найти список закладкок"
            });
        },

        iCheckTheAnchorBarTabs: function (aTabs) {
            return this.waitFor({
                controlType: "sap.uxap.AnchorBar",
                success: function (aAnchorBars) {
                    var oAnchorBar = aAnchorBars[0];
                    var aAnchorBarTabs = oAnchorBar.getContent().map(function (oItem) {
                        return oItem.getText()
                    });
                    Opa5.assert.deepEqual(aTabs, aAnchorBarTabs, "Все закладки успешно проверены");
                },
                errorMessage: "Не удается найти список закладкок"
            });
        },

        iCheckField: function(sTextLabel, sValue){
            return this.waitFor({
                controlType: "sap.ui.comp.smartfield.SmartField",
                matchers: new Properties({
                    textLabel: sTextLabel
                }),
                success: function (aSmartFields) {
                    Opa5.assert.strictEqual(aSmartFields.length, 1, "Есть только одна аналитика с заголовком " + sTextLabel);
                    var vValue = aSmartFields[0].getValue();
                    if (TableUtils.isDate(vValue)) {
                        vValue = TableUtils.formatDate(vValue);
                    }
                    Opa5.assert.strictEqual(vValue, sValue,  "Аналитика " + sTextLabel + " успешно проверена");
                },
                errorMessage: "Не удается проверить аналитику " + sTextLabel
            });
        }

    });

});