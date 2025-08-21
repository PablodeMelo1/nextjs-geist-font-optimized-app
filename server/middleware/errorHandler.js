const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.code === 11000) {
    let message = 'Recurso duplicado';
    const field = Object.keys(err.keyValue)[0];
    if (field === 'email') {
      message = 'El email ya está registrado';
    }
    error = {
      message,
      statusCode: 400
    };
  }

  if (err.name === 'CastError') {
    const message = 'ID de recurso inválido';
    error = {
      message,
      statusCode: 404
    };
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = {
      message,
      statusCode: 401
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;
