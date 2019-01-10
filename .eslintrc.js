module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'mocha': true,
    'node': true
  },

  'plugins': [
    'chai-friendly'
  ],

  'rules': {
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2,
    'func-names': 0
  }
};
