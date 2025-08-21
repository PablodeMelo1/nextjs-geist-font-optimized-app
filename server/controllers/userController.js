const User = require('../models/User');
const Appointment = require('../models/Appointment');
const { validationResult } = require('express-validator');

// @desc    Obtener perfil del usuario
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate({
        path: 'appointmentHistory',
        populate: [
          { path: 'service', select: 'name duration price category' },
          { path: 'employee', select: 'name specialization' }
        ],
        options: { sort: { date: -1 } }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener historial de citas del usuario
// @route   GET /api/users/appointments
// @access  Private
const getUserAppointments = async (req, res, next) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    let filter = { client: req.user.id };
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('service', 'name duration price category')
      .populate('employee', 'name specialization')
      .sort({ date: -1, time: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(filter);

    res.json({
      success: true,
      count: appointments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener próximas citas del usuario
// @route   GET /api/users/upcoming-appointments
// @access  Private
const getUpcomingAppointments = async (req, res, next) => {
  try {
    const now = new Date();
    
    const appointments = await Appointment.find({
      client: req.user.id,
      date: { $gte: now },
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('service', 'name duration price category')
      .populate('employee', 'name specialization')
      .sort({ date: 1, time: 1 })
      .limit(5);

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener estadísticas del usuario
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total de citas
    const totalAppointments = await Appointment.countDocuments({ client: userId });

    // Citas por estado
    const appointmentsByStatus = await Appointment.aggregate([
      { $match: { client: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Servicios más utilizados
    const favoriteServices = await Appointment.aggregate([
      { $match: { client: userId } },
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
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Gasto total
    const totalSpent = await Appointment.aggregate([
      { 
        $match: { 
          client: userId,
          status: { $in: ['completed', 'confirmed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalAppointments,
        appointmentsByStatus,
        favoriteServices,
        totalSpent: totalSpent[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todos los usuarios (solo admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const { role, isActive, limit = 20, page = 1 } = req.query;
    
    let filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuario por ID (solo admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'appointmentHistory',
        populate: [
          { path: 'service', select: 'name duration price category' },
          { path: 'employee', select: 'name specialization' }
        ],
        options: { sort: { date: -1 } }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar usuario (solo admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { name, phone, role, isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, role, isActive },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUserAppointments,
  getUpcomingAppointments,
  getUserStats,
  getUsers,
  getUserById,
  updateUser
};
