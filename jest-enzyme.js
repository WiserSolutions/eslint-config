const merge = require('lodash.merge')

const baseConfig = require('./jest')

module.exports = merge({}, baseConfig, {
  'overrides': [
    {
      'files': ['**/*.test.js'],
      'globals': {
        'React': true,
        'shallow': true,
        'mount': true,
        'render': true
      }
    }
  ]
})
