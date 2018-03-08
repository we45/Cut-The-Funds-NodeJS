const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var projectSchema = new Schema({
    name: String,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    limit: Number,
});

module.exports = mongoose.model("Project", projectSchema);