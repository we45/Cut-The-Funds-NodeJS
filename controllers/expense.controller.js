const mongoose = require("mongoose");
const Expense = require("../db/expense.model");
const Project = require("../db/project.model");
const auth = require("./auth.controller");
const conf = require("../config/config.dev");
const randomstring = require("randomstring");
const path = require("path");
const jwt = require("jsonwebtoken");
const yaml = require('js-yaml');

module.exports.createExpense = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateUser(tokenHeader, "create_expense");
    console.log(validObject);
    if (validObject.tokenValid && validObject.roleValid) {
        await Project.findById(req.body.projectId)
            .then(doc => {
                console.log(doc);
                if (req.body.amount <= doc.limit) {
                    Expense.create({
                        name: req.body.name,
                        user: mongoose.Types.ObjectId(validObject.user),
                        project: mongoose.Types.ObjectId(doc._id),
                        amount: req.body.amount,
                        reason: req.body.reason,
                        merchant: req.body.merchant
                    })
                        .then(expdoc => {
                            res.status(201).json({expense: expdoc._id, message: "successfully saved"})
                        })
                        .catch(err => {
                            res.status(400).json({error: err})
                        })
                } else {
                    res.status(400).json({error: "Amount exceeds allowed amount"});
                }
            })

    } else {
        res.status(403).json({error: "not authorized"})
    }
};

module.exports.projectExpenses = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateManager(tokenHeader, "approve_expense");
    try {
        if (validObject.tokenValid && validObject.roleValid) {
            let projectId = req.params.projectId;
            Expense
                .find({project: projectId})
                .select({
                    'name': true,
                    'amount': true,
                    'reason': true,
                    'merchant': true,
                    'isApproved':true,
                })
                .then(doc => {
                    res.status(200).json(doc)
                })
                .catch(err => {
                    res.status(400).json({error: err})
                })
        } else {
            res.status(403).json({error: "not authorized"})
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
};

module.exports.getMyExpenses = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateUser(tokenHeader, "view_expense");
    console.log(validObject);
    try {
        if (validObject.tokenValid && validObject.roleValid) {
            Expense
                .find({user: validObject.user})
                .then(doc => {
                    console.log(doc);
                    res.status(200).json(doc);
                })
                .catch(err => {
                    res.status(400).json({error: err})
                })

        } else {
            res.status(403).json({error: "not authorized"})
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
};

module.exports.addExpenseFile = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateUser(tokenHeader, "create_expense");
    try {
        if (validObject.tokenValid && validObject.roleValid) {
            let expObj = req.params.expId;
                let uploadFile = req.files.expenseFile;
                let fileExt = path.extname(uploadFile.name);
            let randFileName = randomstring.generate({length: 10, charset: "alphabetic"});
            let desc = req.body.description;
            let fullPath = "../uploads" + randFileName + fileExt;
            uploadFile.mv(fullPath, function (err) {
                if (err) {
                    res.status(400).json({error: err})
                }

            });
            let fileData = {fileUri: fullPath, description: desc}
            await Expense
                .update({_id: expObj}, {$push: {files: fileData}})
                .then(doc => {
                    res.status(200).json({status: "expense file uploaded"})
                })
                .catch(err => {
                    res.status(400).json({error: err})
                })

        } else {
            res.status(403).json({error: "unauthorized"});
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
};

module.exports.updateExpense = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateUser(tokenHeader, "create_expense");
    try {
        if (validObject.tokenValid && validObject.roleValid) {
            let expObj = req.params.expId;
            Expense
                .findByIdAndUpdate(expObj, req.body, {new: true})
                .then(doc => {
                    res.status(200).json(doc)
                })
                .catch(err => {
                    res.status(400).json({error: err})
                })
        } else {
            res.status(403).json({error: "not authorized"})
        }
    } catch (err) {
        res.status(400).json({error: err})
    }
};

module.exports.approveExpense = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateManager(tokenHeader, "approve_expense");
    try {
        if (validObject.tokenValid && validObject.roleValid) {
            let expObj = req.params.expId;
            await Expense
                .update({_id: expObj}, {isApproved: true}, {new: true})
                .then(doc => {
                    res.status(200).json({status: "approved expense"})
                })
                .catch(err => {
                    res.status(400).json({error: err})
                })

        } else {
            res.status(403).json({error: "unauthorized"});
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
};

module.exports.getSingleExpense = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = jwt.decode(tokenHeader);
    try {
        if (validObject) {
        let expObj = req.params.expId;
        Expense
            .findOne({_id: expObj})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(400).json({error: err})

            })
        } else {
            res.status(403).json({error: "unauthorized"});
        }
    } catch (nerr) {
        res.status(400).json({error: nerr});
    }
};

module.exports.yamlExpensePost = async (req, res) => {
    // let tokenHeader = req.header("Authorization");
    // let validObject = jwt.decode(tokenHeader);
    try {
        // if (validObject) {
        let yamlExpense = req.files.yamlExpense;
        let ybuf = yamlExpense.data;
        let ystring = ybuf.toString();

        let y = yaml.load(ystring);
        console.log("Hello".toString());
        res.status(200).json(y);
        // } else {
        //     res.status(403).json({error: "Invalid access attempt"});
        // }
    } catch (err) {
        console.log(err);
        res.status(400).json({error: err});
    }
};

module.exports.getStats = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.justAuthenticate(tokenHeader);
    if (validObject.tokenValid) {
        console.log(validObject);
        let approvedUnApproved;
        let expByReason;
        if (validObject.userType === 'user') {
            let approved;
            let total;
            await Expense.count({user: validObject.user, isApproved: true})
                .then(doc => {
                    approved = doc;
                    console.log("Approved: " + approved)
                })
                .catch(err => {
                    res.status(400).json({error: err})
                });

            await Expense.count({user: validObject.user})
                .then(doc => {
                    total = doc;
                    console.log(total);
                })
                .catch(err => {
                    res.status(400).json({error: err})
                });
            //
            await Expense.aggregate([{$match: {user: validObject.user}},{$group: {_id: '$reason', total: {$sum: '$amount'}}}, {$sort: {total: -1}}])
                .then(doc => {
                    expByReason = doc;
                    console.log(expByReason);
                })
                .catch(err => {
                    res.status(400).json({error: err})
                });

            res.status(200).json({approvedStats: {approved: approved, total: total}, expReason: expByReason});
        }
    } else {
        res.status(403).json({error: "unauthorized"})
    }
};