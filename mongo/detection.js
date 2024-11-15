/**
 * Determines if the current code context is MongoDB-related by checking for:
 * 1. MongoDB-related imports/requires
 * 2. Database-related parameter names in function definitions
 * 3. Deal with function exports that have DB types of names as params
 *
 * @param {Object} context - The ESLint context object
 * @param {Object} node - The AST node being examined
 * @returns {boolean} - True if MongoDB context is detected
 */
const isMongoDBContext = (context, node) => {

  // debug logging setup - use if you're wondering whether this detection is working:
  // MONGO_LINT_DEBUG=true npx eslint <file with path to run against>
  const DEBUG = process.env.MONGO_LINT_DEBUG === 'true' || false;
  const log = (...args) => DEBUG && console.log('[MongoDB Linter]', ...args);

  let hasMongoImport = false;
  let hasDatabaseParam = false;

  log('Checking file:', context.getFilename());
  log('Node type:', node.type);

  // check if a param name suggests a database
  // TODO: add more to this as discovered in our code
  const isDatabaseParam = (param) => {
    const dbNames = ['db', 'database', 'mongo', 'mongodb', 'mongoose'];
    for (const name of dbNames) {
      if (param.toLowerCase().includes(name.toLowerCase())) {
        log(`Found DB parameter "${param}" matching pattern "${name}"`);
        return true;
      }
    }
    return false;
  };

  // check for requires, including destructured requires
  if (node.type === 'VariableDeclaration') {
    node.declarations.forEach(decl => {
      // handle destructured require, e.g. const { MongoClient } = require('mongodb')
      if (decl.init?.type === 'CallExpression' &&
        decl.init.callee.name === 'require' &&
        (decl.init.arguments[0]?.value === 'mongodb' ||
          decl.init.arguments[0]?.value === 'mongodb-legacy')) {
        hasMongoImport = true;
        log('Found MongoDB require (destructured):', decl.init.arguments[0].value);
      }
    });
  }

  // check for direct requires, e.g. const mongodb = require('mongodb')
  if (node.type === 'CallExpression' &&
    node.callee.name === 'require') {
    const arg = node.arguments[0];
    if (arg?.value === 'mongodb' || arg?.value === 'mongodb-legacy') {
      hasMongoImport = true;
      log('Found MongoDB require (direct):', arg.value);
    }
  }

  // check for imports
  if (node.type === 'ImportDeclaration') {
    const source = node.source.value;
    if (source === 'mongodb' || source === 'mongodb-legacy') {
      hasMongoImport = true;
      log('Found MongoDB import:', source);
    }
  }

  // check function parameters
  if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)) {
    if (node.params) {
      hasDatabaseParam = node.params.some(param =>
        param.type === 'Identifier' && isDatabaseParam(param.name)
      );
    }
  }

  // handle module.exports = function(...)
  // e.g. a lot of these in shelvspace Parse code
  if (node.type === 'AssignmentExpression' || node.type === 'ExpressionStatement') {
    log('Examining potential module.exports:', {
      nodeType: node.type,
      expression: node.type === 'ExpressionStatement' ? node.expression?.type : 'N/A',
      left: node.left?.type || node.expression?.left?.type,
      right: node.right?.type || node.expression?.right?.type,
      isModuleExports: node.left?.object?.name === 'module' || node.expression?.left?.object?.name === 'module'
    });

    // get the actual function node, whether it's direct or in an expression
    const functionNode = node.right || node.expression?.right;
    if (functionNode?.type === 'FunctionExpression' && functionNode.params) {
      log('Found function params:', functionNode.params.map(p => p.name));
      hasDatabaseParam = functionNode.params.some(param =>
        param.type === 'Identifier' && isDatabaseParam(param.name)
      );
    }
  }

  const result = hasMongoImport || hasDatabaseParam;
  log('MongoDB context detection result:', result);
  return result;
};

module.exports = {
  isMongoDBContext
};
