const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var couponSchema = new Schema({
    name: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    amount: Number,
    code: String
});

module.exports = mongoose.model("Coupon", couponSchema);