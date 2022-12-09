const { httpsRequest } = require('./utils/v3')
const mongoose = require("mongoose");

const testCase = require("./models/testCase");
const testResult = require("./models/testResult");

var uri = "mongodb://127.0.0.1:27017/abcd";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

// Read the test cases from MongoDB for given criteria
// Iterate each test case
//  - get Read the request - path, query params, body, method
//  - Prepare httpoptions
//  - Fire the request and get response
//  - Run validations
//  - Upload results to MongoDB


const findTestCases = async () => {
    return await testCase.find({"tag":"v3"});
}

const saveTestResult = async (status, testCaseId, errorTrace) => {
    let testResultBody = [{
        status: status,
        errorTrace: errorTrace,
       testCaseId :testCaseId
      }]
    await testResult.insertMany(testResultBody);
}


var { dynamicValidatorsFunctions } = require('./post.processors');

myMainMethod();

async function myMainMethod() {
    // let testCases = getTestCases();
    let testCases = await findTestCases();
    console.log(`Number of test cases: ${testCases.length}`)
    for (const testCase of testCases) {
        let status = "passed", errorMessage = "";
        let testCaseObject = JSON.parse(JSON.stringify(testCase));
        try {
            let response = await sendRequestAndGetResponse(testCaseObject);
            runValidators(testCaseObject.validators, response);
        }
        catch (err) {
            status = "failed";
            errorMessage = "error: " + err;
        } finally { 
            saveTestResult(status,testCaseObject._id,errorMessage);
        }
    };
}

async function sendRequestAndGetResponse(testCaseObject) {
    let response = {};
    console.log(`testCaseObject.request.options: ` + testCaseObject.request.options);
    await httpsRequest(testCaseObject.request.options, testCaseObject.request.body, response);
    console.log(`responseBody: ${response.body}`);
    return response
}

function runValidators(validators, response) {
    for (let i = 0; i < validators.length; i++) {
        const validatorObject = validators[i];
        dynamicValidatorsFunctions(validatorObject.name, validatorObject.validatorData, response);
    }
}
