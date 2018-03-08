const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const ObjectID = Schema.ObjectId;

var expenseFileSchema = new Schema({
    fileUri: String,
    description: String
});

var expenseSchema = new Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    amount: Number,
    reason: String,
    merchant: String,
    files: [expenseFileSchema],
    isApproved: {type: Boolean, default: false}
});

module.exports = mongoose.model("Expense", expenseSchema);