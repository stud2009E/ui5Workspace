sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {

    var mCustomCellDataCollectors = {};
    var mCustomProperties = {};

    return {

        registerCustomCellDataCollector: function (fnCollector, sPropertyName, sEntitySet) {
            mCustomCellDataCollectors[this.createCustomCellDataCollectorAccessKey(sPropertyName, sEntitySet)] = fnCollector;
        },

        getCustomCellDataCollector: function (sPropertyName, sEntitySet) {
            return mCustomCellDataCollectors[this.createCustomCellDataCollectorAccessKey(sPropertyName, sEntitySet)];
        },

        createCustomCellDataCollectorAccessKey: function (sPropertyName, sEntitySet) {
            return sEntitySet + "/" + sPropertyName;
        },

        registerHeaderToPropertyMapping: function (sHeader, sPropertyName) {
            mCustomProperties[sHeader] = sPropertyName;
        },

        getRegisteredHeaderToPropertyMappings: function () {
            return JSON.parse(JSON.stringify(mCustomProperties));
        },

        getColumnHeaders: function (oTable) {
            return oTable.getColumns().map(function columnHeaderText(oColumn) {
                return oColumn.getHeader().getText();
            });
        },

        getTableContent: function (oTable, aColumnHeaders) {
            if (!aColumnHeaders) {
                aColumnHeaders = this.getColumnHeaders(oTable);
            }
            var mHeaderToODataProperty = this.collectHeaderToODataPropertyMap(oTable);
            var aTableRawData = oTable
                .getItems()
                .filter(function (item) {
                    var bIsColumnListItem = item.isA("sap.m.ColumnListItem");
                    return bIsColumnListItem;
                })
                .filter(function (item) {
                    return item.getVisible();
                })
                .map(function itemContent(oItem) {
                    return this.collectTableRawData(oItem, aColumnHeaders, mHeaderToODataProperty);
                }.bind(this));
            return aTableRawData;
        },


        collectHeaderToODataPropertyMap: function (oTable) {
            var oDefaultMap = this.getRegisteredHeaderToPropertyMappings();
            return oTable.getColumns()
                .filter(function skipRegisteredMappings(oColumn) {
                    var sHeader = oColumn.getHeader().getText();
                    return !oDefaultMap[sHeader];
                })
                .filter(function (oColumn) {
                    return oColumn.data("p13nData");
                })
                .reduce(function extendDefaultMapWithODataProperties(acc, oColumn) {
                    acc[oColumn.getHeader().getText()] = oColumn.data("p13nData").columnKey;
                    return acc;
                }, oDefaultMap);
        },

        collectTableRawData: function (oItem, aColumnHeaders, mHeaderToODataProperty) {
            return aColumnHeaders.reduce(function combineCellDataIntoObject(oContent, sHeader) {
                var vValue = this.collectCellData(oItem, sHeader, mHeaderToODataProperty);
                oContent[sHeader] = this.toString(vValue);
                return oContent;
            }.bind(this), {});
        },

        collectCellData: function (oItem, sHeader, mHeaderToODataProperty) {
            var oBindingContext = oItem.getBindingContext();
            var sPath = oBindingContext.getPath();
            var sEntitySet = this.getEntitySetNameFromBindingPath(sPath);
            var fnCustomCellDataCollector = this.getCustomCellDataCollector(mHeaderToODataProperty[sHeader], sEntitySet);
            var vValue = null;
            var oCellCollectorData = {
                cell: this.getCell(oItem, sHeader),
                item: oItem,
                table: oItem.getParent(),
                header: sHeader,
                headerToODataProperty: mHeaderToODataProperty
            };
            if (fnCustomCellDataCollector) {
                vValue = fnCustomCellDataCollector.bind(this)(oCellCollectorData);
            } else {
                vValue = this.collectCellDataFromBindingContext(oCellCollectorData);
            }
            return vValue;
        },

        collectCellDataFromBindingContext: function (oData) {
            var oItem = oData.item;
            var sHeader = oData.header;
            var mHeaderToODataProperty = oData.headerToODataProperty;
            var vValue = oItem.getBindingContext().getProperty(mHeaderToODataProperty[sHeader]);
            if (this.isDate(vValue)) {
                vValue = this.formatDate(vValue);
            }
            return vValue;
        },

        getCell: function (oItem, sHeader) {
            var oTable = oItem.getParent();
            var nIndexOfRemainedColumn = oTable.getColumns().reduce(function getIndexOfBoundedColumn(nColumnIndex, oColumn, nCurrentIndex) {
                if (oColumn.getHeader().getText() === sHeader) {
                    return nCurrentIndex;
                } else {
                    return nColumnIndex;
                }
            }, -1);
            var oCell = oItem.getCells()[nIndexOfRemainedColumn];
            return oCell;
        },

        toString: function (vValue) {
            return "" + vValue;
        },

        isDate: function (vValue) {
            return vValue && typeof vValue.getTime === "function";
        },

        formatDate: function (vValue) {
            var oDateFormatInstance = DateFormat.getInstance({
                pattern: "dd.MM.yyyy"
            });
            return oDateFormatInstance.format(vValue);
        },

        getEntitySetNameFromBindingPath: function (sPath) {
            return sPath.substring(sPath.lastIndexOf("/") + 1, sPath.indexOf("("));
        },

        getTable: function(aTables, sTableHeader, sTableIndex){
            if(sTableIndex && aTables[sTableIndex]){
                return aTables[sTableIndex].getTable();
            }
            if (!!sTableHeader && aTables.length > 1) {
                var aTablesByFitler = aTables.filter(function (oTable) {
                    return oTable.getHeader() === sTableHeader;
                })
                return (aTablesByFitler[0]) ? aTablesByFitler[0].getTable() : null;
            }
            if(aTables[0]){
                return aTables[0].getTable();
            }
            
        }
    };
});