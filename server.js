// ============================================================================
// ARCHIVO MAESTRO DEL SERVIDOR - CERO ABSOLUTO (PRODUCCIÓN)
// Ecosistema seguro, escalable y eficiente para transformación digital
// ============================================================================

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Inicialización de la infraestructura de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 1. BLINDAJE DE SEGURIDAD GENERAL (Helmet)
// Configura automáticamente cabeceras HTTP seguras para mitigar XSS, clickjacking y sniffing
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Permite scripts nativos del frontend base
            styleSrc: ["'self'", "'unsafe-inline'"],  // Permite estilos en cascada nativos
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"]
        }
    }
}));

// Parsers eficientes para el manejo de datos entrantes sin sobrecargar la memoria
app.use(express.json({ limit: '10kb' })); // Protege contra ataques de denegación de servicio (DoS) por JSON masivos
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2. ESCUDO ANTISATURACIÓN (Express Rate Limit)
// Mitiga ataques de fuerza bruta y DDoS limitando las peticiones por IP
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Ventana de tiempo: 15 minutos
    max: 100, // Límite estricto: 100 peticiones por IP por ventana
    standardHeaders: true, // Devuelve información de límite en las cabeceras RateLimit-*
    legacyHeaders: false, // Desactiva las cabeceras heredadas X-RateLimit-*
    message: {
        status: 429,
        error: 'Demasiadas peticiones desde esta dirección IP. Por favor, intente más tarde.'
    }
});
app.use(apiLimiter);

// 3. CAPA DE EFICIENCIA Y RENDIMIENTO (Servicio Estático)
// Sirve el frontend optimizando la caché del navegador para máxima velocidad de carga
const cacheOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html', 'htm', 'css', 'js'],
    index: 'index.html',
    maxAge: '1d', // Cachea recursos estáticos por un día para ahorrar ancho de banda
    redirect: false
};
app.use(express.static(path.join(__dirname), cacheOptions));

// 4. MANEJO DE RUTAS (Escalabilidad Híbrida)
// Endpoint base para el Frontend de Cero Absoluto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint técnico de auditoría de salud (Health Check) - Vital para monitoreo y DevOps
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 5. CONTROLADOR GLOBAL DE ERRORES (Robustez y Antifragilidad)
// Captura cualquier fallo en el sistema para evitar que el servidor se caiga (Crash)
app.use((err, req, res, next) => {
    console.error(`[ERROR SEVERO]: ${err.message}`);
    res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error interno en el servidor seguro.'
    });
});

// Inicialización física del servicio
app.listen(PORT, () => {
    console.log(`\n=========================================================`);
    console.log(`🚀 SERVIDOR SEGURO CORRIENDO EN EL PUERTO: ${PORT}`);
    console.log(`🛡️  Seguridad Helmet: ACTIVADA`);
    console.log(`🛑 Rate Limiter: ACTIVADO (Max 100 peticiones / 15 min)`);
    console.log(`🌍 Entorno Actual: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=========================================================\n`);
});