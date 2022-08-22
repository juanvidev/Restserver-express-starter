const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares');


const { loginUser } = require('../controllers/auth.controller');


const router = Router();

router.post('/login', [
    check('email', 'Email required').not().isEmpty(),
    check('password', 'Password required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    // check('password').custom(checkPassword),
    validateFields
], loginUser);

module.exports = router;
