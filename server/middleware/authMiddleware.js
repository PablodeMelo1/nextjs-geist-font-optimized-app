const { verifyToken } = require('../config/jwt');

// Datos de prueba en memoria (mismo que en authControllerDemo)
const demoUsers = [
  {
    _id: '1',
    name: 'Administrador Demo',
    email: 'admin@turnos.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'admin',
    phone: '+54 9 11 1234-5678',
    isActive: true
  },
  {
    _id: '2',
    name: 'Cliente Demo',
    email: 'cliente@turnos.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'client',
    phone: '+54 9 11 9876-5432',
    isActive: true
  }
];

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = verifyToken(token);

      // Obtener usuario del array demo
      const user = demoUsers.find(u => u._id === decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Usuario inactivo'
        });
      }

      // Asignar usuario sin password
      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      };

      next();
    } catch (error) {
      console.error('Error en middleware de autenticación:', error);
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token requerido'
    });
  }
};

// Middleware para verificar rol de administrador
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
};

module.exports = { protect, admin };
