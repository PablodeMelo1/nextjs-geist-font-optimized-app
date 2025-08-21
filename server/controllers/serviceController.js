const Service = require('../models/Service');
const { validationResult } = require('express-validator');

// @desc    Obtener todos los servicios
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const { category, isActive } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const services = await Service.find(filter).populate('employees', 'name specialization');
    
    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un servicio por ID
// @route   GET /api/services/:id
// @access  Public
const getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('employees', 'name specialization workingHours');
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nuevo servicio
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const service = await Service.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar servicio
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar servicio
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    // Soft delete - marcar como inactivo
    service.isActive = false;
    await service.save();

    res.json({
      success: true,
      message: 'Servicio eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener categorías de servicios
// @route   GET /api/services/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Service.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getCategories
};
