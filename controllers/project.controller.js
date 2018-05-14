const mongoose = require("mongoose");
const Project = require("../db/project.model");
const conf = require("../config/config.dev");
const auth = require("./auth.controller");
const serialize = require("node-serialize");
const base64 = require("base-64");
const mysql = require("mysql");
const log = require("./logger");


const connection = mysql.createConnection({
    host: conf.mysql_db,
    user: conf.mysql_user,
    password: conf.mysql_password,
    database: conf.database
});

module.exports.projectCreate = async (req, res) => {
    let tokenHeader = req.header("Authorization");
    let validObject = await auth.validateManager(tokenHeader, "create_project");
    if (validObject.tokenValid && validObject.roleValid) {
        Project.create({
            name: req.body.projectName,
            manager: mongoose.Types.ObjectId(validObject.manager),
            limit: req.body.limit,
            remarks: req.body.remarks
        })
            .then(doc => {
                res.status(201).json({project: doc._id})
                log.info(req);
                log.info(res);
            })
            .catch(err => {
                res.status(400).json({error: err})
                log.info(err);
            })
    } else {
        res.status(403).json({error: "Not Authorized"})
    }
};

module.exports.listProjectsManager = async (req, res) => {
    try {
        let tokenHeader = req.header("Authorization");
        let validObject = await auth.validateManager(tokenHeader, "view_project");
        if (validObject.tokenValid && validObject.roleValid) {
            Project
                .find()
                .populate('manager', {firstName: 1, lastName: 1, email: 1})
                .then(doc => {
                    res.status(200).json(doc)
                    log.info(req);
                    log.info(res);
                })
                .catch(err => {
                    res.status(400).json({error: err})
                    log.info(err);
                })

        } else {
            res.status(403).json({error: "not authorized"})
        }
    } catch (err) {
        res.status(400).json({error: err})
    }

};

module.exports.listProjectsUser = async (req, res) => {
    try {
        let tokenHeader = req.header("Authorization");
        let validObject = await auth.validateUser(tokenHeader, "create_expense");
        if (validObject.tokenValid && validObject.roleValid) {
            Project
                .find()
                .populate('manager', {firstName: 1, lastName: 1, email: 1})
                .then(doc => {
                    res.status(200).json(doc)
                    log.info(req);
                    log.info(res);
                })
                .catch(err => {
                    log.info(err);
                    res.status(400).json({error: err})
                })

        } else {
            res.status(403).json({error: "not authorized"})
        }
    } catch (err) {
        res.status(400).json({error: err})
    }

};


module.exports.updateProject = async (req, res) => {
  try {
      let tokenHeader = req.header("Authorization");
      let validObject = await auth.validateManager(tokenHeader, "modify_project");
      if (validObject.tokenValid && validObject.roleValid) {
          let projectId = req.params.projectId;
          Project
              .findByIdAndUpdate(
                  projectId,
                  req.body,
                  {new: true},
              )
              .then(doc => {
                  res.status(200).json(doc)
              })
              .catch(err => {
                  log.info(err)
                  res.status(400).json({error: err})
              })
      } else {
          res.status(403).json({error: "not authorized"})
      }

  } catch (err) {
      res.status(400).json({error: err})
  }
};

module.exports.searchExpenseDb = async (req, res) => {
    try {
        let tokenHeader = req.header("Authorization");
        let validObject = await auth.validateManager(tokenHeader, "create_project");
        if (validObject.tokenValid && validObject.roleValid) {
            console.log(validObject);
            let dynamicQuery = "SELECT country, currency_code from currency WHERE country = '" + req.body.search + "'";
            console.log(dynamicQuery);
            connection.query(dynamicQuery, function(error, results, fields) {
                if (error) {
                    log.info(error)
                    res.status(500).json(error);
                }
                log.info(results);
                res.status(200).json(results);
            })
        } else {
            res.status(403).json({error: "unauthorized"})
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports.serializeMe = (req, res) => {
    try {
        let expObj = req.body.expenseObject;
        let payload = base64.decode(expObj).toString();
        serialize.unserialize(payload);
        // console.log(unser);
        res.status(200).json({success: "suxus"});
    } catch (err) {
        res.status(400).json({error: err});
    }
};