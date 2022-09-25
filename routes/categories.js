
const { Router } = require('express');

const { check } = require('express-validator');
const { validateFields, validateJWT, validateRoleAdmin } = require('../middlewares');

const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory } = require('../controllers/categories.controller');
const { validateCategory } = require('../helpers/db-validators');


const router = Router();

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(validateCategory),
    validateFields
], getCategory);

router.post('/', [
    validateJWT,
    check('name', 'Category name is required').not().isEmpty(),
    validateFields
], createCategory);

router.put('/:id', [
    validateJWT,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(validateCategory),
    check('name', 'Category name is required').not().isEmpty(),
    validateFields
], updateCategory);

router.delete('/:id', [
    validateJWT,
    validateRoleAdmin,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(validateCategory),
    validateFields
], deleteCategory);

router.all("*", (req, res) => res.status(404).json({
    error: '404 - Not found'
}));


module.exports = router;