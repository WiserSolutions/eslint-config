module.exports = {
  'extends': [
    '@wisersolutions',
    '@wisersolutions/eslint-config/react'
  ],
  'overrides': [
    {
      'files': ['cypress/**/*'],
      'extends': '@wisersolutions/eslint-config/cypress'
    },
    {
      'files': ['!cypress/**/*'],
      'extends': '@wisersolutions/eslint-config/jest'
    }
  ]
}