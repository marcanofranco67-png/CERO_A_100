require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');

const ceroSeguridad = require('@marcanofranco67-png/cero-seguridad-lib');
const conectarDB = require('./config/db');
const proyectoRoutes = require('./routes/proyectoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

conectarDB();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

const limtiadorPeticiones = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { error: 'Demasiadas peticiones desde esta IP. Inténtalo más tarde.' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(limtiadorPeticiones);

app.use('/api/proyectos', proyectoRoutes);

app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'online',
        message: 'Ecosistema Cero Absoluto - Infraestructura de Growth Partner Activa.',
        version: '1.0.0'
    });
});

app.use((err, req, res, next) => {
    console.error(`[Error del Servidor]: ${err.message}`);
    res.status(500).json({ error: 'Fallo interno en la infraestructura segura.' });
});

app.listen(PORT, () => {
    console.log(`\n🛸 [CERO ABSOLUTO RUNNING]`);
    console.log(`🛸 Servidor seguro escuchando en: http://localhost:${PORT}`);
    console.log(`🛸 Blindaje perimetral activo (Helmet + Rate-Limit)\n`);
});