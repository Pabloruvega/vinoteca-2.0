import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// El chequeo de JWT_SECRET se removió de acá y se centralizó en server.js,
// justo después de dotenv.config(). Esto evita el problema de ES Modules
// donde los imports se evalúan antes de que el módulo padre ejecute.

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
            }

            return next();
        } catch (error) {
            console.error('Error de token JWT:', error.message);
            return res.status(401).json({ message: 'No autorizado, token falló o está mal formado' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'No autorizado como administrador' });
    }
};