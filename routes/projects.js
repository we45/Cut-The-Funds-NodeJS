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

module.exports = router;