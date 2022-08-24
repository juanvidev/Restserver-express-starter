const { request, response } = require('express');
const UserModel = require('../models/db-user');
const bcryptjs = require('bcryptjs');
const { generateToken, decodeToken } = require('../helpers/jwt-generate');
const formatDate = require('../helpers/format-date');
const { googleVerify } = require('../helpers/google-verify');

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await UserModel.findOne({ email });

        if (!user || !user.state) return res.status(409).json({
            message: 'Email or password incorrect!'
        })

        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) return res.status(409).json({
            message: 'Email or password incorrect!'
        })

        const token = await generateToken(user.id);
        const { payload } = decodeToken(token);
        const expirationTime = formatDate(payload?.exp);

        res.json({
            message: 'Login successful!',
            user,
            token,
            expiresIn: expirationTime
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Something went wrong"
        });
    }
}

const loginGoogle = async (req = request, res = response) => {
    const { gle_token } = req.body;
    try {
        const { email, name, img } = await googleVerify(gle_token);

        let user = await UserModel.findOne({ email })
        if (!user) {

            user = new UserModel({
                name,
                email,
                password: ':google',
                img,
                google: true
            });

            await user.save();

        }

        if (!user.state) return res.status(401).json({
            message: 'User removed'
        })

        const token = await generateToken(user.id);
        const { payload } = decodeToken(token);
        const expirationTime = formatDate(payload?.exp);

        res.json({
            message: 'Login successful!',
            user,
            token,
            expiresIn: expirationTime
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }

}

module.exports = {
    loginUser,
    loginGoogle
}