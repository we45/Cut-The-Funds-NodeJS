const mongoose = require("mongoose");
const User = require("../db/user.model");
const conf = require("../config/config.dev");
const jwt = require("jsonwebtoken");
const pbk = require("pbkdf2");
const auth = require("./auth.controller");

// let validSuperUser = async (tokenHeader) => {
//     let validateJwt;
//     let validateRole;
//
//     let decoded = jwt.verify(tokenHeader, conf.secret);
//     if (decoded) {
//         console.log(decoded);
//         validateJwt = true;
//         await User
//             .findOne({email: decoded.user, isSuperAdmin: true})
//             .then(doc => {
//                 console.log(doc);
//                 validateRole = true;
//             })
//             .catch(err => {
//                 console.error(err);
//                 validateRole = false;
//             });
//
//         return {
//             tokenValid: validateJwt,
//             roleValid: validateRole
//         };
//     } else {
//         return {
//             tokenValid: null,
//             roleValid: null
//         };
//     }
// };

module.exports.authenticate = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let hashpass = pbk.pbkdf2Sync(password, conf.salt, 1, 32, 'sha512').toString('hex');
    User
        .findOne({email: email, password: hashpass})
        .then(doc => {
            console.log(doc);
            let authToken = jwt.sign({user: doc.email}, conf.secret, {expiresIn: 86400});
            res.status(200).json({auth: true, token: authToken})
        })
        .catch(err => {
            console.error(err);
            res.status(403).json({auth: false, message: "No access buddy!"});
        });
};

module.exports.userCreate = async (req, res) => {
    console.log(req.body.email, req.body.lastName, req.body.password);
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