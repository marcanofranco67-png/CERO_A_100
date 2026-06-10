// ============================================================================
// ARCHIVO MAESTRO DEL SERVIDOR - CERO ABSOLUTO (PRODUCCIÓN REFACTORIZADO)
// Ecosistema seguro, escalable y eficiente utilizando librerías modulares
// ============================================================================

const express = require('express');
const path = require('path');
// Importación de tu propia librería de seguridad de nivel mundial
const { aplicarSeguridad } = require('@marcanofranco67-png/cero-seguridad-lib');

// Inicialización de la infraestructura de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 1. BLINDAJE DE SEGURIDAD MODULAR (Tu propia librería)
// Inyecta automáticamente Helmet (CSP) y Express Rate Limit en una sola línea
aplicarSeguridad(app);

// Parsers eficientes para el manejo de datos entrantes sin sobrecargar la memoria
app.use(express.json({ limit: '10kb' })); // Protege contra DoS por JSON masivos
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 2. CAPA DE EFICIENCIA Y RENDIMIENTO (Servicio Estático)
const cacheOptions = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['html', 'htm', 'css', 'js'],
    index: 'index.html',
    maxAge: '1d', // Cachea recursos estáticos por un día
    redirect: false
};
app.use(express.static(path.join(__dirname), cacheOptions));

// 3. MANEJO DE RUTAS (Escalabilidad Híbrida)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint técnico de auditoría de salud (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        security: 'Modular Perimeter Active'
    });
});

// 4. CONTROLADOR GLOBAL DE ERRORES (Robustez y Antifragilidad)
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
    console.log(`?? SERVIDOR SEGURO CORRIENDO EN EL PUERTO: ${PORT}`);
    console.log(`???  Ecosistema de Seguridad: COMPONENTE GLOBAL INTEGRADO`);
    console.log(`?? Dependencia: @marcanofranco67-png/cero-seguridad-lib`);
    console.log(`=========================================================\n`);
});
