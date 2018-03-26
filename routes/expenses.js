const express = require('express');
const router = express.Router();
const expense = require("../controllers/expense.controller");
const { check, validationResult } = require('express-validator/check');

router
    .route("/create_expense")
    .post(expense.createExpense, [
        check('name').exists(),
        check('amount').isDecimal(),
        check('merchant').exists(),
        check('projectId').isAlphanumeric().isLength({min: 8})
    ]);

router
    .route("/get_my_expenses")
    .get(expense.getMyExpenses);

router
    .route("/upload_file/:expId")
    .post(expense.addExpenseFile);

router
    .route("/approve_expense/:expId")
    .patch(expense.approveExpense);

router
    .route("/update_expense/:expId")
    .post(expense.updateExpense);

router
    .route("/single_expense;/:expId")
    .get(expense.getSingleExpense);


module.exports = router;