const express = require('express');
const { body } = require('express-validator');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignServices,
  getAvailability
} = require('../controllers/employeeController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validaciones para crear/actualizar empleado
const employeeValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('phone')
    .isMobilePhone('es-ES')
    .withMessage('Debe ser un número de teléfono válido'),
  body('specialization')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La especialización debe tener entre 2 y 100 caracteres'),
  body('services')
    .optional()
    .isArray()
    .withMessage('Los servicios deben ser un array'),
  body('services.*')
    .optional()
    .isMongoId()
    .withMessage('ID de servicio inválido'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser un valor booleano')
];

// Validaciones para horarios de trabajo
const workingHoursValidation = [
  body('workingHours.*.start')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora de inicio inválido (HH:MM)'),
  body('workingHours.*.end')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora de fin inválido (HH:MM)'),
  body('workingHours.*.isWorking')
    .optional()
    .isBoolean()
    .withMessage('isWorking debe ser un valor booleano')
];

// Validaciones para asignar servicios
const assignServicesValidation = [
  body('serviceIds')
    .isArray({ min: 1 })
    .withMessage('Se requiere al menos un servicio'),
  body('serviceIds.*')
    .isMongoId()
    .withMessage('ID de servicio inválido')
];

// Rutas públicas
// @route   GET /api/employees
// @desc    Obtener todos los empleados
// @access  Public
router.get('/', getEmployees);

// @route   GET /api/employees/:id
// @desc    Obtener empleado por ID
// @access  Public
router.get('/:id', getEmployee);

// @route   GET /api/employees/:id/availability
// @desc    Obtener disponibilidad de empleado
// @access  Public
router.get('/:id/availability', getAvailability);

// Rutas privadas (solo admin)
// @route   POST /api/employees
// @desc    Crear nuevo empleado
// @access  Private/Admin
router.post('/', protect, admin, [...employeeValidation, ...workingHoursValidation], createEmployee);

// @route   PUT /api/employees/:id
// @desc    Actualizar empleado
// @access  Private/Admin
router.put('/:id', protect, admin, [...employeeValidation, ...workingHoursValidation], updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Eliminar empleado (soft delete)
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteEmployee);

// @route   POST /api/employees/:id/services
// @desc    Asignar servicios a empleado
// @access  Private/Admin
router.post('/:id/services', protect, admin, assignServicesValidation, assignServices);

module.exports = router;
