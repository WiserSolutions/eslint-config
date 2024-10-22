const deprecatedCollectionMethods = [
  'insert',
  'update',
  'remove',
  'removeOne',
  'save',
  'findAndModify',
  'findAndRemove',
  'ensureIndex',
  'dropAllIndexes',
  'reIndex',
  'count',
  'group',
  'mapReduce',
  'geoNear',
  'geoHaystackSearch',
  'parallelCollectionScan'
];

const mongoDBLegacySupportedCollectionMethods = [
  'save',
  'findAndModify',
  'findAndRemove',
  'ensureIndex',
  'count',
  'dropAllIndexes',
  'reIndex',
];

const deprecatedConnectionMethods = [
  'connect',
  'connectAsync',
  'open',
  'openAsync',
  'isConnected',
];

const mongoDBLegacySupportedConnectionMethods = [
  'connect',
  'connectAsync',
  'open',
  'openAsync',
  'isConnected',
];

const deprecatedConstructors = [
  'GridStore',
  'ObjectId',
  'Binary',
];

const mongodbLegacySupportedConstructors = [
];

const deprecatedDBMethods = [
  'addUser',
  'collStats',
  'eval',
  'authenticate',
  'logout',
];

const mongoDBLegacySupportedDBMethods = [
  'authenticate',
  'logout',
];

const deprecatedCursorMethods = [
  'nextObject',
  'explain',
  'each',
  'maxScan',
  'snapshot',
];

const mongoDBLegacySupportedCursorMethods = [
  'nextObject',
  'explain',
  'each',
  'maxScan',
  'snapshot',
];

const deprecatedBulkOpInitializations = [
  'initializeOrderedBulkOp',
  'initializeUnorderedBulkOp'
];

const
 mongoDBLegacySupportedBulkOpInitializations = [
    'initializeOrderedBulkOp',
    'initializeUnorderedBulkOp'
];

const deprecatedBulkOps = [
  // 'update' is included in deprecatedCollectionMethods
  'updateOne',
  'updateMany',
  'delete',
  'deleteOne',
  'deleteMany',
]

const mongoDbLegacySupportedBulkOps = [
  // 'update' bulk op mongodb-legacy scenario is handled by rules.collectionMethodUsesDeprecatedSyntax
  'updateOne',
  'updateMany',
  'delete',
  'deleteOne',
  'deleteMany',
];

const deprecatedQueryOptions = [
  'fields',
  'maxScan',
  'snapshot',
];

const mongoDBLegacySupportedQueryOptions = [
  'fields',
  'maxScan',
  'snapshot',
];

// Currently not used
const allQueryMethods = [
'find',
'findOne',
'insertOne',
'insertMany',
'updateOne',
'updateMany',
'replaceOne',
'deleteOne',
'deleteMany',
'aggregate',
'countDocuments',
'estimatedDocumentCount',
'distinct',
'findOneAndUpdate',
'findOneAndReplace',
'findOneAndDelete',
'bulkWrite',
'watch',
'mapReduce',
'createIndex',
'dropIndex',
'dropIndexes',
'listIndexes',
'stats',
'rename',
'drop',
'isCapped',
'options',
'createBulkOp',
];

module.exports = {
  deprecatedMethods: [
    deprecatedCollectionMethods,
    deprecatedConnectionMethods,
    deprecatedConstructors,
    deprecatedDBMethods,
    deprecatedCursorMethods,
    deprecatedBulkOpInitializations,
    deprecatedBulkOps,
    deprecatedQueryOptions,
  ],
  mongoDBLegacySupportedMethods: [
    mongoDBLegacySupportedCollectionMethods,
    mongoDBLegacySupportedConnectionMethods,
    mongodbLegacySupportedConstructors,
    mongoDBLegacySupportedDBMethods,
    mongoDBLegacySupportedCursorMethods,
    mongoDBLegacySupportedBulkOpInitializations,
    mongoDbLegacySupportedBulkOps,
    mongoDBLegacySupportedQueryOptions,
  ],
  // Currently not used
  allQueryMethods,
}