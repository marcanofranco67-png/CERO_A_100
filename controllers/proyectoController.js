const ProyectoCliente = require('../models/ProyectoCliente');

// @desc    Crear un nuevo proyecto de cliente
// @route   POST /api/proyectos
const crearProyecto = async (req, res) => {
    try {
        const nuevoProyecto = new ProyectoCliente(req.body);
        const proyectoGuardado = await nuevoProyecto.save();
        res.status(201).json({ success: true, message: 'Obra maestra registrada: Proyecto de Cliente creado exitosamente.', data: proyectoGuardado });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Error al registrar el proyecto de cliente.', detalle: error.message });
    }
};

// @desc    Obtener todos los proyectos/clientes con sus métricas
// @route   GET /api/proyectos
// @access  Privado
const obtenerProyectos = async (req, res) => {
    try {
        // Buscamos todos los documentos en la colección
        const proyectos = await ProyectoCliente.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            conteo: proyectos.length,
            data: proyectos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al consultar la base de datos.',
            detalle: error.message
        });
    }
};

module.exports = {
    crearProyecto,
    obtenerProyectos
};
