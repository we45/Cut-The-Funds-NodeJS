const mongoose = require("mongoose");
const User = require("../db/user.model");
const conf = require("../config/config.dev");
const jwt = require("jsonwebtoken");
const pbk = require("pbkdf2");
const auth = require("./auth.controller");

module.exports.authenticate = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let hashpass = pbk.pbkdf2Sync(password, conf.salt, 1, 32, 'sha512').toString('hex');
    User
        .findOne({email: email, password: hashpass})
        .then(doc => {
            console.log(doc);
            let authToken = jwt.sign({user: doc.email}, conf.secret, {expiresIn: 86400});
            res.status(200).json({auth: true, token: authToken, userType: doc.userType, email: doc.email})
        })
        .catch(err => {
            console.error(err);
            res.status(403).json({auth: false, message: "No access buddy!"});
        });
};

module.exports.userCreate = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateSuperUser(tokenHeader);
    if (validObject.tokenValid && validObject.roleValid) {
        User.create({
            firstName:req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: pbk.pbkdf2Sync(req.body.password, conf.salt, 1, 32, 'sha512').toString('hex'),
            userType: req.body.userType
        })
            .then(doc => {
                res.status(201).json({user: doc._id})
            })
            .catch(err => {
                res.status(400).json({error: err})
            })
    } else {
        res.status(400).json({error: "not happening bro"})
    }

};

module.exports.createCard = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateUser(tokenHeader, "create_card");
    if (validObject.tokenValid && validObject.roleValid) {
        User
            .update({_id: validObject.user}, {$push: {cards: req.body.cardNumber}})
            .then(doc => {
                res.status(200).json(doc);
            })
            .catch(err => {
                res.status(400).json({error: err});
            })
    } else {
        res.status(403).json({error: "unauthorized"});
    }
};

module.exports.listCards = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateUser(tokenHeader, "create_card");
    if (validObject.tokenValid && validObject.roleValid) {
        User
            .findOne({_id: validObject.user})
            .select({
                "cards": true,
                "firstName": true,
                "lastName": true,
                "email": true,
            })
            .then(doc => {
                res.status(200).json(doc);
            })
            .catch(err => {
                res.status(400).json({error: err});
            })
    } else {
        res.status(403).json({error: "unauthorized"});
    }

};