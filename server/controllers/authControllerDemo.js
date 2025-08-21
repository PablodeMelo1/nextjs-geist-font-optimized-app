const { generateToken } = require('../config/jwt');

// Datos de prueba en memoria
const demoUsers = [
  {
    _id: '1',
    name: 'Administrador Demo',
    email: 'admin@turnos.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'admin',
    phone: '+54 9 11 1234-5678',
    isActive: true
  },
  {
    _id: '2',
    name: 'Cliente Demo',
    email: 'cliente@turnos.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // cliente123
    role: 'client',
    phone: '+54 9 11 9876-5432',
    isActive: true
  }
];

let userIdCounter = 3;

// Registro de usuario
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = demoUsers.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe con ese email'
      });
    }

    // Crear nuevo usuario (en producción se hashearia la contraseña)
    const newUser = {
      _id: userIdCounter.toString(),
      name,
      email,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Hash demo
      role: 'client',
      phone: phone || '',
      isActive: true,
      createdAt: new Date()
    };

    demoUsers.push(newUser);
    userIdCounter++;

    // Generar token
    const token = generateToken({ id: newUser._id });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = demoUsers.find(u => u.email === email && u.isActive);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // En producción se verificaría la contraseña hasheada
    // Por ahora aceptamos cualquier contraseña para demo
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken({ id: user._id });

    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = demoUsers.find(u => u._id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
