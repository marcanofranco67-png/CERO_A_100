const express = require('express');
const router = express.Router();
const { 
    crearProyecto, 
    obtenerProyectos, 
    actualizarProyecto, 
    eliminarProyecto 
} = require('../controllers/proyectoController');

const validarObjectId = require('../middlewares/validarObjectId');

// Rutas base de la colección
router.route('/')
    .post(crearProyecto)
    .get(obtenerProyectos);

// Rutas específicas que requieren ID para operar
router.route('/:id')
    .put(validarObjectId, actualizarProyecto)
    .delete(validarObjectId, eliminarProyecto);

module.exports = router;
