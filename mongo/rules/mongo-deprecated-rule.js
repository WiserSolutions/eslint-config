module.exports = {
  create(context) {
    return {
      CallExpression(node) {

        const deprecatedMethods = [
          'insert', 'update', 'remove', 'save',
          'findAndModify', 'findAndRemove', 'ensureIndex', 'dropAllIndexes',
          'reIndex', 'group', 'authenticate', 'logout', 'geoNear', 'geoHaystackSearch',
          'parallelCollectionScan', 'eval'
        ];

        const deprecatedConnectionMethods = [
          'connect', 'connectAsync', 'open', 'openAsync'
        ];

        const deprecatedCursorMethods = [
          'nextObject', 'explain', 'setReadPreference'
        ];

        const deprecatedBulkMethods = [
          'initializeOrderedBulkOp', 'initializeUnorderedBulkOp'
        ]

        // check for deprecated methods on collections
        if (
          node.callee.type === 'MemberExpression' &&
          deprecatedMethods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: `The MongoDB method '${node.callee.property.name}' is deprecated.`,
          });
        }

        // check for deprecated connection methods
        // note that valid 6.9.0 methods like
        //   const client = new MongoClient(uri);
        //   await client.connect();
        // will not trigger detection with these addition conditions
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'MongoClient' &&
          deprecatedConnectionMethods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: `The MongoDB connection method '${node.callee.property.name}' is deprecated.`,
          });
        }

        // check for deprecated cursor methods
        if (
          node.callee.type === 'MemberExpression' &&
          deprecatedCursorMethods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: `The MongoDB cursor method '${node.callee.property.name}' is deprecated.`,
          });
        }

        // specific checks for deprecated bulk operations
        if (
          node.callee.type === 'MemberExpression' &&
            deprecatedBulkMethods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: `The MongoDB bulk operation method '${node.callee.property.name}' is deprecated. Use 'bulkWrite' instead.`,
          });
        }

        // checks for deprecated options
        if (
          node.callee.type === 'MemberExpression' &&
          ['find', 'findOne', 'aggregate'].includes(node.callee.property.name) &&
          node.arguments.length > 1 &&
          node.arguments[1].type === 'ObjectExpression'
        ) {
          const options = node.arguments[1].properties;
          const deprecatedOptions = ['fields', 'maxScan', 'snapshot', 'hint', 'explain'];

          options.forEach(option => {
            if (deprecatedOptions.includes(option.key.name)) {
              context.report({
                node: option,
                message: `The option '${option.key.name}' is deprecated in MongoDB queries.`,
              });
            }
          });
        }

      },
    };
  },
};
