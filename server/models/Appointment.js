const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El cliente es requerido']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'El servicio es requerido']
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: false // Opcional, puede ser asignado automáticamente
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  time: {
    type: String,
    required: [true, 'La hora es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  totalPrice: {
    type: Number,
    required: [true, 'El precio total es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'mercadopago', 'stripe'],
    default: 'cash'
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar citas duplicadas
appointmentSchema.index({ employee: 1, date: 1, time: 1 }, { 
  unique: true,
  partialFilterExpression: { 
    status: { $in: ['pending', 'confirmed'] },
    employee: { $exists: true }
  }
});

// Método para verificar disponibilidad
appointmentSchema.statics.checkAvailability = async function(employeeId, date, time, excludeId = null) {
  const query = {
    employee: employeeId,
    date: date,
    time: time,
    status: { $in: ['pending', 'confirmed'] }
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const existingAppointment = await this.findOne(query);
  return !existingAppointment;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
