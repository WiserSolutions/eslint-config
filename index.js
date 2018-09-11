module.exports = {
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true
    },
    'ecmaVersion': 7,
    'sourceType': 'module'
  },
  'parser': 'babel-eslint',
  'env': {
    'node': true,
    'es6': true
  },
  'rules': {
    'arrow-body-style': ['error', 'as-needed'],
    'semi': ['error', 'never'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always' // Prettier
    }]
  }
}
