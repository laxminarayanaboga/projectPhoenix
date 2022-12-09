const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    method: String,
    path: String,
    queryParams: String,
    headers: [String],
    body: { type: Map }
})

const testResult = new Schema(
    {
        status:String,
        date: {type: Date, default: new Date().toString()},
        errorTrace: String,
        testCaseId:Schema.Types.ObjectId
    },

    { collection: "testResult" }
);



module.exports = mongoose.model("testResult", testResult);
