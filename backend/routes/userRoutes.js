const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de que el modelo de usuario esté definido

// Ruta de registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verifica si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ msg: 'El usuario ya existe' });

        // Cifra la contraseña antes de guardarla
        const salt = await bcrypt.genSalt(10); // Genera un salt
        const hashedPassword = await bcrypt.hash(password, salt); // Cifra la contraseña

        // Crea un nuevo usuario con la contraseña cifrada
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.json({ msg: 'Usuario registrado con éxito', user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        // Generar un token JWT
        const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '1h' });

        // Devolver el token y la información del usuario (sin la contraseña)
        res.json({
            msg: 'Login exitoso',
            token,
            user: { id: user._id, username: user.username }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

module.exports = router;
