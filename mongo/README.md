# Custom ESLint Rules for MongoDB Migration

## Overview

This project uses custom ESLint rules to assist in the migration from older MongoDB driver versions (2.x) to newer ones (6.9.0+), including support for the transitional `mongodb-legacy` package. These rules help identify deprecated methods, suggest modern alternatives, and ensure best practices in MongoDB usage.  **_This linter will not detect made up or completely nonexistent methods, its scope is limited to finding issues with the use of defined methods in the `mongodb` and `mongodb-legacy` packages._**

## Rule Files and Configuration

### ESLint Configuration

The main ESLint configuration for this project is located in:

`./eslint-config.js`

This file sets up the ESLint environment, specifies which files to lint, and enables our custom rules. It's where we define how strict each rule should be (error, warn, or off) and any specific configurations for individual rules.

### Custom Rule Directory

Our custom ESLint rules are located in the following directory:

`./rules/`

This directory contains individual JavaScript files for each custom rule we've created.

### Rule Files

1. `rules/mongo-deprecated-rule.js`: Focuses on identifying deprecated MongoDB methods and patterns when using the standard MongoDB driver.

2. `rules/mongodb-legacy-rule.js`: Tailored for use with the `mongodb-legacy` package, providing warnings and suggestions for transitioning to newer MongoDB patterns.

To add a new rule:
1. Create a new JavaScript file in the `./rules/` directory.
2. Import the rule in `./eslint-config.js`.
3. Add the rule to the `plugins` and `rules` sections in `./eslint-config.js`.

## Scope of Linting

Our custom linting rules cover:

- Deprecated MongoDB methods (e.g., `insert`, `update`, `remove`)
- Deprecated connection methods
- Deprecated cursor methods
- Outdated bulk operations
- Deprecated query options
- Usage of `mongodb-legacy` package

Note: **_This linter will not detect made up or completely nonexistent methods, its scope is limited to finding issues with the use of defined methods in the `mongodb` and `mongodb-legacy` packages._**

## How the Linting Works

1. **Static Analysis**: These rules use ESLint's static code analysis capabilities to examine your JavaScript files without executing them.

2. **AST Traversal**: They traverse the Abstract Syntax Tree (AST) of your code, looking for specific patterns that match MongoDB method calls and usage.

3. **Context-Aware Warnings**: Depending on whether you're using `mongodb` or `mongodb-legacy`, the rules provide different levels of warnings and suggestions.

4. **No Runtime Dependency**: The linting process doesn't require the MongoDB driver to be installed or connected; it purely analyzes the code structure.

## Usage

1. Ensure the custom rule files are in the `rules/` directory.
2. Verify that `eslint-config.js` is properly set up to use these custom rules.
3. Run ESLint on your codebase to identify areas that need attention during the MongoDB driver migration.

## Maintenance

As the MongoDB driver evolves and our migration progresses, we may need to update these rules. Please review and update the rules periodically to ensure they align with the latest MongoDB best practices and our project's needs.

## Contributing

If you identify new patterns that should be linted, follow the guidelines in the Rule Files and Configuration
section and then try to test changes and additions you make against some source.js code.

## Resources

- [MongoDB Driver Documentation](https://mongodb.github.io/node-mongodb-native/)
- [mongodb-legacy Package](https://www.npmjs.com/package/mongodb-legacy)
- [ESLint Custom Rules Guide](https://eslint.org/docs/developer-guide/working-with-rules)
- 