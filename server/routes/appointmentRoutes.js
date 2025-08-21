const express = require('express');
const { body } = require('express-validator');
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getStats
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Validaciones para crear cita
const createAppointmentValidation = [
  body('service')
    .isMongoId()
    .withMessage('ID de servicio inválido'),
  body('employee')
    .optional()
    .isMongoId()
    .withMessage('ID de empleado inválido'),
  body('date')
    .isISO8601()
    .toDate()
    .withMessage('Fecha inválida (formato ISO8601)'),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido (HH:MM)'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres')
];

// Validaciones para actualizar cita
const updateAppointmentValidation = [
  body('service')
    .optional()
    .isMongoId()
    .withMessage('ID de servicio inválido'),
  body('employee')
    .optional()
    .isMongoId()
    .withMessage('ID de empleado inválido'),
  body('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Fecha inválida (formato ISO8601)'),
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de hora inválido (HH:MM)'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no-show'])
    .withMessage('Estado inválido'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'refunded'])
    .withMessage('Estado de pago inválido'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'transfer', 'mercadopago', 'stripe'])
    .withMessage('Método de pago inválido')
];

// Rutas privadas
// @route   GET /api/appointments
// @desc    Obtener citas (todas para admin, propias para usuario)
// @access  Private
router.get('/', protect, getAppointments);

// @route   GET /api/appointments/stats
// @desc    Obtener estadísticas de citas
// @access  Private/Admin
router.get('/stats', protect, admin, getStats);

// @route   GET /api/appointments/:id
// @desc    Obtener cita por ID
// @access  Private
router.get('/:id', protect, getAppointment);

// @route   POST /api/appointments
// @desc    Crear nueva cita
// @access  Private
router.post('/', protect, createAppointmentValidation, createAppointment);

// @route   PUT /api/appointments/:id
// @desc    Actualizar cita
// @access  Private
router.put('/:id', protect, updateAppointmentValidation, updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Cancelar cita
// @access  Private
router.delete('/:id', protect, cancelAppointment);

module.exports = router;
