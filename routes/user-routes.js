const { Router } = require('express');

const { check } = require('express-validator');

const { getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers } = require('../controllers/users.controller');

const { validatorRoleDB, validatorEmailDB, validatorIdDB } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.get('/', getUsers);

router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email not valid').isEmail(),
    check('password', 'Password not valid - more 6 characters').isLength({ min: 6 }),
    check('email').custom(validatorEmailDB),
    check('role').custom(validatorRoleDB),
    validateFields
    // check('role', 'Role not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
], postUsers);

router.put("/:id", [
    check('id', 'Id is not valid').isMongoId(),
    check("id").custom(validatorIdDB),
    validateFields
], putUsers);

router.patch("/", patchUsers);

router.delete("/:id", [
    check('id', 'Id is not valid').isMongoId(),
    check("id").custom(validatorIdDB),
    validateFields
], deleteUsers);

router.all("*", (req, res) => {
    res.json({
        message: '404 | Not found'
    })
});

module.exports = router;