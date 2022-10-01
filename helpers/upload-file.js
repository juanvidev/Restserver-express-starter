const path = require("path");
const { v4: uuidv4 } = require("uuid");

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'txt'];

const uploadFileHelper = (files = '', extensionsValids = EXTENSIONS, carpet = '') => new Promise((resolve, reject) => {

    const { file } = files;

    const nameCutted = file.name.split('.');
    const extension = nameCutted[nameCutted.length - 1];
    const tempName = `${uuidv4()}.${extension}`;

    if (!extensionsValids.includes(extension))
        return reject(`Invalid extension ${extension}`);

    const uploadPath = path.join(__dirname, '../uploads/', carpet, tempName);

    file.mv(uploadPath, (err) => {
        if (err) return reject(err);
        return resolve(tempName);
    })
});


module.exports = {
    uploadFileHelper
}