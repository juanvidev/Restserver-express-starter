const RoleModel = require("../models/db-role");
const UserModel = require("../models/db-user");


const validatorRoleDB = async (role = '') => {
    const existRole = await RoleModel.findOne({ role });
    if (!existRole) throw new Error(`Role is'nt in database`);

}

const validatorEmailDB = async (email = '') => {
    const existsEmail = await UserModel.findOne({ email })

    if (existsEmail) throw new Error(`Email already exists!`);

}

const validatorIdDB = async (id) => {
    const existsUser = await UserModel.findById(id);

    if (!existsUser) throw new Error(`User not exists`);

}

const validatorStateUser = async (id) => {
    const existsUser = await UserModel.findById(id);
    if (!existsUser.state) throw new Error(`User already inactive - state:false`);


}

module.exports = {
    validatorRoleDB,
    validatorEmailDB,
    validatorIdDB,
    validatorStateUser
}