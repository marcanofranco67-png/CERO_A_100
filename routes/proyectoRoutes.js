const express = require('express');
const router = express.Router();
const { crearProyecto, obtenerProyectos } = require('../controllers/proyectoController');

// Mapeamos POST para guardar y GET para consultar
router.route('/')
    .post(crearProyecto)
    .get(obtenerProyectos);

module.exports = router;
