'use strict'

const service = require('./service');

console.log('---Starting test for the Västtrafik service---');

service.getNextCommute('57.69704539999999', '11.979382999999984').then(function(result) {
  console.log('Results for searching on Götaplatsen:\n', result);
});
