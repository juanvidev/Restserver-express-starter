const { response } = require("express");
const { uploadFileHelper } = require("../helpers/upload-file");
const { ProductModel, UserModel } = require("../models");
const path = require("path");
const fs = require("fs");

const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = async (req, res = response) => {
    try {
        const filename = await uploadFileHelper(req.files, ['txt'], 'textos');

        return res.json({
            message: 'File uploaded!',
            filename
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message ? err.message : err });
    }
}

const updateImage = async (req, res = response) => {
    const { collection, id } = req.params;

    let model;

    try {
        switch (collection) {
            case "users":
                model = await UserModel.findById(id);
                if (!model) return res.status(409).json({ error: 'User not found' });
                break;
            case "products":
                model = await ProductModel.findById(id);
                if (!model) return res.status(409).json({ error: 'Product not found' });
                break;
            default:
                return res.status(500).json({ error: "Collection not implement | upload" })
        }

        //Validar si existe ya una imagen de usuario.

        if (model.img) {
            const pathImg = path.join(__dirname, "../uploads/", collection, model.img);
            if (fs.existsSync(pathImg)) fs.unlinkSync(pathImg);
        }

        const name = await uploadFileHelper(req.files, ['png', 'jpg', 'jpeg'], collection);
        model.img = name;

        await model.save();

        return res.json({ results: [model] });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message ? err.message : err });
    }

}

const updateImageCloudinary = async (req, res = response) => {
    const { collection, id } = req.params;

    let model;

    try {
        switch (collection) {
            case "users":
                model = await UserModel.findById(id);
                if (!model) return res.status(409).json({ error: 'User not found' });
                break;
            case "products":
                model = await ProductModel.findById(id);
                if (!model) return res.status(409).json({ error: 'Product not found' });
                break;
            default:
                return res.status(500).json({ error: "Collection not implement | upload" })
        }

        //Validar si existe ya una imagen de usuario en cloudinary.

        if (model.img) {
            const imgCurrent = model.img.split("/");
            const nameImage = imgCurrent[imgCurrent.length - 1];
            const [public_id] = nameImage.split(".");
            cloudinary.uploader.destroy(public_id); // No tiene await porque queremos que sea un proceso aparte
        }

        const { tempFilePath } = req.files.file;

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

        model.img = secure_url;

        await model.save();

        return res.json({ results: model });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message ? err.message : err });
    }

}

const getShowImage = async (req, res = response) => {

    const { collection, id } = req.params;

    let model;

    try {
        switch (collection) {
            case "users":
                model = await UserModel.findById(id);
                if (!model) return res.status(409).json({ error: 'User not found img show' });
                break;
            case "products":
                model = await ProductModel.findById(id);
                if (!model) return res.status(409).json({ error: 'Product not found img show' });
                break;
            default:
                return res.status(500).json({ error: "Collection not implement | upload" })
        }

        //Validar si existe ya una imagen de usuario.

        if (model.img) {
            const pathImg = path.join(__dirname, "../uploads/", collection, model.img);
            if (fs.existsSync(pathImg)) return res.sendFile(pathImg)
        }

        const pathImagePlaceholder = path.join(__dirname, "../public/assets/no-image.jpg");
        return res.sendFile(pathImagePlaceholder);

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message ? err.message : err });
    }
}

module.exports = {
    uploadFile, // POST
    updateImage,  //PUT - UPDATE
    getShowImage,
    updateImageCloudinary
}