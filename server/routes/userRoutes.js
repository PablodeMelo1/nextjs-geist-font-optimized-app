const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getUserAppointments,
  getUpcomingAppointments,
  getUserStats,
  getUsers,
  getUserById,
  updateUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validaciones para actualizar perfil
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('phone')
    .optional()
    .isMobilePhone('es-ES')
    .withMessage('Debe ser un número de teléfono válido')
];

// Validaciones para actualizar usuario (admin)
const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('phone')
    .optional()
    .isMobilePhone('es-ES')
    .withMessage('Debe ser un número de teléfono válido'),
  body('role')
    .optional()
    .isIn(['client', 'admin'])
    .withMessage('El rol debe ser client o admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un valor booleano')
];

// Rutas para usuarios normales
// @route   GET /api/users/profile
// @desc    Obtener perfil del usuario actual
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Actualizar perfil del usuario actual
// @access  Private
router.put('/profile', protect, updateProfileValidation, updateProfile);

// @route   GET /api/users/appointments
// @desc    Obtener citas del usuario actual
// @access  Private
router.get('/appointments', protect, getUserAppointments);

// @route   GET /api/users/upcoming-appointments
// @desc    Obtener próximas citas del usuario actual
// @access  Private
router.get('/upcoming-appointments', protect, getUpcomingAppointments);

// @route   GET /api/users/stats
// @desc    Obtener estadísticas del usuario actual
// @access  Private
router.get('/stats', protect, getUserStats);

// Rutas para administradores
// @route   GET /api/users
// @desc    Obtener todos los usuarios
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @route   GET /api/users/:id
// @desc    Obtener usuario por ID
// @access  Private/Admin
router.get('/:id', protect, admin, getUserById);

// @route   PUT /api/users/:id
// @desc    Actualizar usuario por ID
// @access  Private/Admin
router.put('/:id', protect, admin, updateUserValidation, updateUser);

module.exports = router;
