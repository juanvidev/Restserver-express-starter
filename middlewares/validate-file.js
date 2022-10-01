const { request } = require("express");

const validateFile = (req = request, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file)
        return res.status(400).json({ error: 'A file must be specified' });

    next();
}

module.exports = {
    validateFile
}