const mongoose = require("mongoose");
const Expense = require("../db/expense.model");
const Project = require("../db/project.model");
const auth = require("./auth.controller");
const conf = require("../config/config.dev");
const randomstring = require("randomstring");
const path = require("path");

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
            let fullPath = conf.uploadDir + "/" + randFileName + fileExt;
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