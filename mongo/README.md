# Custom ESLint Rules for MongoDB Migration

## Overview

This project uses custom ESLint rules to assist in the migration from older MongoDB driver versions (2.x) to newer ones (6.9.0+), including support for the transitional `mongodb-legacy` package. These rules help identify deprecated methods, suggest modern alternatives, and ensure best practices in MongoDB usage.

## How to integrate with your project

1. Ensure your project has a `.npmrc` file at the root. If not:
  - Create a token that allow to read packages at wisersolutions scope. Follow [these steps on Confluence](https://wisersolutions.atlassian.net/wiki/spaces/IENG/pages/2321514506/GitHub+-+NPM+Registry)
  - Create an `.npmrc` file at the root of your project. Add:
  ```bash
  //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
  @wisersolutions:registry=https://npm.pkg.github.com/
  ```

2. Download the package

```bash
npm i -D @wisersolutions/eslint-config
```

3. Add the `mongo` plugin to your eslint config
  -  For an `eslint.config.js` flat config file (the modern approach):
      - Import the package at the top of your config file
        ```javascript
        const mongoEsLintConfig = require('@wisersolutions/eslint-config/mongo');
        ```
      - Add the config to the `module.exports` array. e.g.:
        ```javascript
        module.exports = [
          {
            ignores: ['node_modules/**', '**/build/**', '**/dist/**'],
          },
          {
            languageOptions: {
              ecmaVersion: 2018,
              sourceType: 'commonjs',
              globals: {
                ...globals.node,
                ...globals.es2018
              }
            },
          },
          mongoEsLintConfig,
        ];
        ```
  - For the `.eslintrc.js` config file (the out of favor approach):
      - Add the config to the `extends` array
          ```javascript
          {
            "extends": [
              "@wisersolutions/eslint-config/mongo",
            ]
          }
          ```
4. Create a `run-eslint.sh` file at the root of your project. Add:
```bash
#!/bin/bash
RULE_TO_RUN=$1 npx eslint .
```

5. Add these scripts to your `package.json` file
```json
    "lint": "eslint .",
    "lint-mongodb-v6": "./run-eslint.sh mongodb-v6-deprecated",
    "lint-mongodb-legacy": "./run-eslint.sh mongodb-legacy-deprecated",
```

6. Run scripts
  - To output all lines caught by the `mongodb-v6-driver-rule`
    ```bash
    npm run lint-mongodb-v6
    ```
  - To output all lines caught by the `mongodb-legacy-driver-rule`
    ```bash
    npm run lint-mongodb-legacy
    ```
  - To output all lines caught by all rules
    ```bash
    npm run lint
    ```

7. For real time linting per file, restart the eslint server. In VSCode:
- Open the Command Palette `(COMMAND + SHIFT + P)`
- Select `"ESLint: Restart ESLint Server"`
    

## Rule Files and Configuration

### ESLint Configuration

The main ESLint configuration for this project is located in:

`./eslint-config.js`

This file sets up the ESLint environment, specifies which files to lint, and enables our custom rules. It's where we define how strict each rule should be (`error`, `warn`, or `off`) and any specific configurations for individual rules.

### Custom Rule Directory

Our custom ESLint rules are located in the following directory:

`./rules/`

This directory contains a main rules file `rules.js` which has functions which run the actual rule logic. Then there are individual JavaScript files for each custom rule we've created that uses functions as needed from `rules.js`.

### Rule Files

1. `rules/mongodb-v6-driver-rule.js`: Focuses on identifying deprecated MongoDB methods and patterns when using the standard v6 MongoDB driver.

2. `rules/mongodb-legacy-driver-rule.js`: Tailored for use with the `mongodb-legacy` package, providing warnings and suggestions for transitioning to newer MongoDB patterns. If a method/API is not supported by mongodb-legacy nor the standard v6 MongoDB driver, then it is noted as fully deprecated.

#### To add a new rule:
1. Create a new JavaScript file in the `./rules/` directory.
2. Import the rule in `./eslint-config.js`.
3. Add the rule to the `allRules` object following the established pattern
4. Define how strict each rule should be (`error`, `warn`, or `off`) 
3. Add the rule to the `plugins.mongo.rules` object, following the established pattern

## Scope of Linting

The scope of what is linted is defined in the `./deprecated-syntax/` directory. The deprecated methods are enumerated in the `methods.js` file. Additional deprecated methods/APIs/uses can be added to this directory.

Our custom linting rules for MongoDB cover:

- Deprecated collection methods (e.g., `insert`, `update`, `remove`)
- Deprecated connection methods
- Deprecated constructors (incomplete)
- Deprecated cursor methods
- Deprecated bulk initializations
- Deprecated bulk operations
- Deprecated query options
- All of the above relative to what is supported by the mongodb-legacy wrapper

Note: **_This linter will not detect made up or completely nonexistent methods, its scope is limited to finding issues with the use of defined methods in the `mongodb` and `mongodb-legacy` packages._**

## How the Linting Works

1. **Static Analysis**: These rules use ESLint's static code analysis capabilities to examine your JavaScript files without executing them.

2. **AST Traversal**: They traverse the Abstract Syntax Tree (AST) of your code, looking for specific patterns that match MongoDB method calls and usage.

3. **Context-Aware Warnings**: Depending on whether you're using `mongodb` or `mongodb-legacy`, the rules provide different levels of warnings and suggestions.

4. **No Runtime Dependency**: The linting process doesn't require the MongoDB driver to be installed or connected; it purely analyzes the code structure.


## Maintenance

As the MongoDB driver evolves and our migration progresses, we may need to update these rules. Please review and update the rules periodically to ensure they align with the latest MongoDB best practices and our project's needs.

## Contributing

If you identify new patterns that should be linted, follow the guidelines in the Rule Files and Configuration
section and then try to test changes and additions you make against some source.js code.

## Resources

- [MongoDB Driver Documentation](https://mongodb.github.io/node-mongodb-native/)
- [mongodb-legacy Package](https://www.npmjs.com/package/mongodb-legacy)
- [ESLint Custom Rules Guide](https://eslint.org/docs/developer-guide/working-with-rules)