const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: String,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    limit: Number,
    remarks: String
});

module.exports = mongoose.model("Project", projectSchema);