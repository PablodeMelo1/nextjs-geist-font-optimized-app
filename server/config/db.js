const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Usar MongoDB local por defecto o Atlas si está configurado
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/turnos-app';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log(`Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    console.log('Intentando continuar sin base de datos para pruebas...');
    // No salir del proceso para permitir pruebas de API
  }
};

module.exports = connectDB;
