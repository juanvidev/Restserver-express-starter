const { Router } = require('express');
const { search } = require('../controllers/search.controller');
const { searchCategories } = require('../controllers/searchCategories');
const { searchProducts } = require('../controllers/searchProducts');


const router = Router();

router.get('/:collection/:query', search);
router.get('/categories', searchCategories);
router.get('/products', searchProducts);

router.all("*", (req, res) => res.status(404).json({
    error: '404 - Not found'
}));

module.exports = router;