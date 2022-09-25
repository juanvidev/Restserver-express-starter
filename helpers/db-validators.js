const { CategoryModel, RoleModel, UserModel, ProductModel } = require("../models");

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

    if (!existsUser.state) throw new Error(`User inactive - state:false`);
}

const validateCategory = async (id) => {
    const existsCategory = await CategoryModel.findById(id);

    if (!existsCategory) throw new Error(`Category not exists`);

    if (!existsCategory.status) throw new Error(`Category inactive - status:false`);

}

const validateProduct = async (id) => {
    const existsProduct = await ProductModel.findById(id);

    if (!existsProduct) throw new Error(`Product not exists`);

    if (!existsProduct.status) throw new Error(`Product inactive - status:false`);

    // if (!existsProduct.available) throw new Error(`Product out stock! - available:false`);
}



module.exports = {
    validatorRoleDB,
    validatorEmailDB,
    validatorIdDB,
    validateCategory,
    validateProduct
}