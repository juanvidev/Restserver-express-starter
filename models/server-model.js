const express = require('express');
const cors = require('cors');
const { conectionDB } = require('../database/config');

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
    }

    routes() {
        this.app.use('/api/users', require('../routes/user-routes'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Server listening on port " + this.port);
        })
    }

}

module.exports = Server;