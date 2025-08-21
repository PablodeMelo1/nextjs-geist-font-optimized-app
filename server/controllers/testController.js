// Controlador de prueba sin base de datos
const { generateToken } = require('../config/jwt');

// Simulación de datos en memoria
let users = [];
let services = [
  {
    id: '1',
    name: 'Corte de Cabello',
    description: 'Corte de cabello profesional',
    duration: 30,
    price: 25,
    category: 'corte',
    isActive: true
  },
  {
    id: '2',
    name: 'Coloración',
    description: 'Coloración completa del cabello',
    duration: 120,
    price: 80,
    category: 'coloracion',
    isActive: true
  },
  {
    id: '3',
    name: 'Manicura',
    description: 'Manicura completa con esmaltado',
    duration: 45,
    price: 20,
    category: 'manicura',
    isActive: true
  }
];

let employees = [
  {
    id: '1',
    name: 'María García',
    email: 'maria@salon.com',
    phone: '+34123456789',
    specialization: 'Estilista Senior',
    services: ['1', '2'],
    isActive: true
  },
  {
    id: '2',
    name: 'Ana López',
    email: 'ana@salon.com',
    phone: '+34987654321',
    specialization: 'Especialista en Manicura',
    services: ['3'],
    isActive: true
  }
];

let appointments = [];

// @desc    Registrar usuario (versión de prueba)
// @route   POST /api/test/register
// @access  Public
const testRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe con este email'
      });
    }

    // Crear usuario
    const user = {
      id: (users.length + 1).toString(),
      name,
      email,
      role: 'client',
      createdAt: new Date()
    };

    users.push(user);

    // Generar token
    const token = generateToken({ id: user.id });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Iniciar sesión (versión de prueba)
// @route   POST /api/test/login
// @access  Public
const testLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken({ id: user.id });

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener servicios (versión de prueba)
// @route   GET /api/test/services
// @access  Public
const testGetServices = async (req, res) => {
  try {
    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener empleados (versión de prueba)
// @route   GET /api/test/employees
// @access  Public
const testGetEmployees = async (req, res) => {
  try {
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Crear cita (versión de prueba)
// @route   POST /api/test/appointments
// @access  Public
const testCreateAppointment = async (req, res) => {
  try {
    const { clientName, clientEmail, serviceId, employeeId, date, time } = req.body;

    if (!clientName || !clientEmail || !serviceId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Buscar servicio
    const service = services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    // Buscar empleado si se especifica
    let employee = null;
    if (employeeId) {
      employee = employees.find(e => e.id === employeeId);
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Empleado no encontrado'
        });
      }
    } else {
      // Asignar empleado automáticamente
      employee = employees.find(e => e.services.includes(serviceId));
    }

    // Crear cita
    const appointment = {
      id: (appointments.length + 1).toString(),
      clientName,
      clientEmail,
      service,
      employee,
      date,
      time,
      status: 'pending',
      totalPrice: service.price,
      createdAt: new Date()
    };

    appointments.push(appointment);

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener citas (versión de prueba)
// @route   GET /api/test/appointments
// @access  Public
const testGetAppointments = async (req, res) => {
  try {
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  testRegister,
  testLogin,
  testGetServices,
  testGetEmployees,
  testCreateAppointment,
  testGetAppointments
};
