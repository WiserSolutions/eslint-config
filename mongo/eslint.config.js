const mongoDBv6DriverRule = require('./rules/mongodb-v6-driver-rule');
const mongoDBLegacyDriverRule = require('./rules/mongodb-legacy-driver-rule');

const ruleToRun = process.env.RULE_TO_RUN;

console.log(ruleToRun ? `Running rule: ${ruleToRun}` : 'Running all rules');

const allRules = {
  'custom/mongodb-v6-deprecated': 'error',
  'custom/mongodb-legacy-deprecated': 'warn', // maybe set this to 'error'
};

const rules = ruleToRun ? { [`custom/${ruleToRun}`]: allRules[`custom/${ruleToRun}`] } : allRules;

module.exports = 
  {
    files: ['**/*.js'],
    plugins: {
      custom: {
        rules: {
          'mongodb-v6-deprecated': mongoDBv6DriverRule,
          'mongodb-legacy-deprecated': mongoDBLegacyDriverRule,
        },
      },
    },
    rules
  };