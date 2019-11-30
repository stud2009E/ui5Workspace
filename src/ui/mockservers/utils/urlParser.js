sap.ui.define([], function () {

    return {

        parseEntityKeys: function (EntityClass, sUrl) {
            var aKeyProperties = EntityClass.prototype.getKeyProperties();
            var mKeys = {};
            var sUrlKeyArguments = sUrl.substring(sUrl.lastIndexOf("(") + 1, sUrl.lastIndexOf(")"));
            if (aKeyProperties.length === 1 && sUrlKeyArguments.indexOf("'") < 0) {
                mKeys[aKeyProperties[0]] = sUrlKeyArguments;
            } else if (aKeyProperties.length === 1 && sUrlKeyArguments.indexOf("'") >= 0) {
                mKeys[aKeyProperties[0]] = sUrlKeyArguments.replace(/'/g, "");
            } else {
                sUrlKeyArguments.split(",").reduce(function (mKeyAcc, sKeyValue) {
                    var aParts = sKeyValue.split("=");
                    var sKey = aParts[0];
                    var sValue = aParts[1];

                    var typedValue = null;

                    /* We are handling Strings, Numbers and undefined only.
                    If we will need to extend type support we should consider using standard Mockserver approach (it has private method for url parsing)
                    */
                    if (sValue === "undefined") {
                        typedValue = undefined;
                    } else if (sValue.startsWith("'") && sValue.endsWith("'")) {
                        typedValue = aParts[1].substring(1, aParts[1].length - 1);
                    } else {
                        typedValue = Number(sValue);
                    }

                    mKeyAcc[sKey] = typedValue;
                    return mKeyAcc;
                }, mKeys);
            }
            return mKeys;

        },

        parseUrlParameter: function (sUrl, sParam) {
            var sRgTemplate = ".*" + sParam + "='(.*)'$";
            var rgReservationNumber = new RegExp(sRgTemplate);
            var aMatchedGroups = rgReservationNumber.exec(sUrl);
            if (aMatchedGroups.length < 2) {
                throw new Error("Expected '" + sParam + "' in url parameters");
            }
            return aMatchedGroups[1];
        },

        parseUrlQueries: function (sUrl) {
            var uri = new URI(sUrl);
            if (uri) {
                return uri.query(true);
            } else {
                throw new Error(sUrl + " not a link");
            }
        }

    };
});