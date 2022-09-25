const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;
const { CategoryModel, UserModel } = require('../models');

const searchCategories = async (req = request, res = response) => {

    const { user } = req.query;
    if (!user) return res.status(409)
        .json({ error: "Invalid query" });

    const isMongoID = ObjectId.isValid(user);

    try {
        if (isMongoID) {
            const category = await CategoryModel.find({ user })
                .populate('user', 'name');
            return res.json({
                results: (category ? category : [])
            });
        }

        const regexQuery = new RegExp(user, 'i');

        const categories = await CategoryModel.aggregate([
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
        ]);

        await CategoryModel.populate(categories, { path: "user", select: "name" });

        return res.json({
            results: categories
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    searchCategories
}