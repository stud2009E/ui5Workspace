const {systemSchema} = require("../utils/configSchema.js");
const Ajv = require("ajv");
const ajv = new Ajv({
	useDefaults: true, 
	allErrors: true,
	verbose: true
});


const obj =  {
	"add": {
		"host": "services.odata.org",
		"port": 443,
		"context": "/v2",
		"secure": false,
		"https": true,
		"user": {
			"sdd100": {
				"pwd": "",
				"mandt": 10,
				"login": ""
			}
		}
	}
};

// const sh = {
// 	type: "object",
// 	patternProperties: {
// 		"\\w+": {type: "object"}
// 	},
// 	additionalProperties: false
// };
// const validateSH = ajv.compile(sh);

// validateSH({
// 	".": {
// 		".": "test"
// 	}
// });

// console.log("errors:");
// console.dir(validateSH.errors, {
// 	depth:2
// });

console.dir(systemSchema, {depth: 5});
console.dir(obj, {depth: 4});
const validateSystem = ajv.compile(systemSchema);

validateSystem(obj)

console.log("errors:");
console.dir(validateSystem.errors, {
	depth:2
});