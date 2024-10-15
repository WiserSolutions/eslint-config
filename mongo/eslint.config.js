const mongoDeprecatedRule = require('./rules/mongo-deprecated-rule');
const mongodbLegacyRule = require('./rules/mongodb-legacy-rule');

const ruleToRun = process.env.RULE_TO_RUN;

console.log(ruleToRun ? `Running rule: ${ruleToRun}` : 'Running all rules');

const allRules = {
  'custom/mongo-deprecated': 'error',
  'custom/mongodb-legacy': 'warn', // maybe set this to 'error'?
};

const rules = ruleToRun ? { [`custom/${ruleToRun}`]: allRules[`custom/${ruleToRun}`] } : allRules;

module.exports = {
  plugins: {
    custom: {
      rules: {
        'mongo-deprecated': mongoDeprecatedRule,
        'mongodb-legacy': mongodbLegacyRule,
      },
    },
  },
  rules
};