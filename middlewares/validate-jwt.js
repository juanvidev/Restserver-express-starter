const { request, next } = require('express');
const jwt = require('jsonwebtoken');
const formatDate = require('../helpers/format-date');
const User = require('../models/db-user');

const validateJWT = async (req = request, res, next) => {

    const tokenBearer = req.header('Authorization');

    const token = tokenBearer?.split(' ')[1];

    try {

        const { payload } = jwt.verify(token, process.env.SECRETORPRIVATEKEY, { complete: true });
        const userLogged = await User.findById(payload.id);

        if (!userLogged) return res.status(401).json({
            message: 'Token invalid - user not exist'
        })

        if (!userLogged.state) return res.status(401).json({
            message: 'Token invalid - state:false'
        })

        req.userLogged = {
            userLogged,
            payload: {
                uid: payload.id,
                createdAt: formatDate(payload.iat),
                expiresIn: formatDate(payload.exp)
            }
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(500).json({ message: error.message, expiredAt: formatDate(error.expiredAt) })
        } else {
            return res.status(500).json({ message: error.message })
        }
    }

}

module.exports = { validateJWT };