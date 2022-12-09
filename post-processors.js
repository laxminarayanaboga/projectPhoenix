
const expect = require('chai').expect;
var dynamicValidators = [];

dynamicValidators['statusCodeValidator'] = function (validatorData, response) {
    console.log(`validatorData.statusCode: ${validatorData.statusCode}`);
    
    console.log(`response.statusCode: ${response.statusCode}`);
    expect(validatorData.statusCode).to.equal(response.statusCode);
}

exports.dynamicValidatorsFunctions = function dynamicValidatorsFunctions(validatorName, validatorData, response){
    dynamicValidators[validatorName](validatorData, response);
    
}
