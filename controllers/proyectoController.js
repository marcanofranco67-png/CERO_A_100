const ProyectoCliente = require('../models/ProyectoCliente');

// @desc    Crear un nuevo proyecto de cliente
// @route   POST /api/proyectos
const crearProyecto = async (req, res) => {
    try {
        const nuevoProyecto = new ProyectoCliente(req.body);
        const proyectoGuardado = await nuevoProyecto.save();
        res.status(201).json({ 
            success: true, 
            message: 'Obra maestra registrada: Proyecto de Cliente creado exitosamente.', 
            data: proyectoGuardado 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: 'Error al registrar el proyecto de cliente.', 
            detalle: error.message 
        });
    }
};

// @desc    Obtener todos los proyectos/clientes con sus métricas
// @route   GET /api/proyectos
const obtenerProyectos = async (req, res) => {
    try {
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

// @desc    Actualizar métricas o datos de un proyecto específico
// @route   PUT /api/proyectos/:id
const actualizarProyecto = async (req, res) => {
    try {
        const proyectoActualizado = await ProyectoCliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // new: true devuelve el dato ya modificado
        );

        if (!proyectoActualizado) {
            return res.status(404).json({
                success: false,
                error: 'No se encontró ningún proyecto con el ID proporcionado.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Métricas analíticas actualizadas correctamente en la infraestructura.',
            data: proyectoActualizado
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error al actualizar las métricas del proyecto.',
            detalle: error.message
        });
    }
};

// @desc    Purgar un proyecto de la base de datos
// @route   DELETE /api/proyectos/:id
const eliminarProyecto = async (req, res) => {
    try {
        const proyectoEliminado = await ProyectoCliente.findByIdAndDelete(req.params.id);

        if (!proyectoEliminado) {
            return res.status(404).json({
                success: false,
                error: 'No se encontró ningún proyecto con el ID proporcionado.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Proyecto purgado de la infraestructura de almacenamiento exitosamente.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al eliminar el proyecto del sistema.',
            detalle: error.message
        });
    }
};

module.exports = {
    crearProyecto,
    obtenerProyectos,
    actualizarProyecto,
    eliminarProyecto
};
