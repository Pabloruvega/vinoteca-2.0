import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { enviarEmail } from '../utils/sendEmail.js';

// Fix #1: Sin fallback hardcodeado. Si JWT_SECRET no existe, generateToken lanza error
// en lugar de usar un secreto conocido públicamente.
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no configurado');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Fix #3: Registro ahora es público (ruta cambiada en userRouter.js)
export const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios' });
        }

        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ mensaje: 'El email ya existe' });

        // Solo se puede registrar como admin si la solicitud viene de un admin autenticado.
        // Para registro público, isAdmin siempre es false.
        const nuevoUsuario = new User({
            username: nombre,
            email,
            password,
            isAdmin: false // El rol admin solo lo asigna otro admin desde el panel
        });

        await nuevoUsuario.save();
        res.status(201).json({
            mensaje: 'Usuario creado con éxito',
            _id: nuevoUsuario._id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
            isAdmin: nuevoUsuario.isAdmin,
            token: generateToken(nuevoUsuario._id),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
    }
};

// Crear usuario desde panel admin (puede asignar rol admin)
export const crearUsuarioAdmin = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios' });
        }

        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ mensaje: 'El email ya existe' });

        const nuevoUsuario = new User({
            username: nombre,
            email,
            password,
            isAdmin: rol === 'admin'
        });

        await nuevoUsuario.save();
        res.status(201).json({
            mensaje: 'Usuario creado con éxito',
            _id: nuevoUsuario._id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
            isAdmin: nuevoUsuario.isAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar', error: error.message });
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-password');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
};

// Fix #5: No permitir que un admin se elimine a sí mismo
export const deleteUsuario = async (req, res) => {
    try {
        // Prevenir auto-eliminación
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ mensaje: 'No podés eliminar tu propia cuenta' });
        }

        const eliminado = await User.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
};

// Fix #4: updateUsuario ahora hashea correctamente la contraseña si se envía una nueva.
// El problema original era usar findByIdAndUpdate que bypasea el hook pre('save') de Mongoose.
export const updateUsuario = async (req, res) => {
    try {
        const { nombre, email, rol, password } = req.body;

        // Buscamos el usuario para poder usar .save() y activar el hook de hashing
        const usuario = await User.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (nombre) usuario.username = nombre;
        if (email) usuario.email = email;
        if (rol !== undefined) usuario.isAdmin = rol === 'admin';

        // Si se envió nueva contraseña, asignarla en texto plano:
        // el hook pre('save') del modelo la va a hashear automáticamente
        if (password && password.trim() !== '') {
            usuario.password = password;
        }

        const usuarioActualizado = await usuario.save();

        res.json({
            mensaje: 'Usuario actualizado con éxito',
            usuarioActualizado: {
                _id: usuarioActualizado._id,
                username: usuarioActualizado.username,
                email: usuarioActualizado.email,
                isAdmin: usuarioActualizado.isAdmin,
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar', error: error.message });
    }
};

// Cambio de contraseña por el propio usuario logueado (requiere la actual)
export const cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;

        if (!passwordActual || !passwordNueva) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }
        if (passwordNueva.length < 6) {
            return res.status(400).json({ mensaje: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        const usuario = await User.findById(req.user._id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const coincide = await bcrypt.compare(passwordActual, usuario.password);
        if (!coincide) {
            return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
        }

        usuario.password = passwordNueva;
        await usuario.save();

        res.json({ mensaje: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al cambiar la contraseña', error: error.message });
    }
};

// Solicitud de recuperación de contraseña por email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ mensaje: 'El email es obligatorio' });
        }

        // Mensaje de respuesta siempre igual, exista o no el email,
        // para no revelar qué emails están registrados.
        const mensajeGenerico = { mensaje: 'Si el email existe, vas a recibir un link para restablecer tu contraseña.' };

        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.json(mensajeGenerico);
        }

        const tokenCrudo = crypto.randomBytes(32).toString('hex');
        usuario.resetPasswordToken = crypto.createHash('sha256').update(tokenCrudo).digest('hex');
        usuario.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
        await usuario.save();

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${tokenCrudo}`;

        await enviarEmail({
            to: usuario.email,
            subject: 'Recuperar contraseña — Bodega G1',
            text: `Recibimos una solicitud para restablecer tu contraseña. Entrá a este link (válido por 1 hora): ${resetUrl}\n\nSi no fuiste vos, ignorá este email.`,
            html: `<p>Recibimos una solicitud para restablecer tu contraseña.</p><p><a href="${resetUrl}">Restablecer contraseña</a> (válido por 1 hora)</p><p>Si no fuiste vos, ignorá este email.</p>`,
        });

        res.json(mensajeGenerico);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar la solicitud', error: error.message });
    }
};

// Restablecimiento de contraseña con el token recibido por email
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
        }

        const tokenHasheado = crypto.createHash('sha256').update(token).digest('hex');

        const usuario = await User.findOne({
            resetPasswordToken: tokenHasheado,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!usuario) {
            return res.status(400).json({ mensaje: 'El link es inválido o expiró' });
        }

        usuario.password = password;
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        await usuario.save();

        res.json({ mensaje: 'Contraseña restablecida con éxito' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al restablecer la contraseña', error: error.message });
    }
};

export const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};
