const express = require('express');
const router = express.Router();
const user = require("../controllers/user.controller");
const { check, validationResult } = require('express-validator/check');

/* GET users listing. */
router
    .route("/create_user")
    .post(user.userCreate, [
        check('email').isEmail().withMessage("Must be a valid email"),
        check('password', 'Minimum 6 characters').isLength({min: 6}),
        check('firstName').isAlpha().withMessage("Must be a valid name"),
        check('lastName').isAlpha().withMessage("Must be a valid name"),
        check('userType').exists(),
        check('userType').isIn('user', 'manager')
    ]);

router
    .route('/login')
    .post(user.authenticate);


router
    .route('/create_card')
    .post(user.createCard);

router
    .route('/get_cards')
    .get(user.listCards);

router
    .route('/get_profile')
    .get(user.getProfile);


module.exports = router;
