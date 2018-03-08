const mongoose = require("mongoose");
const conf = require("../config/config.dev");

mongoose
    .connect(conf.mongoUri)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch(err => {
        console.log("Database connection error");
    });
