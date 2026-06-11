const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
// Importamos tu librería local de seguridad
const ceroSeguridad = require('@marcanofranco67-png/cero-seguridad-lib');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CAPA DE SEGURIDAD PERIMETRAL (Cero Humo, Blindaje Real) ---
app.use(helmet()); // Cabeceras HTTP seguras
app.use(express.json()); // Parsing de JSON nativo

// Limitador de peticiones para evitar ataques de fuerza bruta / DoS
const limtiadorPeticiones = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 100, // Máximo 100 peticiones por IP por ventana
    message: { error: 'Demasiadas peticiones desde esta IP. Inténtalo más tarde.' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(limtiadorPeticiones);

// Inicialización de tu librería personalizada si requiere alguna configuración interna
// ceroSeguridad.init(app); 

// --- RUTAS BASE DEL ECOSISTEMA ---
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Ecosistema Cero Absoluto - Infraestructura de Growth Partner Activa.',
        version: '1.0.0'
    });
});

// --- MANEJO DE ERRORES GLOBAL (Evita fugas de información en consola/cliente) ---
app.use((err, req, res, next) => {
    console.error(`[Error del Servidor]: ${err.message}`);
    res.status(500).json({ error: 'Fallo interno en la infraestructura segura.' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 [CERO ABSOLUTO RUNNING]`);
    console.log(`📡 Servidor seguro escuchando en: http://localhost:${PORT}`);
    console.log(`🔒 Blindaje perimetral activo (Helmet + Rate-Limit)\n`);
});
