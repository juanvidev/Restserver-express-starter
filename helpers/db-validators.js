const dbRole = require("../models/db-role");
const dbUser = require("../models/db-user");


const validatorRoleDB = async (role = '') => {
    const existRole = await dbRole.findOne({ role });
    if (!existRole) {
        throw new Error(`Role is'nt in database`);
    }
}

const validatorEmailDB = async (email = '') => {

    const existsEmail = await dbUser.findOne({ email })

    if (existsEmail) {
        throw new Error(`Email already exists`);
    }
}

const validatorIdDB = async (id) => {
    const existsUser = await dbUser.findById(id);

    if (!existsUser) {
        throw new Error(`User not exists`);
    }
}


module.exports = {
    validatorRoleDB,
    validatorEmailDB,
    validatorIdDB,
}