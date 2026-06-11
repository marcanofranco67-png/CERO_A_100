const mongoose = require('mongoose');

const ProyectoClienteSchema = new mongoose.Schema({
    // --- 1. IDENTIDAD Y CONTROL DEL SOCIO ---
    nombreEmpresa: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio.'],
        trim: true
    },
    dominioWeb: {
        type: String,
        trim: true,
        lowercase: true
    },
    estadoProyecto: {
        type: String,
        enum: ['auditoria', 'optimizacion', 'escalado', 'completado'],
        default: 'auditoria'
    },

    // --- 2. FINANZAS Y TRACCIÓN (Salud del Negocio) ---
    finanzas: {
        mrr: { type: Number, default: 0 }, // Ingreso Mensual Recurrente
        clv: { type: Number, default: 0 }, // Valor de Vida del Cliente (Customer Lifetime Value)
        cac: { type: Number, default: 0 }  // Costo de Adquisición de Cliente
    },

    // --- 3. EMBUDO Y CONVERSIÓN (Métricas de la Nueva Era) ---
    metricasEmbudo: {
        visitasMensuales: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 }, // Porcentaje de conversión (ej: 2.5 para 2.5%)
        leadsGenerados: { type: Number, default: 0 },
        churnRate: { type: Number, default: 0 }       // Tasa de cancelación/abandono
    },

    // --- 4. INFRAESTRUCTURA TÉCNICA (Auditoría del Growth Partner) ---
    infraestructura: {
        tecnologias: [{ type: String, trim: true }], // Ej: ['React', 'Node.js', 'Stripe']
        seguridadBlindada: { type: Boolean, default: false },
        accesibilidadWeb: { type: Boolean, default: false },
        erroresCriticosReportados: { type: Number, default: 0 }
    }
}, {
    timestamps: true // Crea automáticamente campos "createdAt" y "updatedAt"
});

// Optimización de índices para búsquedas rápidas por empresa y estado
ProyectoClienteSchema.index({ nombreEmpresa: 1, estadoProyecto: 1 });

module.exports = mongoose.model('ProyectoCliente', ProyectoClienteSchema);
