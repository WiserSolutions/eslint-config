const merge = require('lodash.merge')

const baseConfig = require('./index')

module.exports = merge({}, baseConfig, {
  'overrides': [
    {
      'files': ['**/*.test.js'],
      'env': {
        'jest': true
      }
    }
  ]
})
