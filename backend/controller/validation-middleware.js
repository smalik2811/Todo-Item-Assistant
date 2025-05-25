const { body, param, validationResult } = require('express-validator');
const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Validation middleware
const validateRequest = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation error', { 
                errors: errors.array(), 
                path: req.path, 
                body: req.body,
                user_id: req.user.id
            });
            return res.status(400).json({ 
                message: "Validation error", 
                errors: errors.array() 
            });
        }

        // Sanitize inputs
        if (req.body && req.body.title) {
            req.body.title = req.body.title.trim();
        }
        if (req.body && req.body.description) {
            req.body.description = req.body.description.trim();
        }

        next();
    };
};

// Validation rules for adding a todoItem
const addTodoValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 50 }).withMessage('Title must be at most 50 characters'),
    body('description')
        .optional()
        .isLength({ max: 200 }).withMessage('Description must be at most 200 characters')
];

// Validation rules for editing a todoItem
const editTodoValidation = [
    body('id')
        .notEmpty().withMessage('ID is required'),
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 50 }).withMessage('Title must be at most 50 characters'),
    body('description')
        .optional()
        .isLength({ max: 200 }).withMessage('Description must be at most 200 characters'),
    body('is_finished')
        .optional()
        .customSanitizer(value => value === "true" || value === true)
];

// Validation rules for deleting a todoItem
const deleteTodoValidation = [
    param('id')
        .notEmpty().withMessage('ID is required')
];

module.exports = {
    validateRequest,
    addTodoValidation,
    editTodoValidation,
    deleteTodoValidation
};
