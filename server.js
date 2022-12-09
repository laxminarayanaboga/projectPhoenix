const mongoose = require("mongoose");
const express = require("express");
const app = express();


const employees = require("./model");
const testCase = require("./models/testCase")
const testResult = require("./models/testResult");
const { printSwaggerElements, swaggerToTestCases } = require("./utils/swagger.process");
const router = express.Router();
const port = 4000;

var uri = "mongodb://127.0.0.1:27017/abcd";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

app.use(express.json());
app.use("/", router);

app.listen(port, function () {
    console.log("Server is running on Port: " + port);
});


router.route("/fetchdata").get(function (req, res) {
    employees.find({}, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

router.route("/fetchTestCase").get(function (req, res) {
    testCase.find({}, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            printTestCaseData(result);
            res.send(result);
        }
    });
});

function printTestCaseData(result1) {
    console.log(typeof result1);
    let result = result1[0];

    console.log("result:::" + JSON.stringify(result))
    // console.log(`result.request: ${result1.request}`);
    // let result = JSON.stringify(result1);

    // let result = result1.toJSON();
    console.log(`validators: ${result.validators}`);
    console.log(`request: ${result.request}`);
    // console.log(`method: ${result.request.method}`);
    console.log(`options: ${result.request.options}`);
    console.log(`queryParams: ${result.request.queryParams}`);
    console.log(`headers: ${result.request.headers}`);
    console.log(`body: ${result.request.body}`);
    console.log(`preProcessers: ${result.preProcessers}`);
    console.log(`postProcessers: ${result.postProcessers}`);

}

router.post('/insertdata', (req, res) => {
    console.log("req::::" + JSON.stringify(req.body))
    employees.insertMany(req.body, function (err, result) {

        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});


router.post('/insertSampleTestResult', (req, res) => {
    console.log("req::::" + JSON.stringify(req.body))
    testResult.insertMany(req.body, function (err, result) {

        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});


router.route("/executeTestCases").get(async function (req, res) {
    let testCases = await getTestCases();
    console.log(testCases);
    res.send(testCases);
});

async function getTestCases(){
    let tests;
    await testCase.find({}, async function (err, result) {
        if (err) {
            res.send(err);
        } else {
            tests = await result;
            // return result;
            // res.send(result);
        }
    });
    return tests;
}


router.post('/generateTestCases', async (req, res) => {
    console.log("requestParams::::" + JSON.stringify(req.body.requestParams));
    const swaggerJson = req.body.swagger;

    // printSwaggerElements(swaggerJson)
    const myResponse = {
        "request":"In Process"
    }
    let testCases = swaggerToTestCases(swaggerJson);
    await testCase.insertMany(testCases);
    res.send(testCases);
});
