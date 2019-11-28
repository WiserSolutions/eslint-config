module.exports = {
  'extends': [
    'eslint:recommended',
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
    'no-shadow': 'error', // shadowing is an easy way to let babel/webpack make mistakes
    'prefer-const': 'error',
    'semi': ['error', 'never'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always' // Prettier
    }]
  }
}
