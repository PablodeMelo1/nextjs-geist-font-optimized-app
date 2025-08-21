const express = require('express');
const { body } = require('express-validator');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories
} = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validaciones para crear/actualizar servicio
const serviceValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('La duración debe ser entre 15 y 480 minutos'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('category')
    .isIn(['corte', 'coloracion', 'tratamiento', 'manicura', 'pedicura', 'masaje', 'facial', 'depilacion', 'otro'])
    .withMessage('Categoría inválida'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un valor booleano')
];

// Rutas públicas
// @route   GET /api/services
// @desc    Obtener todos los servicios
// @access  Public
router.get('/', getServices);

// @route   GET /api/services/categories
// @desc    Obtener categorías de servicios
// @access  Public
router.get('/categories', getCategories);

// @route   GET /api/services/:id
// @desc    Obtener servicio por ID
// @access  Public
router.get('/:id', getService);

// Rutas privadas (solo admin)
// @route   POST /api/services
// @desc    Crear nuevo servicio
// @access  Private/Admin
router.post('/', protect, admin, serviceValidation, createService);

// @route   PUT /api/services/:id
// @desc    Actualizar servicio
// @access  Private/Admin
router.put('/:id', protect, admin, serviceValidation, updateService);

// @route   DELETE /api/services/:id
// @desc    Eliminar servicio (soft delete)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteService);

module.exports = router;
