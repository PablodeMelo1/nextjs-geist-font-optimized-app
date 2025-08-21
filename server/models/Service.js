const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del servicio es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  duration: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: [15, 'La duración mínima es 15 minutos'],
    max: [480, 'La duración máxima es 8 horas']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['corte', 'coloracion', 'tratamiento', 'manicura', 'pedicura', 'masaje', 'facial', 'depilacion', 'otro'],
    default: 'otro'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
