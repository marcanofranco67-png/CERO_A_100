const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        // Intentamos la conexión síncrona usando la variable del .env
        const con = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`=========================================================`);
        console.log(`?? [MONGO-LOCAL] CONEXIÓN EXITOSA`);
        console.log(`?? Host: ${con.connection.host}`);
        console.log(`?? Base de Datos: ${con.connection.name}`);
        console.log(`=========================================================`);
    } catch (error) {
        console.error(`=========================================================`);
        console.error(`? [ERROR-MONGO] FALLÓ LA CONEXIÓN A LA BASE DE DATOS`);
        console.error(`?? Detalle: ${error.message}`);
        console.error(`=========================================================`);
        process.exit(1); // Detiene el proceso si no hay base de datos vital activa
    }
};

module.exports = conectarDB;
