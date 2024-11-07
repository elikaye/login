const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); // Importa las rutas

// Configura dotenv para leer el archivo .env
dotenv.config();

// Crea una instancia de Express
const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado a MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

// Middleware para analizar JSON
app.use(express.json());

// Conecta la ruta de usuarios
app.use('/api/users', userRoutes);

// Inicia el servidor en el puerto deseado
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
