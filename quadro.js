const merge = require('lodash.merge')

const baseConfig = require('./index')

module.exports = merge({}, baseConfig, {
  'globals': {
    'Q': true
  },
  'overrides': [
    {
      'files': ['client/**/*.*'],
      'env': {
        'browser': true,
        'node': false
      }
    },
    {
      'files': ['client/**/*.test.js', 'client/test/**/*.*'],
      'env': {
        'jest': true
      },
      'rules': {
        'no-sparse-arrays': 'off'
      }
    },
    {
      'files': ['cypress/**/*.*'],
      'env': {
        'jasmine': true,
        'mocha': true
      },
      'globals': {
        'Cypress': true,
        'cy': true
      }
    },
    {
      'files': ['test/**/*.*'],
      'env': {
        'mocha': true
      },
      'globals': {
        'expect': true,
        'assert': true,
        'nock': true,
        'QT': true
      }
    }
  ]
})
