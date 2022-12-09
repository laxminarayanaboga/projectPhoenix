const https = require('https');

exports.httpsRequest = async function httpsRequest(options, data, returnResponse) {
    return new Promise(async (resolve, reject) => {
        const body = [];
        const req = https.request(options, res => {
            console.log('httpsPost statusCode:', res.statusCode);
            console.log('httpsPost headers:', res.headers);

            res.on('data', d => {
                body.push(d);
            });
            res.on('end', () => {
                console.log(`${options.method} httpsPost data: ${body}`);
                resolve(JSON.parse(Buffer.concat(body).toString()));
                // resolve("{'name': 'jason'}");
                returnResponse.statusCode = res.statusCode;
                returnResponse.headers = res.headers;
                returnResponse.body = body;
                return body;
            });
        });
        req.on('error', e => {
            // console.log(`ERROR httpsPost: ${e}`);
            reject(e);
        });
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();

    });

}

// async function testFunction() {
//     let myResponse = await httpsPost(httpPostOptions, samplePostPayload);
//     console.log('myResponse: ' + JSON.stringify(myResponse));
//     console.log('myResponse.status: ' + myResponse.status);
//     await httpsPost(httpGetOptions);
//     await httpsPost(httpPutOptions, samplePutPayload);
// }

// testFunction();
