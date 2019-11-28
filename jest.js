module.exports = {
  'extends': [
    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  'rules': {
    'jest/expect-expect': 'off' // doesn't support helpers that perform the assertions internally (e.g. `checkSnapshot`)
  }
}
