const express = require('express');
const { body } = require('express-validator');
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const createValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('position').notEmpty().withMessage('Position is required'),
  body('salary').isNumeric().withMessage('Salary must be numeric'),
];

const updateValidation = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('salary').optional().isNumeric().withMessage('Salary must be numeric'),
];

router.get('/search', protect, searchEmployees);
router
  .route('/')
  .get(protect, getEmployees)
  .post(protect, upload.single('profileImage'), createValidation, createEmployee);

router
  .route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, upload.single('profileImage'), updateValidation, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
