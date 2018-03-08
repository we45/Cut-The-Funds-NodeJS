const conf = require("../config/config.dev");
const jwt = require("jsonwebtoken");
const pbk = require("pbkdf2");
const mongoose = require("mongoose");
const User = require("../db/user.model");

module.exports.validateSuperUser = async (tokenHeader) => {
    let validateJwt;
    let validateRole;

    let decoded = jwt.verify(tokenHeader, conf.secret);
    if (decoded) {
        console.log(decoded);
        validateJwt = true;
        await User
            .findOne({email: decoded.user, isSuperAdmin: true})
            .then(doc => {
                console.log(doc);
                validateRole = true;
            })
            .catch(err => {
                console.error(err);
                validateRole = false;
            });

        return {
            tokenValid: validateJwt,
            roleValid: validateRole
        };
    } else {
        return {
            tokenValid: null,
            roleValid: null
        };
    }
};

module.exports.validateManager = async (tokenHeader, action) => {
    let validateJwt;
    let validateRole;
    let managerId;

    let decoded = jwt.verify(tokenHeader, conf.secret);
    if (decoded) {
        validateJwt = true;
        await User
            .findOne({email: decoded.user, userType: "manager"})
            .then(doc => {
                if (conf.mgrPerms.indexOf(action) > -1) {
                    validateRole = true;
                    managerId = doc._id;
                }
            })
            .catch(err => {
                validateRole = false;
                managerId = null;
            });

        return {
            tokenValid: validateJwt,
            roleValid: validateRole,
            manager: managerId
        }
    } else {
        return {
            tokenValid: null,
            roleValid: null,
            manager: null
        };
    }

};