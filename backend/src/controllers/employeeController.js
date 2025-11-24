const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const asyncHandler = require('../utils/asyncHandler');

const removeFile = (fileRelativePath) => {
  if (!fileRelativePath) return;
  const normalizedPath = fileRelativePath.startsWith('/')
    ? fileRelativePath.substring(1)
    : fileRelativePath;
  const absolutePath = path.join(__dirname, '..', '..', normalizedPath);
  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.warn('Failed to delete file:', err.message);
    }
  });
};

const removeUploadedTempFile = (file) => {
  if (!file?.path) return;
  fs.unlink(file.path, (err) => {
    if (err) {
      console.warn('Failed to delete temp file:', err.message);
    }
  });
};

const formatValidationErrors = (errors) =>
  errors
    .array()
    .map((err) => `${err.param}: ${err.msg}`)
    .join(', ');

const buildImagePath = (filename) => (filename ? `/uploads/${filename}` : undefined);

exports.createEmployee = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    removeUploadedTempFile(req.file);
    const error = new Error(formatValidationErrors(errors));
    error.statusCode = 400;
    throw error;
  }

  const profileImageUrl = req.file ? buildImagePath(req.file.filename) : undefined;
  const employee = await Employee.create({
    ...req.body,
    profileImageUrl,
    createdBy: req.user._id,
  });

  res.status(201).json(employee);
});

exports.getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees);
});

exports.getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    removeUploadedTempFile(req.file);
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }
  res.json(employee);
});

exports.updateEmployee = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    removeUploadedTempFile(req.file);
    const error = new Error(formatValidationErrors(errors));
    error.statusCode = 400;
    throw error;
  }

  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    removeUploadedTempFile(req.file);
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  if (req.file) {
    if (employee.profileImageUrl) {
      removeFile(employee.profileImageUrl);
    }
    employee.profileImageUrl = buildImagePath(req.file.filename);
  }

  employee.firstName = req.body.firstName ?? employee.firstName;
  employee.lastName = req.body.lastName ?? employee.lastName;
  employee.email = req.body.email ?? employee.email;
  employee.phone = req.body.phone ?? employee.phone;
  employee.department = req.body.department ?? employee.department;
  employee.position = req.body.position ?? employee.position;
  employee.salary = req.body.salary ?? employee.salary;
  employee.status = req.body.status ?? employee.status;

  const updatedEmployee = await employee.save();
  res.json(updatedEmployee);
});

exports.deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    const error = new Error('Employee not found');
    error.statusCode = 404;
    throw error;
  }

  if (employee.profileImageUrl) {
    removeFile(employee.profileImageUrl);
  }

  await employee.deleteOne();
  res.json({ message: 'Employee removed' });
});

exports.searchEmployees = asyncHandler(async (req, res) => {
  const { department, position } = req.query;
  const query = {};

  if (department) {
    query.department = { $regex: department, $options: 'i' };
  }
  if (position) {
    query.position = { $regex: position, $options: 'i' };
  }

  const employees = await Employee.find(query).sort({ firstName: 1 });
  res.json({ count: employees.length, employees });
});
