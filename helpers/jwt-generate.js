const jwt = require('jsonwebtoken');

const generateToken = (id) => new Promise((resolve, reject) => {

    const payload = { id };
    jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
        expiresIn: "1h"
    }, (err, token) => {
        if (err) {
            console.log(err)
            reject(err);
        } else {
            resolve(token);
        }

    });

});

const decodeToken = (token = '') => jwt.decode(token, { complete: true });

module.exports = {
    generateToken,
    decodeToken
};