const bcrypt = require('bcryptjs');

const Encrypt = (password) => {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

module.exports = {
    Encrypt
};