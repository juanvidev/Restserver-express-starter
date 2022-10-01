const express = require('express');
const cors = require('cors');
const { conectionDB } = require('../database/config');
const FileUpload = require('express-fileupload');
class Server {

    constructor() {
        this.port = process.env.PORT;
        this.app = express();

        //Conexion Database
        this.conectDB();

        //Middlewares
        this.middlewares();

        //Routas de la app
        this.routes();
    }

    async conectDB() {
        try {

            await conectionDB();

        } catch (error) {
            console.log(error);
        }
    }

    middlewares() {
        this.app.use(cors()); // CORS
        this.app.use(express.json()); // Parseo y lectura de body request
        this.app.use(express.static("public")); // Directorio publico (carpeta)
        this.app.use(FileUpload({ // Carga de archivos
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use('/api/auth', require('../routes/user-auth'));
        this.app.use('/api/users', require('../routes/user-crud'));
        this.app.use('/api/categories', require('../routes/categories'));
        this.app.use('/api/products', require('../routes/products'));
        this.app.use('/api/search', require('../routes/search'));
        this.app.use('/api/upload', require('../routes/uploads'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server listening on port " + this.port);
        })
    }

}

module.exports = Server;