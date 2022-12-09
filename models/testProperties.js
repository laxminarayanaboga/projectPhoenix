const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    method: String,
    path: String,
    queryParams: String,
    headers: [String],
    body: { type: Map }
})

const testCase = new Schema(
    {
        description: String,
        tag: String,
        request: {
            options: {
                host: String,
                port: String,
                method: String,
                path: String,
                queryParams: String,
                headers: { type: Map }
            },
            body: { type: Map }
        },
        preProcessers: [String],
        postProcessers: [String],
        validators: [{
            name: String,
            validatorData: { type: Map }
        }]
    },

    { collection: "testCase" }
);



module.exports = mongoose.model("testCase", testCase);
