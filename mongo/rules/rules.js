const requireStatementDoesNotUseDesctructuring = (memberExpressionNode) => {
    return (
    memberExpressionNode.object.type === 'CallExpression' &&
    memberExpressionNode.object.callee.name === 'require' &&
    memberExpressionNode.property?.name === 'MongoClient' &&
    memberExpressionNode.object.arguments[0].value.substring(0, 7) === 'mongodb'
    );
};

const collectionMethodUsesDeprecatedSyntax = (memberExpressionNode, deprecatedMethods) => {
  const usesDeprecatedMethod =
    memberExpressionNode.object.type === 'CallExpression' &&
    memberExpressionNode.property.type === 'Identifier' &&
    deprecatedMethods.includes(memberExpressionNode.property.name);

  const isChainedToBulkOp = memberExpressionNode.object?.callee?.property?.name === 'find';
  const isInsert = memberExpressionNode.property?.name === 'insert';
  const bulkRegex = /^(.*bulk.*|.*ops.*)$/i;
  const isLegacyBulk = bulkRegex.test(memberExpressionNode.object?.name);
  const isBulkInsert = isInsert && isLegacyBulk;

  return {
    deprecatedCollectionMethodChainedToBulkOp: usesDeprecatedMethod && isChainedToBulkOp,
    deprecatedCollectionMethod: usesDeprecatedMethod && !isChainedToBulkOp,
    isBulkInsert
  }
};

const connectionMethodUsesDeprecatedSyntax = (memberExpressionNode, deprecatedMethods) => {
  return (
    memberExpressionNode.object.type === 'Identifier' &&
    memberExpressionNode.object.name === 'MongoClient' &&
    deprecatedMethods.includes(memberExpressionNode.property.name)
  );
};

const constructorUsesDeprecatedSyntax = (newExpressionNode, deprecatedConstructors) => {
  return (
    newExpressionNode.callee.type === 'Identifier' &&
    deprecatedConstructors.includes(newExpressionNode.callee.name)
  );
};

const dbMethodUsesDeprecatedSyntax = (memberExpressionNode, deprecatedMethods) => {
  const dbRegex = /^.*db$/i;
  return (
    (
      (memberExpressionNode.object.type === 'Identifier' && dbRegex.test(memberExpressionNode.object.name)) ||
      (memberExpressionNode.object.type === 'MemberExpression' && dbRegex.test(memberExpressionNode.object.property.name)) ||
      (memberExpressionNode.object.property && memberExpressionNode.object?.property.type === 'Identifier' && dbRegex.test(memberExpressionNode.object.property.name))
    ) &&
    deprecatedMethods.includes(memberExpressionNode.property.name));
};

const cursorMethodUsesDeprecatedSyntax = (callExpressionNode, deprecatedMethods) => {
  const batchSizesNotSupported = [0];
  if (
    callExpressionNode.callee.type === 'MemberExpression' &&
    (callExpressionNode.arguments && callExpressionNode.callee.object?.name === 'cursor') ||
    (callExpressionNode.callee.object?.arguments && callExpressionNode.callee.object?.arguments[0]?.type === 'ObjectExpression')
  ) {
      if (callExpressionNode.callee?.property?.name === 'batchSize' &&
        batchSizesNotSupported.includes(callExpressionNode?.arguments[0]?.value)
      ) return `batchSize(${callExpressionNode?.arguments[0]?.value})`;
      else return deprecatedMethods.includes(callExpressionNode.callee?.property?.name);
    } 
};

const bulkOpInitializationUsesDeprecatedSyntax = (memberExpressionNode, deprecatedMethods) => {
  return (
    memberExpressionNode.object.type === 'CallExpression' &&
    memberExpressionNode.property.type === 'Identifier' &&
    deprecatedMethods.includes(memberExpressionNode.property.name)
  );
};

