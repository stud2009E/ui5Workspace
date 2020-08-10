sap.ui.define(["jquery.sap.sjax",
	"sap/ui/thirdparty/jquery"], function(jQuery, jQueryDOM) {
  "use strict";

  var simpleGherkinParser = {

    parse: function(sText) {
      if (jQueryDOM.type(sText) !== "string") {
        throw new Error("simpleGherkinRussianLanguageParser.parse: parameter 'sText' must be a valid string");
      }

      var aLines =
          sText.split("\n"). 
          map(function(s){return s.replace(/^\s*#.*/,"").trim();});

      var oFeature = null, oScenario = null, oStep = null, aTags = [], aFeatureTags = [], aScenarioTags = [];
      for (var i = 0; i < aLines.length; ++i) {
        var sLine = aLines[i];

        var bTagsMatch = !!sLine.match(/^(?:@[^ @]+)(?:\s+@[^ @]+)*$/);
        if (bTagsMatch) {
          aTags = sLine.split(/\s+/);
          continue;
        }
        var aFeatureMatch = sLine.match(/^Тест:(.+)$/);
        if (aFeatureMatch) {
          aFeatureTags = aTags;
          oFeature = {tags: aFeatureTags, name: aFeatureMatch[1].trim(), scenarios: []};
          aTags = [];
          continue;
        }

        var bBackgroundMatch = !!sLine.match(/^Предыстория:/);
        if (bBackgroundMatch) {
          oScenario = oFeature.background = {name: "<background>", steps: []};
          continue;
        }

        var aScenarioMatch = sLine.match(/^Сценарий:(.+)/);
        if (aScenarioMatch) {
          aScenarioTags = aFeatureTags.concat(aTags);
          oScenario = {tags: aScenarioTags, name: aScenarioMatch[1].trim(), steps: []};
          oFeature.scenarios.push(oScenario);
          aTags = [];
          continue;
        }

        var aStepMatch = sLine.match(/^(Дано|Когда|Тогда|И|Но|\*)\s+(.+)$/);
        var oTextMapping = {
          "Дано": "Given",
          "Когда": "When",
          "То": "Then",
          "И": "And",
          "Но": "But"
        };
        if (aStepMatch) {
          oStep = {text: aStepMatch[2].trim(), keyword: oTextMapping[aStepMatch[1].trim()]};
          oScenario.steps.push(oStep);
          continue;
        }

        var aRowMatch = sLine.match(/^\|(.*)\|$/);
        if (aRowMatch) {
          var vData = aRowMatch[1].split("|").map(function(s){return s.trim();});

          if (vData.length === 1) {
            vData = vData[0];
          }

          oStep.data = oStep.data || [];
          oStep.data.push(vData);
        }

      }

      oFeature.scenarios.forEach(function(oScenario) {
        oScenario.steps.forEach(function(oStep) {
          if (jQueryDOM.isArray(oStep.data) && (oStep.data.length === 1) && (jQueryDOM.type(oStep.data[0]) === "array")) {
            oStep.data = oStep.data[0];
          }
        });
      });

      return oFeature;
    },


    parseFile: function(sPath) {

      if (jQueryDOM.type(sPath) !== "string") {
        throw new Error("simpleGherkinRussianLanguageParser.parseFile: parameter 'sPath' must be a valid string");
      }

      sPath = sap.ui.require.toUrl((sPath).replace(/\./g, "/")) + ".feature";

      var oResult = jQuery.sap.sjax({
        url: sPath,
        dataType: "text"
      });

      if (!oResult.success) {
        throw new Error("simpleGherkinRussianLanguageParser.parseFile: error loading URL: " + sPath);
      }

      return this.parse(oResult.data);
    }
  };

  return simpleGherkinParser;
}, /* bExport= */ true);