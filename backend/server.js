const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Cambia esto si tu frontend está en otro dominio
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true  // Activa credenciales si es necesario
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((err) => {
        console.error('Error al conectar a MongoDB:', err);
        process.exit(1); // Finaliza el proceso si no se conecta
    });

// Debugging adicional para conexión a MongoDB
mongoose.connection.on('connected', () => {
    console.log('MongoDB está conectado');
});

mongoose.connection.on('error', (err) => {
    console.error('Error en la conexión a MongoDB:', err);
});

// Middlewares
app.use(express.json()); // Procesa cuerpos JSON en las solicitudes

// Rutas de la API
app.use('/api/users', userRoutes);

// Manejo de errores no manejados
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ msg: 'Error interno del servidor' });
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