const bulkOpUsesDeprecatedSyntax = (memberExpressionNode, deprecatedMethods) => {
  return (
    memberExpressionNode.object?.callee?.property?.name === 'find' &&
    memberExpressionNode.object.type === 'CallExpression' &&
    memberExpressionNode.property.type === 'Identifier' &&
    deprecatedMethods.includes(memberExpressionNode.property.name)
  );
};

const queryOptionUsesDeprecatedSyntax = (callExpressionNode, deprecatedOptions) => {
  const options = [];
  if (
    callExpressionNode.callee.type === 'MemberExpression' &&
    ['find', 'findOne', 'aggregate'].includes(callExpressionNode.callee.property.name) &&
    callExpressionNode.arguments.length > 1 &&
    callExpressionNode.arguments[1].type === 'ObjectExpression'
  ) {
    callExpressionNode.arguments[1].properties.forEach(option => {
      if (deprecatedOptions.includes(option.key.name)) {
        options.push(option);
      }
    });
  }
  return options;
};

const queryUsesCallbackAPI = (callExpressionNode, queryMethods) => {
  const methodsToIgnore = ['get', 'post', 'put', 'delete', 'patch', 'scroll', 'upload'];
  const calleesToIgnore = ['router', 'async', 's3', 'lambda', 'utils', 'sns', 'cache', 'sqs', 'cy', '$'];

  // check for a valid callee with the right structure
  if (!callExpressionNode?.callee?.property?.name ||
    !callExpressionNode.callee.type === 'MemberExpression' ||
    !callExpressionNode.callee.property.type === 'Identifier') {
    return false;
  }

  // early return for array methods to avoid false positives
  if (callExpressionNode.callee.property.name === 'forEach' &&
    callExpressionNode.callee.object?.type === 'MemberExpression' &&
    callExpressionNode.callee.object?.property?.name === 'els') {
    return false;
  }

  const objectName = callExpressionNode.callee.object?.name;
  const propertyName = callExpressionNode.callee.property?.name;

  if (objectName &&
    !calleesToIgnore.includes(objectName) &&
    propertyName &&
    !methodsToIgnore.includes(propertyName) &&
    callExpressionNode.arguments?.length
  ) {
    const firstArg = callExpressionNode.arguments[0];
    const lastArg = callExpressionNode.arguments[callExpressionNode.arguments.length - 1];
    if (!firstArg || !lastArg) return false;

    // check if this is actually a MongoDB method
    const isMongoMethod = queryMethods.includes(propertyName);

    return (
      isMongoMethod && (
        ((firstArg.type === 'ObjectExpression' && firstArg.properties) || firstArg.name === 'query') &&
        (lastArg.type === 'ArrowFunctionExpression' || lastArg.type === 'FunctionExpression' || lastArg.name === 'cb')
      )
    );
  }
  return false;
}

const cursorUsesCallbackAPI = (callExpressionNode, cursorMethods) => {
  if (
    callExpressionNode.callee.type === 'MemberExpression' &&
    callExpressionNode.callee.property.type === 'Identifier' &&
    cursorMethods.includes(callExpressionNode.callee.property.name)
  ) {
    if (!callExpressionNode.arguments || !callExpressionNode.arguments.length) return false;
    else {
      const firstArg = callExpressionNode.arguments[0];
      return firstArg.type === 'ArrowFunctionExpression' || firstArg.type === 'FunctionExpression' || firstArg.name === 'cb';
    }
  }
};

module.exports = {
  requireStatementDoesNotUseDesctructuring,
  collectionMethodUsesDeprecatedSyntax,
  connectionMethodUsesDeprecatedSyntax,
  constructorUsesDeprecatedSyntax,
  dbMethodUsesDeprecatedSyntax,
  cursorMethodUsesDeprecatedSyntax,
  bulkOpInitializationUsesDeprecatedSyntax,
  bulkOpUsesDeprecatedSyntax,
  queryOptionUsesDeprecatedSyntax,
  queryUsesCallbackAPI,
  cursorUsesCallbackAPI
};