const mongoose = require('mongoose');

// Este filtro evalúa si el ID dinámico cumple con los requisitos de MongoDB
const validarObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            error: "Formato de ID inválido.",
            detalle: `El ID '${id}' proporcionado no cumple con la estructura hexadecimal requerida por la infraestructura.`
        });
    }

    // Si el ID es perfecto, 'next()' le permite continuar el viaje hacia el controlador
    next();
};

module.exports = validarObjectId;
