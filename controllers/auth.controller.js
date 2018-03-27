const conf = require("../config/config.dev");
const jwt = require("jsonwebtoken");
const pbk = require("pbkdf2");
const mongoose = require("mongoose");
const User = require("../db/user.model");

module.exports.validateSuperUser = async (tokenHeader) => {
    let validateJwt;
    let validateRole;
    try {
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
    } catch (err) {
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
    try {
        let decoded = jwt.verify(tokenHeader, conf.secret);
        console.log(decoded);
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
    } catch (err) {
        return {
            tokenValid: null,
            roleValid: null,
            manager: null,
        };
    }


};

module.exports.validateUser = async (tokenHeader, action) => {
    let validateJwt;
    let validateRole;
    let userId;
    try {
        let decoded = jwt.verify(tokenHeader, conf.secret);
        if (decoded) {
            validateJwt = true;
            await User
                .findOne({email: decoded.user, userType: "user"})
                .then(doc => {
                    if (conf.userPerms.indexOf(action) > -1) {
                        validateRole = true;
                        userId = doc._id;
                    }
                })
                .catch(err => {
                    validateRole = false;
                    userId = null;
                });

            return {
                tokenValid: validateJwt,
                roleValid: validateRole,
                user: userId
            }
        } else {
            return {
                tokenValid: null,
                roleValid: null,
                user: null
            };
        }
    } catch (err) {
        return {
            tokenValid: null,
            roleValid: null,
            user: null
        };
    }


};

module.exports.justAuthenticate = async (tokenHeader) => {
    let validateJwt;
    let userId;
    let userType;
    try {
        let decoded = jwt.verify(tokenHeader, conf.secret);
        if (decoded) {
            validateJwt = true;
            await User
                .findOne({email: decoded.user})
                .then(doc => {
                    userId = doc._id
                    userType = doc.userType;
                })
                .catch(err => {
                    userId = null;
                    userType = null;
                });

            return {
                tokenValid: validateJwt,
                user: userId,
                userType: userType
            }
        } else {
            return {
                tokenValid: null,
                user: null,
                userType: null
            };
        }
    } catch (err) {
        return {
            tokenValid: null,
            user: null,
            userType: userType
        };
    }
}