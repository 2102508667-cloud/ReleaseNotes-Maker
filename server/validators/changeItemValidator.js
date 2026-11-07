const { body, param, validationResult } = require('express-validator');

const VALID_TYPES = ['feature', 'bugfix', 'improvement', 'breaking', 'deprecation', 'security'];
const VALID_STATUSES = ['planned', 'in-progress', 'completed', 'released'];

// Helper: run validation rules and return errors if any
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

// Validation rules for creating a change item
const createChangeItemRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .isIn(VALID_TYPES)
    .withMessage(`Type must be one of: ${VALID_TYPES.join(', ')}`),

  body('version')
    .trim()
    .notEmpty()
    .withMessage('Version is required')
    .matches(/^\d+\.\d+\.\d+$/)
    .withMessage('Version must be a valid semver format (e.g. 1.0.0)'),

  body('status')
    .optional()
    .trim()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('author')
    .optional()
    .trim()
    .isString()
    .withMessage('Author must be a string'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string'),

  handleValidationErrors,
];

// Validation rules for updating a change item
const updateChangeItemRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid change item ID'),

  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('type')
    .optional()
    .trim()
    .isIn(VALID_TYPES)
    .withMessage(`Type must be one of: ${VALID_TYPES.join(', ')}`),

  body('version')
    .optional()
    .trim()
    .matches(/^\d+\.\d+\.\d+$/)
    .withMessage('Version must be a valid semver format (e.g. 1.0.0)'),

  body('status')
    .optional()
    .trim()
    .isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  body('author')
    .optional()
    .trim()
    .isString()
    .withMessage('Author must be a string'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string'),

  handleValidationErrors,
];

// Validation rules for generating release notes
const generateNotesRules = [
  body('version')
    .trim()
    .notEmpty()
    .withMessage('Version is required')
    .matches(/^\d+\.\d+\.\d+$/)
    .withMessage('Version must be a valid semver format (e.g. 1.0.0)'),

  body('ids')
    .isArray({ min: 1 })
    .withMessage('ids must be a non-empty array of change item IDs'),

  body('ids.*')
    .isMongoId()
    .withMessage('Each id must be a valid MongoDB ObjectId'),

  handleValidationErrors,
];

// Validation for :id param on GET/DELETE single item
const idParamRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid change item ID'),

  handleValidationErrors,
];

module.exports = {
  createChangeItemRules,
  updateChangeItemRules,
  generateNotesRules,
  idParamRules,
};
