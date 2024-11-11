const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Cambié la URL para coincidir con el origen del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true  // Activa credenciales si es necesario
}));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Middlewares
app.use(express.json());

// Rutas de la API
app.use('/api/users', userRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
