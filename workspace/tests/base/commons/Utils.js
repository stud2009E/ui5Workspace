sap.ui.define([
    "sap/ui/test/gherkin/dataTableUtils"
], function (dataTableUtils) {
    return {
        handleOneColumnTable: function (aContent) {
            var aNormalizedContent = aContent;
            var bTableContainsOneColumn = !Array.isArray(aContent[0]);
            if (bTableContainsOneColumn) {
                aNormalizedContent = aContent.map(function (row) {
                    return [row];
                });
            }
            return aNormalizedContent;
        },

        handleOneRowTable: function (content) {
            var aNormalizedContent = content;
            var bTableContainsOneRow = !Array.isArray(content[0]);
            if (bTableContainsOneRow) {
                aNormalizedContent = [content];
            }
            return aNormalizedContent;
        },

        toTable: function (aContent) {
            var aTable = this.handleOneColumnTable(aContent);
            return dataTableUtils.toTable(aTable);
        },

        toObject: function (aContent) {
            var aTable = this.handleOneRowTable(aContent);
            return dataTableUtils.toObject(aTable);
        }
    };
});