const { response } = require('express');

const getUsers = (req, res = response) => {
    const queriesRequest = req.query;
    res.json({
        message: "GET - Controller",
        queriesRequest
    });
}

const postUsers = (req, res = response) => {
    const { nombre, edad } = req.body;

    res.json({
        message: "POST - Controller",
        nombre,
        edad
    });

}

const putUsers = (req, res = response) => {
    const { id } = req.params;

    res.status(200).json({
        message: "PUT - Controller",
        id
    });

}

const patchUsers = (req, res = response) => {
    res.status(200).json({
        message: "PATCH - Controller"
    });

}

const deleteUsers = (req, res = response) => {
    res.status(200).json({
        message: "DELETE - Controller"
    });

}



module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
}