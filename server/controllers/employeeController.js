const Employee = require('../models/Employee');
const Service = require('../models/Service');
const { validationResult } = require('express-validator');

// @desc    Obtener todos los empleados
// @route   GET /api/employees
// @access  Public
const getEmployees = async (req, res, next) => {
  try {
    const { isActive, serviceId } = req.query;
    
    let filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (serviceId) filter.services = serviceId;

    const employees = await Employee.find(filter).populate('services', 'name duration price');
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un empleado por ID
// @route   GET /api/employees/:id
// @access  Public
const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('services', 'name duration price category');
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear nuevo empleado
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const employee = await Employee.create(req.body);
    
    // Si se proporcionaron servicios, actualizar la relación bidireccional
    if (req.body.services && req.body.services.length > 0) {
      await Service.updateMany(
        { _id: { $in: req.body.services } },
        { $addToSet: { employees: employee._id } }
      );
    }
    
    await employee.populate('services', 'name duration price');
    
    res.status(201).json({
      success: true,
      message: 'Empleado creado exitosamente',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar empleado
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const oldEmployee = await Employee.findById(req.params.id);
    if (!oldEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    // Actualizar empleado
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('services', 'name duration price');

    // Actualizar relaciones de servicios si cambiaron
    if (req.body.services) {
      // Remover empleado de servicios anteriores
      await Service.updateMany(
        { employees: employee._id },
        { $pull: { employees: employee._id } }
      );
      
      // Agregar empleado a nuevos servicios
      await Service.updateMany(
        { _id: { $in: req.body.services } },
        { $addToSet: { employees: employee._id } }
      );
    }

    res.json({
      success: true,
      message: 'Empleado actualizado exitosamente',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar empleado
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    // Remover empleado de todos los servicios
    await Service.updateMany(
      { employees: employee._id },
      { $pull: { employees: employee._id } }
    );

    // Soft delete - marcar como inactivo
    employee.isActive = false;
    await employee.save();

    res.json({
      success: true,
      message: 'Empleado eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Asignar servicios a empleado
// @route   POST /api/employees/:id/services
// @access  Private/Admin
const assignServices = async (req, res, next) => {
  try {
    const { serviceIds } = req.body;
    
    if (!serviceIds || !Array.isArray(serviceIds)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de IDs de servicios'
      });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    // Verificar que los servicios existen
    const services = await Service.find({ _id: { $in: serviceIds } });
    if (services.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Uno o más servicios no existen'
      });
    }

    // Actualizar empleado
    employee.services = serviceIds;
    await employee.save();

    // Actualizar servicios
    await Service.updateMany(
      { employees: employee._id },
      { $pull: { employees: employee._id } }
    );
    
    await Service.updateMany(
      { _id: { $in: serviceIds } },
      { $addToSet: { employees: employee._id } }
    );

    await employee.populate('services', 'name duration price');

    res.json({
      success: true,
      message: 'Servicios asignados exitosamente',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener disponibilidad de empleado
// @route   GET /api/employees/:id/availability
// @access  Public
const getAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Empleado no encontrado'
      });
    }

    // Obtener día de la semana
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const workingHours = employee.workingHours[dayOfWeek];

    if (!workingHours.isWorking) {
      return res.json({
        success: true,
        data: {
          isWorking: false,
          availableSlots: []
        }
      });
    }

    // Generar slots de tiempo disponibles (cada 30 minutos)
    const slots = [];
    const startTime = workingHours.start;
    const endTime = workingHours.end;
    
    let currentTime = new Date(`2000-01-01 ${startTime}`);
    const endDateTime = new Date(`2000-01-01 ${endTime}`);

    while (currentTime < endDateTime) {
      slots.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    res.json({
      success: true,
      data: {
        isWorking: true,
        workingHours,
        availableSlots: slots
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignServices,
  getAvailability
};
