const packageName = 'mongodb';

module.exports = {
  create(context) {
      
    const rules = require('@wisersolutions/eslint-config/mongo/rules/rules');
    const sourceCode = context.getSourceCode();

    const { deprecatedMethods, allQueryMethods, cursorMethods } = require('@wisersolutions/eslint-config/mongo/deprecated-syntax/methods');
    
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
        // Check deprecated collection methods (and bulk ops - these are checked more thoroughly later) - these should be errors
        const { 
          deprecatedCollectionMethodChainedToBulkOp, 
          deprecatedCollectionMethod,
          isBulkInsert
        } = rules.collectionMethodUsesDeprecatedSyntax(node, deprecatedCollectionMethods);
        // Bulk op methods
        if (deprecatedCollectionMethodChainedToBulkOp) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.find().${node.property.name}()' - and all legacy bulk ops - are deprecated. You must update to the BulkWrite API (https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/) or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`,
          });
        }
        // Collection methods
        if (deprecatedCollectionMethod && !deprecatedCollectionMethodChainedToBulkOp) {
          const method = node.property.name;
          const methodToDisplay = method === 'remove' ? 'delete' : method;
          const message = `The MongoDB collection method '${method}' is deprecated. You must use ${method === 'count' ? 'countDocuments or estimatedDocumentCount' : `${methodToDisplay}One or ${methodToDisplay}Many`} instead.`;
          context.report({
            node,
            message,
          });
        }
        if (isBulkInsert) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.${node.property.name}()' is deprecated. You must update to the BulkWrite API (https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/) or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`,
          });
        }

        // CONNECTION METHODS
        // Check deprecated connection methods - these should be errors
        if (rules.connectionMethodUsesDeprecatedSyntax(node, deprecatedConnectionMethods)) {
          const message = node.property.name === 'connect' ? `Consider using this syntax instead:
          const client = new MongoClient(appConfig.mongoDb.uri);
          const db = client.db();` : `Review the current best practices for establishing connections.`;
          context.report({
            node,
            message: `The MongoDB connection method '${node.property.name}' is deprecated. Review the current best practices for establishing connections. ${message}`,
          });
        }

        // DB METHODS
        // Check deprecated db methods - these should be errors
        if (rules.dbMethodUsesDeprecatedSyntax(node, deprecatedDBMethods)) {
          const message = node.property.name === 'close' ?
            `The close() method is now part of the MongoClient instance, not the database instance. You must refactor your code to close the MongoClient instance instead.` :
            `The MongoDB db method '${node.property.name}' is deprecated. You must update to a supported method or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`;
          context.report({
            node,
            message,
          });
        }

        // BULK OP INITIALIZATIONS
        // Check deprecated bulk op initializations - these should be errors
        if (rules.bulkOpInitializationUsesDeprecatedSyntax(node, deprecatedBulkOpInitializations)) {
          context.report({
            node,
            message: `The MongoDB API '${node.property.name}' is deprecated. You must update to the BulkWrite API (https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/) or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`,
          });
        }

        // BULK OPS
        // Check deprecated bulk ops - these should be errors
        if (rules.bulkOpUsesDeprecatedSyntax(node, deprecatedBulkOps)) {
          context.report({
            node,
            message: `The MongoDB bulk op method 'bulk.find().${node.property.name}()' - and all legacy bulk ops - are deprecated. You must update to the BulkWrite API (https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/) or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`,
          });
        }
      },

      NewExpression(node) {
        // CONSTUCTORS
        // Check deprecated constructors - these should be errors
        if (rules.constructorUsesDeprecatedSyntax(node, deprecatedConstructors)) {
          context.report({
            node,
            message: `The MongoDB constructor '${node.callee.name}' is deprecated. You must update to a supported constructor or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy)`,
          });
        }
      },

      CallExpression(node) {
        // CALLBACK API
        // Check for deprecated callback API - query methods - should be errors
        if (rules.queryUsesCallbackAPI(node, allQueryMethods)) {
          context.report({
            node,
            message: `The MongoDB callback API is deprecated. You must update to the Promise API (https://www.mongodb.com/docs/drivers/node/current/fundamentals/promises/) or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`,
          });
        }
        // Check for deperacted callback API - cursor methods - should be errors
        if (rules.cursorUsesCallbackAPI(node, cursorMethods)) {
          context.report({
            node,
            message: `The MongoDB callback API is deprecated. You must update to the Promise API (https://www.mongodb.com/docs/drivers/node/current/fundamentals/promises/) or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`,
          });
        }

        // CURSOR METHODS
        // Check deprecated cursor methods - these should be errors
        const fullyDeprecatedresult = rules.cursorMethodUsesDeprecatedSyntax(node, deprecatedCursorMethods);
        if (fullyDeprecatedresult) {
          let methodString;
          if (typeof fullyDeprecatedresult === 'string') {
            methodString = fullyDeprecatedresult;
          } else {
            methodString = node.callee.property.name;
          }
          context.report({
            node,
            message: `The MongoDB cursor method '${methodString}' is deprecated. You must update to a supported method or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy).`,
          });
        }

        // QUERY OPTIONS
        // Check for deprecated options in queries - these should be errors
        let options = rules.queryOptionUsesDeprecatedSyntax(node, deprecatedQueryOptions);
        if (options) {
          options.forEach(option => {
              context.report({
                node: option,
                message: `The MongoDB query option '${option.key.name}' is deprecated. You must update to a supported option or use the mongodb-legacy wrapper (https://www.npmjs.com/package/mongodb-legacy)`,
              });
          });  
        }
      },
    };
  },
};