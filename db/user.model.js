const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    cardNumber: String,
    cardBrand: String,
    isDefault: {type: Boolean, default: false}
});

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v)
            },
            message: "{VALUE} is not a valid email"
        }
    },
    password: {type: String, required: true},
    createdOn: {type: Date, default: Date.now},
    isSuperAdmin: {type: Boolean, default: false},
    cards: [cardSchema],
    userType: {type: String, enum: ['manager', 'user']}

});

module.exports = mongoose.model("User", userSchema, 'user');