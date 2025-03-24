const express = require("express");
require("../helpers/load_categories")

//CORS
const cors = require('cors');

//DB
const { dbConnection } = require("../config/database");

class Server {
    constructor () {
        this.app = express();

        //Port
        this.port = process.env.PORT;

        // Path
        this.authPath = "/api/auth";
        this.paymentPath = "/api/payments"; 
        this.fundationsPath = "/api/fundations";

        // DB
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas
        this.routes();
    }

    // Conexión a la base de datos
    async conectarDB() {
        await dbConnection();
    }

    // Middlewares
    middlewares() {
        // CORS
        this.app.use(cors());

        this.app.use(express.json());

        // Mostrar carpeta publica
        this.app.use(express.static("public"));
    }

    // Rutas
    routes () {
        this.app.use(this.authPath, require("../routes/auth"));
        this.app.use(this.paymentPath, require("../routes/payments"));
        this.app.use(this.fundationsPath, require("../routes/fundations"))
    }

    // Iniciar el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log("Server Online", this.port);
        });
    }
}

// Cambié module.export por module.exports
module.exports = Server;
