const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, getShowImage, updateImageCloudinary } = require('../controllers/uploads.controller');
const { collectionsAvailables } = require('../helpers');
const { validateFields, validateFile } = require('../middlewares');

const router = Router();

router.get('/:collection/:id', [
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom((collection) => collectionsAvailables(collection, ["users", "products"])),
    validateFields
], getShowImage);

router.post('/', validateFile, uploadFile);

router.put('/:collection/:id', [
    validateFile,
    check('id', 'Id is not valid').isMongoId(),
    check('collection').custom((collection) => collectionsAvailables(collection, ["users", "products"])),
    validateFields
], updateImageCloudinary); //updateImage


router.all("*", (req, res) => res.status(404).json({
    message: '404 | Not found'
}));

module.exports = router;