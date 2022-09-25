
const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { ProductModel, CategoryModel, UserModel } = require('../models');

const collectionsAvailables = [
    'users',
    'roles',
    'categories',
    'products'
]


const search = (req = request, res = response) => {
    const { category, user } = req.query;
    console.log(req.query);
    const { collection, query } = req.params;

    if (!collectionsAvailables.includes(collection)) return res.status(409)
        .json({ error: 'Collection dont exists' });

    try {

        switch (collection) {
            case 'users':
                searchUsers(query, res);
                break;
            case 'categories':
                searchCategories(query, res);
                break;
            case 'products':
                searchProducts(query, res);
                break;
            default:
                res.status(500).json({ error: 'No implement' });
                break;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


const searchUsers = async (query, res = response) => {
    const isMongoID = ObjectId.isValid(query);

    try {

        if (isMongoID) {
            const user = await UserModel.findById(query);
            return res.json({
                results: (user ? [user] : [])
            });
        }

        const regexQuery = new RegExp(query, 'i');
        // const regexAlphanum = new RegExp(query, '/^([a-zA-Z0-9_-]+)$/');
        const queryDB = {
            $or: [
                { name: regexQuery },
                { email: regexQuery }
            ],
            $and: [
                { state: true }
            ]
        };

        const [total, users] = await Promise.all([
            UserModel.find(queryDB).countDocuments(),
            UserModel.find(queryDB)
        ]);

        return res.json({
            total,
            results: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const searchCategories = async (query, res = response) => {
    const isMongoID = ObjectId.isValid(query);
    try {
        if (isMongoID) {
            const category = await CategoryModel.findById(query)
                .populate('user', 'name');
            return res.json({
                results: (category ? [category] : [])
            });
        }

        const regexQuery = new RegExp(query, 'i');

        const queryDB = {
            $or: [
                { name: regexQuery }
            ],
            $and: [
                { status: true }
            ]
        }

        const [total, categories] = await Promise.all([
            CategoryModel.find(queryDB).countDocuments(),
            CategoryModel.find(queryDB)
                .populate('user', 'name')
        ]);

        return res.json({
            total,
            results: categories
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const searchProducts = async (query, res = response) => {
    const isMongoID = ObjectId.isValid(query);
    try {
        if (isMongoID) {
            const product = await ProductModel.findById(query).populate('category', 'name');

            return res.json({
                results: (product ? [product] : [])
            });
        }

        const regexQuery = new RegExp(query, 'i');

        const queryDB = {
            $or: [
                { name: regexQuery }
            ],
            $and: [
                { status: true }
            ]
        }

        const [total, products] = await Promise.all([
            ProductModel.find(queryDB).countDocuments(),
            ProductModel.find(queryDB)
                .populate('category', 'name')
                .populate('user', 'name')
        ]);

        return res.json({
            total,
            results: products
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    search
}