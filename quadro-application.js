module.exports = {
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
}
