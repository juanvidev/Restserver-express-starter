const { CategoryModel } = require('../models');

const { request, response } = require('express');

const getCategories = async (req = request, res = response) => {
    const { limit = 5, pagination = 0 } = req.query;
    const query = { status: true };

    const limitFormat = Number(limit);
    const sinceFormat = Number(pagination);

    const userLogged = req.userLogged;

    if (!limitFormat && !sinceFormat) return res.status(400)
        .json({
            message: 'Invalid params request'
        });

    try {

        const [countCategories, categories] = await Promise.all([
            CategoryModel.countDocuments(query),
            CategoryModel.find(query)
                .skip(pagination)
                .limit(limit)
                .populate('user', 'name')
        ]);

        return res.json({
            countCategories,
            categories,
            userLogged
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message
        })

    }
}
const getCategory = async (req = request, res = response) => {
    const { id } = req.params;

    try {

        const category = await CategoryModel.findById(id).populate('user', 'name');

        res.json(category);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

}
const createCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    try {
        const categoryToCreate = await CategoryModel.findOne({ name });
        console.log(categoryToCreate);
        if (categoryToCreate) return res.status(400).json({
            message: 'Category already exists'
        })

        const userLogged = req.userLogged;
        console.log(userLogged)

        const data = {
            name,
            user: userLogged._id
        }

        const category = new CategoryModel(data);

        await category.save();

        return res.status(201).json(category);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error.message
        })
    }

}
const updateCategory = async (req = request, res = response) => {

    const { id } = req.params;

    const { status, user, ...data } = req.body
    data.name = data.name.toUpperCase();
    data.user = req.userLogged._id;

    try {

        const categoryUpdated = await CategoryModel.findByIdAndUpdate(id, data, { new: true });

        res.json(categoryUpdated);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }

}
const deleteCategory = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const categoryDeleted = await CategoryModel.findByIdAndUpdate(id, { status: false }, { new: true });

        res.json(categoryDeleted);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}