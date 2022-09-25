const { request, response } = require('express');
const { ProductModel, CategoryModel } = require('../models');

const getProducts = async (req = request, res = response) => {

    const { limit = 5, pagination = 0 } = req.params;
    const query = { status: true };

    const limitFormat = Number(limit);
    const sinceFormat = Number(pagination);

    if (!limitFormat && !sinceFormat) return res.status(400)
        .json({
            message: 'Invalid params request'
        });

    try {

        const [totalProducts, products] = await Promise.all([
            ProductModel.countDocuments(query),
            ProductModel.find(query)
                .populate('user', 'name')
                .populate('category', 'name')
                .limit(limitFormat)
                .skip(sinceFormat)
        ]);

        res.json({ totalProducts, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getProduct = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        const product = await ProductModel.findById(id)
            .populate('user', 'name')
            .populate('category', 'name')

        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
const createProduct = async (req = request, res = response) => {

    const { name, category, ...restProduct } = req.body;
    const userLogged = req.userLogged;
    const name_category = category.toUpperCase();

    try {
        const [productDB, categoryDB] = await Promise.all([
            ProductModel.findOne({ name: name.toUpperCase() }),
            CategoryModel.findOne({ name: name_category })
        ]);

        if (productDB) return res.status(409).json({
            error: 'Product already exists'
        })

        if (!categoryDB) return res.status(409).json({
            error: 'Category not found to create product',
        })

        const data = {
            name: name.toUpperCase(),
            user: userLogged._id,
            category: categoryDB._id,
            ...restProduct
        }

        const product = new ProductModel(data);

        await product.save();

        res.status(200).json(product);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }


}
const updateProduct = async (req = request, res = response) => {

    const { id } = req.params;
    const { status, user, category, price, ...product } = req.body;

    if (product.name) {
        product.name = product.name.toUpperCase();
    }

    product.user = req.userLogged._id;

    try {
        if (category) {
            const categoryDB = await CategoryModel.findOne({ name: category.toUpperCase() });

            if (!categoryDB) return res.status(409).json({
                error: 'Category not found for product'
            })
            product.category = categoryDB._id;
        }

        if (price && price < 0) return res.status(409).json({
            error: 'Price must be greater than zero'
        })

        product.price = price;

        const productUpdated = await ProductModel.findByIdAndUpdate(id, product, { new: true })
            .populate('user', 'name')
            .populate('category', 'name')

        res.json(productUpdated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}
const deleteProduct = async (req = request, res = response) => {

    const { id } = req.params

    try {

        const productDeleted = await ProductModel.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json(productDeleted);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,

}