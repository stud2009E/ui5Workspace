module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es2021": true
    },
    "globals": {
        "process": true,
        "Buffer": true,
        "sap": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "eqeqeq": "error",
        "curly": "error",
        "quotes": ["error", "double"],
        "func-style": ["error", "declaration", {allowArrowFunctions: true}],
        "comma-spacing": ["error", { "before": false, "after": true }],
        "no-multi-spaces": "error",
        "space-before-blocks": ["error", "never"]
    },
    "noInlineConfig": true
}
