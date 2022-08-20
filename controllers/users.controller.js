const { response } = require('express');
const { Encrypt } = require('../helpers/encrypt-pass');
const User = require('../models/db-user');

const getUsers = async (req, res = response) => {
    const { limit = 5, since = 0 } = req.query;

    const limitFormat = Number(limit);
    const sinceFormat = Number(since);
    const query = { state: true };

    if (!limitFormat && !sinceFormat) return res.status(400)
        .json({
            message: 'Invalid params request'
        });

    try {

        const [countUsers, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(sinceFormat)
                .limit(limitFormat)

        ])

        res.json({ countUsers, users });

    } catch (error) {
        res.status(500).json({ err: error.message });
    }

}

const postUsers = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    user.password = Encrypt(password);

    try {
        await user.save();

        res.json({ user });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        });
    }
}

const putUsers = async (req, res = response) => {
    const { id } = req.params;
    const { _id, google, password, email, ...restUser } = req.body;

    if (password) {
        restUser.password = Encrypt(password);
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(id, restUser);
        res.json({ userUpdated });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error.message
        })
    }


}

const patchUsers = (req, res = response) => {
    res.status(200).json({
        message: "PATCH - Controller"
    });

}

const deleteUsers = async (req, res = response) => {

    const { id } = req.params;
    try {
        const userToDelete = await User.findByIdAndUpdate(id, { state: false });

        res.json(userToDelete);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }


}



module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
}