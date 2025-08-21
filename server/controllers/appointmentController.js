const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Obtener todas las citas
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    const { status, date, employee, client } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }
    if (employee) filter.employee = employee;
    if (client) filter.client = client;

    // Si no es admin, solo mostrar sus propias citas
    if (req.user.role !== 'admin') {
      filter.client = req.user.id;
    }

    const appointments = await Appointment.find(filter)
      .populate('client', 'name email phone')
      .populate('service', 'name duration price category')
      .populate('employee', 'name specialization')
      .sort({ date: 1, time: 1 });
    
    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener una cita por ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'name email phone')
      .populate('service', 'name duration price category description')
      .populate('employee', 'name specialization phone email');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && appointment.client._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver esta cita'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nueva cita
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { service: serviceId, employee: employeeId, date, time, notes } = req.body;

    // Verificar que el servicio existe
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado o inactivo'
      });
    }

    let employee = null;
    
    // Si se especifica empleado, verificar que existe y puede realizar el servicio
    if (employeeId) {
      employee = await Employee.findById(employeeId);
      if (!employee || !employee.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Empleado no encontrado o inactivo'
        });
      }

      if (!employee.services.includes(serviceId)) {
        return res.status(400).json({
          success: false,
          message: 'El empleado no puede realizar este servicio'
        });
      }

      // Verificar disponibilidad
      const isAvailable = await Appointment.checkAvailability(employeeId, new Date(date), time);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'El empleado no está disponible en esa fecha y hora'
        });
      }
    } else {
      // Asignar empleado automáticamente
      const availableEmployees = await Employee.find({
        services: serviceId,
        isActive: true
      });

      for (let emp of availableEmployees) {
        const isAvailable = await Appointment.checkAvailability(emp._id, new Date(date), time);
        if (isAvailable) {
          employee = emp;
          break;
        }
      }

      if (!employee) {
        return res.status(400).json({
          success: false,
          message: 'No hay empleados disponibles para esa fecha y hora'
        });
      }
    }

    // Crear la cita
    const appointment = await Appointment.create({
      client: req.user.id,
      service: serviceId,
      employee: employee._id,
      date: new Date(date),
      time,
      notes,
      totalPrice: service.price,
      createdBy: req.user.role === 'admin' ? 'admin' : 'client'
    });

    // Agregar cita al historial del usuario
    await User.findByIdAndUpdate(req.user.id, {
      $push: { appointmentHistory: appointment._id }
    });

    await appointment.populate([
      { path: 'client', select: 'name email phone' },
      { path: 'service', select: 'name duration price category' },
      { path: 'employee', select: 'name specialization' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar cita
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && appointment.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para modificar esta cita'
      });
    }

    // No permitir modificar citas completadas o canceladas
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'No se puede modificar una cita completada o cancelada'
      });
    }

    const { employee: employeeId, date, time, status, notes } = req.body;

    // Si se cambia empleado, fecha o hora, verificar disponibilidad
    if (employeeId || date || time) {
      const newEmployeeId = employeeId || appointment.employee;
      const newDate = date ? new Date(date) : appointment.date;
      const newTime = time || appointment.time;

      const isAvailable = await Appointment.checkAvailability(
        newEmployeeId, 
        newDate, 
        newTime, 
        appointment._id
      );

      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'El empleado no está disponible en esa fecha y hora'
        });
      }
    }

    // Actualizar cita
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate([
      { path: 'client', select: 'name email phone' },
      { path: 'service', select: 'name duration price category' },
      { path: 'employee', select: 'name specialization' }
    ]);

    res.json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancelar cita
// @route   DELETE /api/appointments/:id
// @access  Private
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && appointment.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para cancelar esta cita'
      });
    }

    // No permitir cancelar citas ya completadas
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una cita completada'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas de citas
// @route   GET /api/appointments/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    const serviceStats = await Appointment.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceInfo'
        }
      },
      { $unwind: '$serviceInfo' },
      {
        $group: {
          _id: '$service',
          serviceName: { $first: '$serviceInfo.name' },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        serviceStats: serviceStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getStats
};
