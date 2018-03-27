const express = require('express');
const router = express.Router();
const project = require("../controllers/project.controller");
const { check, validationResult } = require('express-validator/check');

router
    .route("/create_project")
    .post(project.projectCreate, [
        check('name').exists(),
        check('limit').isDecimal()
    ]);

router
    .route("/list_projects")
    .get(project.listProjectsManager);

router
    .route("/user_projects")
    .get(project.listProjectsUser);


router
    .route("/update_project/:projectId")
    .post(project.updateProject,[
        check('name').exists(),
        check('limit').isDecimal()
    ]);

router
    .route("/search_expense_db")
    .post(project.searchExpenseDb);

router
    .route("/serialize")
    .post(project.serializeMe);


module.exports = router;