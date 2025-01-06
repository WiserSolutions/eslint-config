const mongoDBv6DriverRule = require('./rules/mongodb-v6-driver-rule');
const mongoDBLegacyDriverRule = require('./rules/mongodb-legacy-driver-rule');

const ruleToRun = process.env.RULE_TO_RUN;

console.log(ruleToRun ? `Running rule: ${ruleToRun}` : 'Running all rules');

const allRules = {
  'mongo/mongodb-v6-deprecated': 'error',
  'mongo/mongodb-legacy-deprecated': 'warn', // maybe set this to 'error'
};

const rules = ruleToRun ? { [`mongo/${ruleToRun}`]: allRules[`mongo/${ruleToRun}`] } : allRules;

module.exports = 
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: require('@babel/eslint-parser'),
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          globalReturn: true,
          impliedStrict: true,
        },
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env']
        }
      }
    },
    plugins: {
      mongo: {
        rules: {
          'mongodb-v6-deprecated': mongoDBv6DriverRule,
          'mongodb-legacy-deprecated': mongoDBLegacyDriverRule,
        },
      },
    },
    rules
  };