module.exports = {
  'extends': [
    '@wisersolutions',
    '@wisersolutions/eslint-config/react'
  ],
  'globals': {
    'Q': true
  },
  'overrides': [
    {
      'files': ['cypress/**/*'],
      'extends': '@wisersolutions/eslint-config/cypress'
    },
    {
      'files': ['client/**/*.*'],
      'env': {
        'browser': true,
        'node': false
      }
    },
    {
      'files': ['client/**/*.test.js', 'client/test/**/*.*'],
      'extends': '@wisersolutions/eslint-config/jest',
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
