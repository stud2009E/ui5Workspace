const baseSchema = {
	type: "object",
	properties: {
		sdk: { type: "string" },
		apps: {
			type: "array",
			items: {
				type: "object",
				properties: {
					path: { type: "string"},
					transport: { type: "string"},
					bsp: { type: "string"},
					action: { type: "string"}
				},
				required:["path"]
			}
	  	},
		libs:{
			type: "array",
			items: {
				type: "object",
				properties: {
					namespace: { type: "string"},
					path: { type: "string"},
					transport: { type: "string"},
					package: { type: "string"},
					bsp: { type: "string"}
				},
				required: ["namespace", "path"]
			}
		},
		plugins: {
			type: "array",
			items: {
				type: "object",
				properties: {
					path: { type: "string"},
					transport: { type: "string"},
					bsp: { type: "string"},
					action: { type: "string"}
				},
				required:["path"]
			}
		},
		theme: { type: "string", default: "sap_belize"},
		systemCD: { type: "string" },
		userCD: { type: "string" },
		systemDefault: { type: "string" },
		userDefault: { type: "string" },
		proxyModule: { enum: ["npm", "git"], default: "git" },
		system: {type: "object"}
	},
	required:["sdk", "apps"]
}

const systemSchema = {
	type: "object",
	patternProperties:{
		"\w+": {
			type: "object",
			properties: {
				host: {type: "string"},
				port: {type: "number"},
				context: {type: "string", default: "/sap"},
				secure: {type: "boolean", default: false},
				https: {type: "boolean", default: true},
				user: {
					type: "object",
					patternProperties: {
						"\w+": {
							type: "object",
							properties: {
								login: {type: "string"},
								pwd: {type: "string"}
							},
							required: ["login", "pwd"]
						}
					}
				}
			},
			required: ["host", "port"]
		}
	}
}

module.exports.app = baseSchema;
module.exports.system = systemSchema;