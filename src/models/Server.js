const express = require("express");
const { payment } = require("../routes/auth")

//CORS
const cors = require('cors');

//DB
const { dbConnection } = require("../../config/database");

class Server {
    constructor () {
        this.app = express();

        //Port
        this.port = process.env.PORT;


        // Path

        //Login
        this.authPath = "/api/auth";

        // DB
        this.conectarDB();

        // Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }
    //Base de datos
    async conectarDB() {
        await dbConnection();
    }
    middlewares() {
    // CORS
    this.app.use(cors());
    
    this.app.use(express.json());
    
    //Mostrar carpeta publica
    this.app.use(express.static("public"));
    }

    routes () {
        this.app.use(this.authPath, require("../routes/auth"))
    }

    listen() {
        this.app.listen(this.port, () => {
          console.log("Server Online", this.port);
        });
      }
}

module.export = Server;