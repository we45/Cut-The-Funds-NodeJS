const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let crypto = require("crypto");


const partnerSchema = new Schema({
    name: String,
    token: {
        type: String,
        default: crypto.randomBytes(Math.ceil(24/2)).toString('hex').slice(0,24)
    }
});

module.exports = mongoose.model("Partner", partnerSchema);