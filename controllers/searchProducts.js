const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { ProductModel } = require('../models');

const searchProducts = async (req = request, res = response) => {

    const { category, user } = req.query;
    console.log(req.query);
    const lengthQueries = Object.keys(req.query).length;

    if (lengthQueries > 1 || lengthQueries === 0) return res.status(409).json({
        error: "Invalid query"
    });

    try {
        if (category) {
            const isMongoID = ObjectId.isValid(category);
            if (isMongoID) {
                const products = await ProductModel.find({ category, state: true })
                    .populate('user', 'name')
                    .populate('category', 'name');
                return res.json({
                    results: (products ? products : [])
                });
            }
            searchProductByCategory(category, res);

        } else if (user) {
            const isMongoID = ObjectId.isValid(user);
            if (isMongoID) {
                const products = await ProductModel.find({ user, state: true })
                    .populate('user', 'name')
                    .populate('category', 'name');
                return res.json({
                    results: (products ? products : [])
                });
            }
            searchProductByUser(user, res);
        } else return res.status(500).json({ error: 'No implement' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const searchProductByUser = async (user, res = response) => {
    const regexQuery = new RegExp(user, 'i');

    const products = await ProductModel.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userLookup"
            },
        },
        {
            $match: {
                status: true,
                'userLookup.name': regexQuery
            }
        },
        {
            $project: {
                userLookup: 0,
                status: 0,
                __v: 0
            }
        }
    ]).sort({ name: 'asc' });

    await ProductModel.populate(products, [
        { path: "category", select: "name" },
        { path: "user", select: "name" }
    ])

    return res.json({
        results: products
    });
}

const searchProductByCategory = async (category, res = response) => {
    const regexQuery = new RegExp(category, 'i');

    const products = await ProductModel.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryLookup"
            },
        },
        { $match: { status: true, 'categoryLookup.name': regexQuery } },
        {
            $project: {
                categoryLookup: 0,
                __v: 0
            }
        }
    ]).sort({ name: 'asc' });

    await ProductModel.populate(products, [
        { path: "category", select: "name" },
        { path: "user", select: "name" }
    ]);

    return res.json({
        results: products
    });
}


module.exports = {
    searchProducts
}