const { Router } = require('express');
const { check } = require('express-validator');

const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { validateProduct } = require('../helpers/db-validators');
const { validateJWT, validateFields, validateRoleAdmin } = require('../middlewares');

const router = Router();

router.get('/', getProducts);

router.get('/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(validateProduct),
    validateFields
], getProduct);

router.post('/', [
    validateJWT,
    check('name', 'Product name is required').not().isEmpty(),
    check('category', 'Category name is required').not().isEmpty(),
    validateFields
], createProduct);

router.put('/:id', [
    validateJWT,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(validateProduct),
    validateFields
], updateProduct);

router.delete('/:id', [
    validateJWT,
    validateRoleAdmin,
    check('id', 'Id is not valid').isMongoId(),
    check('id').custom(validateProduct),
    validateFields
], deleteProduct);

router.all("*", (req, res) => res.status(404).json({
    message: '404 | Not found'
}));

module.exports = router;