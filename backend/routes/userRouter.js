import express from 'express';
import {
    registrarUsuario,
    crearUsuarioAdmin,
    getUsuarios,
    deleteUsuario,
    updateUsuario,
    authUser
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/login', authUser);

// Fix #3: Registro ahora es público, cualquiera puede crear una cuenta.
// isAdmin siempre queda en false en este endpoint.
router.post('/registro', registrarUsuario);

// Rutas solo para admins
router.post('/admin/crear', protect, admin, crearUsuarioAdmin);  // Admin crea usuario con rol
router.get('/', protect, admin, getUsuarios);
router.delete('/:id', protect, admin, deleteUsuario);
router.put('/:id', protect, admin, updateUsuario);

export default router;
