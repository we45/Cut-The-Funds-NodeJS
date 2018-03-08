const mongoose = require("mongoose");
const Project = require("../db/project.model");
const auth = require("./auth.controller");

module.exports.projectCreate = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateManager(tokenHeader, "create_project");
    console.log(validObject);
    if (validObject.tokenValid && validObject.roleValid) {
        Project.create({
            name: req.body.projectName,
            manager: mongoose.Types.ObjectId(validObject.manager),
            limit: req.body.limit
        })
            .then(doc => {
                res.status(201).json({project: doc._id})
            })
            .catch(err => {
                res.status(400).json({error: err})
            })
    } else {
        res.status(403).json({error: "Not Authorized"})
    }
};