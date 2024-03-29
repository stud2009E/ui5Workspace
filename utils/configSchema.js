const baseSchema = {
	type: "object",
	properties: {
		sdk: { type: "string" },
		apps: {
			type: "array",
			items: {
				type: "object",
				properties: {
					path: { type: "string" },
					name: { type: "string" },
					action: { type: "string", default: "display" },
					modelName: { type: "string", default: "" },
					annoDataSource: { type: "string", default: "remote" },
					transport: { type: "string" },
					package: { type: "string" },
					bsp: { type: "string" },
                    useMockServer: {type: "boolean", default: false}
				},
				required: ["name", "path"]
			}
		},
		libs: {
			type: "array",
			items: {
				type: "object",
				properties: {
					name: { type: "string" },
					context: { type: "string", default: "/sap/bc/ui5_ui5/sap/" },
					namespace: { type: "string" },
					path: { type: "string" },
					transport: { type: "string" },
					package: { type: "string" },
					bsp: { type: "string" }
				},
				required: ["name", "path", "namespace"]
			}
		},
		plugins: {
			type: "array",
			items: {
				type: "object",
				properties: {
					path: { type: "string" },
					name: { type: "string" },
					transport: { type: "string" },
					bsp: { type: "string" },
					action: { type: "string" }
				},
				required: ["name", "path"]
			}
		},
		theme: { type: "string", default: "sap_belize" },
		systemCDKey: { type: "string" },
		userCDKey: { type: "string" },
		systemDefaultKey: { type: "string" },
		userDefaultKey: { type: "string" },
		proxyModule: { enum: ["npm", "git"], default: "git" },
        useUtf8: { type: "boolean", default: false },
		system: { type: "object" }
	},
	required: ["sdk", "apps"],
	additionalProperties: false
};

const systemSchema = {
	type: "object",
	patternProperties: {
		"^\\w+$": {
			type: "object",
			properties: {
				host: { type: "string" },
                port: { type: "integer" },
                https: { type: "boolean", default: true },
                secure: { type: "boolean", default: false },
                services: {
                    type: "array",
                    minItems: 1,
                    items: {
                        type: "object",
                        properties:{
                            context: { type: "string", default: "/sap" },
                            ws: { type: "boolean", default: false }
                        },
                        required: ["context"],
                        additionalProperties: false
                    }
                },
				user: {
					type: "object",
					patternProperties: {
						"\\w+": {
							type: "object",
							properties: {
                                language: {type: "string", default: "ru"},
								mandt: { type: "integer"},
								login: { type: "string"},
								pwd: { type: "string"}
							},
							required: ["login", "pwd", "mandt", "language"],
							additionalProperties: false
						}
					},
					minProperties: 1,
					additionalProperties: false
				}
			},
			required: ["host", "port", "https", "secure", "services", "user"]
		}
	},
	minProperties: 1,
	additionalProperties: false
};

const deploySchema = {
	type: "object",
	properties: {
		transport: { type: "string", minLength: 3},
		package: { type: "string", minLength: 3},
		bsp: { type: "string", minLength: 3 }
	},
	required: ["transport", "package", "bsp"]
};

module.exports.baseSchema = baseSchema;
module.exports.systemSchema = systemSchema;
module.exports.deploySchema = deploySchema;