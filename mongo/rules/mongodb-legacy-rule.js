module.exports = {
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'mongodb-legacy') {
          context.report({
            node,
            message: 'Using mongodb-legacy package. Be aware of potential compatibility issues with newer MongoDB features.',
          });
        }
      },
      CallExpression(node) {
        // Methods that are truly deprecated and not supported by mongodb-legacy
        const fullyDeprecatedMethods = [
          'geoNear', 'geoHaystackSearch', 'group', 'eval', 'parallelCollectionScan'
        ];

        // Methods that are deprecated but supported by mongodb-legacy
        const legacySupportedMethods = [
          'insert', 'update', 'remove', 'save', 'findAndModify', 'findAndRemove',
          'ensureIndex', 'dropAllIndexes', 'reIndex', 'authenticate', 'logout'
        ];

        // Connection methods that are handled differently in newer versions
        const connectionMethods = ['connect', 'connectAsync', 'open', 'openAsync'];

        // Check for fully deprecated methods
        if (
          node.callee.type === 'MemberExpression' &&
          fullyDeprecatedMethods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: `The MongoDB method '${node.callee.property.name}' is deprecated and not supported by mongodb-legacy.`,
          });
        }

        // Warn about legacy-supported methods
        if (
          node.callee.type === 'MemberExpression' &&
          legacySupportedMethods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: `The MongoDB method '${node.callee.property.name}' is deprecated but supported by mongodb-legacy. Consider updating to newer methods for future compatibility.`,
          });
        }

        // Check for connection methods
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'MongoClient' &&
          connectionMethods.includes(node.callee.property.name)
        ) {
          context.report({
            node,
            message: `The MongoDB connection method '${node.callee.property.name}' is handled differently in newer versions. Review the current best practices for establishing connections.`,
          });
        }

        // Check for deprecated options in queries
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
                message: `The option '${option.key.name}' is deprecated in MongoDB queries. Check mongodb-legacy documentation for supported options.`,
              });
            }
          });
        }
      },
    };
  },
};
