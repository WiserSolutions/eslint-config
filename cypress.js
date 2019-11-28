module.exports = {
  'overrides': [
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
    }
  ]
}
