

exports.printSwaggerElements = function printSwaggerElements(swaggerJson) {
    console.log('description: ' + swaggerJson.info.description);
    console.log('host: ' + swaggerJson.host);
    console.log('basePath: ' + swaggerJson.basePath);
    console.log('======paths:====== ');
    const paths = swaggerJson.paths;
    // console.log('paths: ' + JSON.stringify(paths))
    console.log(typeof (paths))

    for (const key in paths) {
        console.log('key: ' + key);
        console.log('value: ' + JSON.stringify(paths[key]))
    }

}


exports.swaggerToTestCases = function swaggerToTestCases(swaggerJson) {
    const paths = swaggerJson.paths;
    console.log(typeof (paths));
    const pet = paths['/pet'];
    let testCases = [];
    for (const operation in pet) {
        let currentOperation = pet[operation];
        let myTestCase = {};
        let request = {};
        let options = {};
        let preProcessers = [];
        let postProcessers = [];
        let validators = [];

        myTestCase.description = currentOperation.summary;
        myTestCase.tag = "v3"
        options.host = swaggerJson.host;
        options.port = "443";
        options.method = operation.toLocaleUpperCase();
        options.path = swaggerJson.basePath + '/pet';
        let headers = {};
        headers['User-Agent'] = 'node.js';
        headers['accept'] = currentOperation.consumes[0];
        headers['Content-Type'] = currentOperation.produces[0];
        options.headers = headers;
        request.body = createBody(currentOperation.parameters, swaggerJson);
        request.options = options;

        let validator = {
            "name": "statusCodeValidator",
            "validatorData": {
                "statusCode": 200
            }
        };
        validators.push(validator);

        myTestCase.request = request;
        myTestCase.postProcessers = postProcessers;
        myTestCase.preProcessers = preProcessers;
        myTestCase.validators = validators;
        testCases.push(myTestCase);
        // testCases.push(createTestCasesForGivenOperation(operation, currentOperation, swaggerJson))
    }
    return testCases;
}

function createTestCasesForGivenOperation(operation, currentOperation, swaggerJson) {
    let testCases = [];

    console.log('==================================================')
    console.log(JSON.stringify(testCases));

    return testCases;
}

function createBody(parameters, swaggerJson) {
    // let body = {
    //     "id": 0,
    //     "category": {
    //         "id": 0,
    //         "name": "string"
    //     },
    //     "name": "doggie",
    //     "photoUrls": [
    //         "string"
    //     ],
    //     "tags": [
    //         {
    //             "id": 0,
    //             "name": "string"
    //         }
    //     ],
    //     "status": "available"
    // };
    // return body;

    // parameters = JSON.parse(JSON.stringify(parameters));
    let body = {};
    console.log('parameters: ' + JSON.stringify(parameters));
    for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[0];
        console.log('parameter: ' + JSON.stringify(parameter));
        if (parameter.name.includes("body")) {
            let reference = parameter.schema['$ref'];
            console.log(`reference: ${reference}`);
            reference = reference.replaceAll('#/definitions/', '')
            console.log(`reference: ${reference}`);
            let myreferenceObject = swaggerJson.definitions[reference];
            console.log('myreferenceObject: ' + JSON.stringify(myreferenceObject));
            for (const property in myreferenceObject.properties) {
                let currentProperty = myreferenceObject.properties[property];
                if (currentProperty.type) {
                    if (currentProperty.type.includes('integer')) {
                        body[property] = 0;
                    } else if (currentProperty.type.includes('string')) {
                        if (currentProperty.enum) {
                            body[property] = currentProperty.enum[0];
                        } else if (currentProperty.example) {
                            body[property] = currentProperty.example;
                        }
                    } else if (currentProperty.type.includes('array')) {
                        if(currentProperty.items.type && currentProperty.items.type.includes('string')){
                            body[property] = [getRamdomString()];
                        }else if(currentProperty.items['$ref']){
                            // body[property] = getRamdomString();
                            // TODO: implement
                        }
                    } else if (currentProperty.type.includes('integer')) {
                        body[property] = 0;
                    }
                }
            }
        }
    }
    console.log(`body: ${JSON}`)
    return body;
}

function getRamdomString(){
    return Math.random().toString(36).slice(2, 7);
}
