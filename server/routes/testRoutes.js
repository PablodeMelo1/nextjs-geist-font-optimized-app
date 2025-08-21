const express = require('express');
const {
  testRegister,
  testLogin,
  testGetServices,
  testGetEmployees,
  testCreateAppointment,
  testGetAppointments
} = require('../controllers/testController');

const router = express.Router();

// Rutas de prueba sin base de datos
// @route   POST /api/test/register
// @desc    Registrar usuario (prueba)
// @access  Public
router.post('/register', testRegister);

// @route   POST /api/test/login
// @desc    Iniciar sesión (prueba)
// @access  Public
router.post('/login', testLogin);

// @route   GET /api/test/services
// @desc    Obtener servicios (prueba)
// @access  Public
router.get('/services', testGetServices);

// @route   GET /api/test/employees
// @desc    Obtener empleados (prueba)
// @access  Public
router.get('/employees', testGetEmployees);

// @route   POST /api/test/appointments
// @desc    Crear cita (prueba)
// @access  Public
router.post('/appointments', testCreateAppointment);

// @route   GET /api/test/appointments
// @desc    Obtener citas (prueba)
// @access  Public
router.get('/appointments', testGetAppointments);

module.exports = router;
