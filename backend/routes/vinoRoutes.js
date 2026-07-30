import express from 'express';
import { getVinos, getVinoById, createVino, deleteVino, updateVino } from '../controllers/vinoController.js';
import { protect, staff } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Obtener vinos (ruta pública para que el Shop pueda ver el catálogo sin login)
router.get('/', getVinos);
router.get('/:id', getVinoById);

// Crear vino (solo admin o empleado autenticado) - acepta imagen
router.post('/', protect, staff, upload.single('image'), createVino);

// Editar vino (solo admin o empleado autenticado) - acepta imagen
router.put('/:id', protect, staff, upload.single('image'), updateVino);

// Eliminar vino (solo admin o empleado autenticado)
router.delete('/:id', protect, staff, deleteVino);

export default router;
