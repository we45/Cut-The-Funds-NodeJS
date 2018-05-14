const mongoose = require("mongoose");
const User = require("../db/user.model");
const conf = require("../config/config.dev");
const jwt = require("jsonwebtoken");
const pbk = require("pbkdf2");
const auth = require("./auth.controller");
const crypto = require("crypto");
const log = require("./logger");


module.exports.authenticate = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let hashpass = pbk.pbkdf2Sync(password, conf.salt, 1, 32, 'sha512').toString('hex');
    User
        .findOne({email: email, password: hashpass})
        .then(doc => {
            let authToken = jwt.sign({user: doc.email}, conf.secret, {expiresIn: 86400});
            res.status(200).json({auth: true, token: authToken, userType: doc.userType, email: doc.email})
            log.info(res)
            log.info(req)
        })
        .catch(err => {
            console.error(err);
            log.info(err);
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
                log.info(req)
                log.info(res)
            })
            .catch(err => {
                res.status(400).json({error: err})
                log.info(err)
            })
    } else {
        res.status(400).json({error: "not happening bro"})
    }

};

module.exports.createCard = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateUser(tokenHeader, "create_card");
    if (validObject.tokenValid && validObject.roleValid) {
        let cipher = crypto.createCipher('aes-128-ecb', 'd6F3Efeqd6F3Efeq');
        let encrypted = cipher.update(req.body.cardNumber, 'utf8', 'hex')
        encrypted += cipher.final('hex');
        User
            .update({_id: validObject.user}, {$push: {cards: encrypted}})
            .then(doc => {
                res.status(200).json(doc);
                log.info(req)
                log.info(res)
            })
            .catch(err => {
                res.status(400).json({error: err});
                log.info(err)
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
                log.info(req)
                log.info(res)
            })
            .catch(err => {
                res.status(400).json({error: err});
                log.info(err)
            })
    } else {
        res.status(403).json({error: "unauthorized"});
    }

};

module.exports.getProfile = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateManager(tokenHeader, "modify_project");
    if (validObject.tokenValid && validObject.roleValid) {
        User
            .findOne({_id: validObject.manager})
            .select({
                "firstName": true,
                "lastName": true,
                "email": true,
            })
            .then(doc => {
                res.status(200).json(doc);
                log.info(req)
                log.info(res)
            })
            .catch(err => {
                res.status(400).json({error: err});
                log.info(err)
            })
    } else {
        res.status(403).json({error: "unauthorized"});
    }
};