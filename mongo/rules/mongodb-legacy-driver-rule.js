const packageName = 'mongodb-legacy';

module.exports = {
  create(context) {
      
    const rules = require('@wisersolutions/eslint-config/mongo/rules/rules');
    const sourceCode = context.getSourceCode();

    const { deprecatedMethods, mongoDBLegacySupportedMethods } = require('@wisersolutions/eslint-config/mongo/deprecated-syntax/methods');
    
    const [
      deprecatedCollectionMethods,
      deprecatedConnectionMethods,
      deprecatedConstructors,
      deprecatedDBMethods,
      deprecatedCursorMethods,
      deprecatedBulkOpInitializations,
      deprecatedBulkOps,
      deprecatedQueryOptions,
    ] = deprecatedMethods;

    const [
      mongoDBLegacySupportedCollectionMethods,
      mongoDBLegacySupportedConnectionMethods,
      mongodbLegacySupportedConstructors,
      mongoDBLegacySupportedDBMethods,
      mongoDBLegacySupportedCursorMethods,
      mongoDBLegacySupportedBulkOpInitializations,
      mongoDbLegacySupportedBulkOps,
      mongoDBLegacySupportedQueryOptions,
    ] = mongoDBLegacySupportedMethods;

    const fullyDeprecatedCollectionMethods = deprecatedCollectionMethods.filter(method => !mongoDBLegacySupportedCollectionMethods.includes(method));
    const fullyDeprecatedConnectionMethods = deprecatedConnectionMethods.filter(method => !mongoDBLegacySupportedConnectionMethods.includes(method));
    const fullyDeprecatedConstructors = deprecatedConstructors.filter(method => !mongodbLegacySupportedConstructors.includes(method));
    const fullyDeprecatedDBMethods = deprecatedDBMethods.filter(method => !mongoDBLegacySupportedDBMethods.includes(method));
    const fullyDeprecatedCursorMethods = deprecatedCursorMethods.filter(method => !mongoDBLegacySupportedCursorMethods.includes(method));
    const fullyDeprecatedBulkOpInitializations = deprecatedBulkOpInitializations.filter(method => !mongoDBLegacySupportedBulkOpInitializations.includes(method));
    const fullyDeprecatedBulkOps = deprecatedBulkOps.filter(method => !mongoDbLegacySupportedBulkOps.includes(method));
    const fullyDeprecatedQueryOptions = deprecatedQueryOptions.filter(option => !mongoDBLegacySupportedQueryOptions.includes(option));

    return {
      MemberExpression(node) {
        // REQUIRE STATEMENTS
        // Check for old require syntax
        if (rules.requireStatementDoesNotUseDesctructuring(node)) {
          context.report({
            node,
            message: `The MongoDB require syntax of "${sourceCode.getText(node)}" is not recommended. Use the following syntax instead: "const { MongoClient } = require('${packageName}');"`,
          });
        }

        // COLLECTION METHODS
        // Check fully deprecated collection methods (and bulk ops - these are checked more thoroughly later) - these should be errors
        const { 
          deprecatedCollectionMethodChainedToBulkOp, 
          deprecatedCollectionMethod,
          isBulkInsert
        } = rules.collectionMethodUsesDeprecatedSyntax(node, fullyDeprecatedCollectionMethods);
        // Bulk op methods
        if (deprecatedCollectionMethodChainedToBulkOp) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.find().${node.property.name}()' - and all legacy bulk ops - are deprecated, but supported with the mongodb-legacy wrapper. Consider updating to the BulkWrite API for future compatibility. See https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/ for more information.`,
          });
        }
        // Collection methods
        if (deprecatedCollectionMethod && !deprecatedCollectionMethodChainedToBulkOp) {
          const methodToDisplay = node.property.name !== 'remove' ? node.property.name : 'delete'
          context.report({
            node,
            message: `The MongoDB collection method '${node.property.name}' is fully deprecated. You must use ${methodToDisplay}One or ${methodToDisplay}Many instead.`,
          });
        }
        if (isBulkInsert) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.${node.property.name}()' is deprecated, but supported with the mongodb-legacy wrapper. Consider updating to the BulkWrite API for future compatibility. See https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/ for more information.`,
          });
        }
        // Check deprecated collection methods (and bulk ops - these are checked more thoroughly later) that are still supported by mongodb-legacy - these should be warnings
         const {
          deprecatedCollectionMethodChainedToBulkOp: deprecatedCollectionMethodChainedToBulkOpLegacy,
          deprecatedCollectionMethod: deprecatedCollectionMethodLegacy,
        } = rules.collectionMethodUsesDeprecatedSyntax(node, mongoDBLegacySupportedCollectionMethods);
        // Bulk op methods
        if (deprecatedCollectionMethodChainedToBulkOpLegacy) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.find().${node.property.name}()' - and all legacy bulk ops - are deprecated, but supported with the mongodb-legacy wrapper. Consider updating to the BulkWrite API for future compatibility. See https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/ for more information.`,
          });
        }
        // Collection methods
        if (deprecatedCollectionMethodLegacy && !deprecatedCollectionMethodChainedToBulkOpLegacy) {
          context.report({
            node,
            message: `The MongoDB collection method '${node.property.name}' is deprecated but supported by mongodb-legacy. Consider updating to newer methods for future compatibility.`,
          });
        }

        // CONNECTION METHODS
        // Check fully deprecated connection methods - these should be errors
        if (rules.connectionMethodUsesDeprecatedSyntax(node, fullyDeprecatedConnectionMethods)) {
          const message = node.property.name === 'connect' ? `Consider using this syntax instead:
          const client = new MongoClient(appConfig.mongoDb.uri);
          const db = client.db();` : `Review the current best practices for establishing connections.`;
          context.report({
            node,
            message: `The MongoDB connection method '${node.property.name}' is fully deprecated. Review the current best practices for establishing connections. ${message}`,
          });
        }
        // Check deprecated connection methods that are still supported by mongodb-legacy - these should be warnings
        if (rules.connectionMethodUsesDeprecatedSyntax(node, mongoDBLegacySupportedConnectionMethods)) {
          const message = node.property.name === 'connect' ? `Consider using this syntax instead:
          const client = new MongoClient(appConfig.mongoDb.uri);
          const db = client.db();` : `Review the current best practices for establishing connections.`;
          context.report({
            node,
            message: `The MongoDB connection method '${node.property.name}' is handled differently in newer versions. ${message}`,
          });
        }

        // DB METHODS
        // Check fully deprecated db methods - these should be errors
        if (rules.dbMethodUsesDeprecatedSyntax(node, fullyDeprecatedDBMethods)) {
          context.report({
            node,
            message: `The MongoDB db method '${node.property.name}' is fully deprecated. You must update to a supported method.`,
          });
        }
        // Check deprecated db methods that are still supported by mongodb-legacy - these should be warnings
        if (rules.dbMethodUsesDeprecatedSyntax(node, mongoDBLegacySupportedDBMethods)) {
          context.report({
            node,
            message: `The MongoDB db method '${node.property.name}' is deprecated but supported by mongodb-legacy. Consider updating to newer methods for future compatibility.`,
          });
        }

        // BULK OP INITIALIZATIONS
        // Check fully deprecated bulk op initializations - these should be errors
        if (rules.bulkOpInitializationUsesDeprecatedSyntax(node, fullyDeprecatedBulkOpInitializations)) {
          context.report({
            node,
            message: `The MongoDB API '${node.property.name}' is fully deprecated. You must update to the BulkWrite API. See https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/ for more information.`,
          });
        }
        // Check deprecated bulk op initializations that are still supported by mongodb-legacy - these should be warnings
        if (rules.bulkOpInitializationUsesDeprecatedSyntax(node, mongoDBLegacySupportedBulkOpInitializations)) {
          context.report({
            node,
            message: `The MongoDB API '${node.property.name}' is deprecated but supported by mongodb-legacy. Consider updating to the BulkWrite API for future compatibility. See https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/ for more information.`,
          });
        }

        // BULK OPS
        // Check fully deprecated bulk ops - these should be errors
        if (rules.bulkOpUsesDeprecatedSyntax(node, fullyDeprecatedBulkOps)) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.find().${node.property.name}()' - and all legacy bulk ops - are fully deprecated. You must update to the BulkWrite API. See https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/ for more information.`,
          });
        }
        // Check deprecated bulk ops that are still supported by mongodb-legacy - these should be warnings
        if (rules.bulkOpUsesDeprecatedSyntax(node, mongoDbLegacySupportedBulkOps)) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.find().${node.property.name}()' - and all legacy bulk ops - are deprecated but supported by mongodb-legacy. Consider updating to the BulkWrite API for future compatibility. See https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/ for more information.`,
          });
        }
      },

      NewExpression(node) {
        // CONSTUCTORS
        // Check fully deprecated constructors - these should be errors
        if (rules.constructorUsesDeprecatedSyntax(node, fullyDeprecatedConstructors)) {
          context.report({
            node,
            message: `The MongoDB constructor '${node.callee.name}' is fully deprecated. You must update to a supported constructor.`,
          });
        }
        // Check deprecated constructors that are still supported by mongodb-legacy - these should be warnings
        if (rules.constructorUsesDeprecatedSyntax(node, mongodbLegacySupportedConstructors)) {
          context.report({
            node,
            message: `The MongoDB constructor '${node.callee.name}' is deprecated but supported by mongodb-legacy. Consider updating to newer constructors for future compatibility.`,
          });
        }
      },

      CallExpression(node) {
        // CALLBACK API
        // Check for deprecated callback API - should be warnings
        if (rules.queryUsesCallbackAPI(node)) {
          context.report({
            node,
            message: `The MongoDB callback API is deprecated, but supported by mongodb-legacy. Consider migrating to the Promise API for future compatability.`,
          });
        }

        // CURSOR METHODS
        // Check fully deprecated cursor methods - these should be errors
        const fullyDeprecatedresult = rules.cursorMethodUsesDeprecatedSyntax(node, fullyDeprecatedCursorMethods, sourceCode);
        if (fullyDeprecatedresult) {
          let methodString;
          if (typeof fullyDeprecatedresult === 'string') {
            methodString = fullyDeprecatedresult;
          } else {
            methodString = node.callee.property.name;
          }
          context.report({
            node,
            message: `The MongoDB cursor method '${methodString}' is fully deprecated. You must update to a supported method.`,
          });
        }
        // Check deprecated cursor methods that are still supported by mongodb-legacy - these should be warnings
        const mongoDBLegacySupportResult = rules.cursorMethodUsesDeprecatedSyntax(node, mongoDBLegacySupportedCursorMethods);
        if (mongoDBLegacySupportResult) {
          let methodString;
          if (typeof mongoDBLegacySupportResult === 'string') {
            methodString = mongoDBLegacySupportResult;
          } else {
            methodString = node.callee.property.name;
          }
          context.report({
            node,
            message: `The MongoDB cursor method '${methodString}' is deprecated but supported by mongodb-legacy. Consider updating to newer methods for future compatibility.`,
          });
        }

        // QUERY OPTIONS
        // Check for fully deprecated options in queries - these should be errors
        let options = rules.queryOptionUsesDeprecatedSyntax(node, fullyDeprecatedQueryOptions);
        if (options) {
          options.forEach(option => {
              context.report({
                node: option,
                message: `The MongoDB query option '${option.key.name}' is fully deprecated. You must update to a supported option.`,
              });
          });  
        }
        // Check for deprecated options in queries that are still supported by mongodb-legacy - these should be warnings
        options = rules.queryOptionUsesDeprecatedSyntax(node, mongoDBLegacySupportedQueryOptions);
        if (options) {
          options.forEach(option => {
              context.report({
                node: option,
                message: `The MongoDB query option '${option.key.name}' is deprecated but supported by mongodb-legacy. Consider updating to newer options for future compatibility.`,
              });
          });
        }
      },
    };
  },
};
