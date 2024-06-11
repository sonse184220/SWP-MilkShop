const { body, validationResult, matchedData } = require('express-validator');

const checkRegister = [
    body('Password')
        .trim()
        .exists().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('Name')
        .trim()
        .exists().withMessage('Name is required')
        .notEmpty().withMessage('Name cannot be empty'),
    body('Email')
        .trim()
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid'),
    body('Phone')
        .trim()
        .exists().withMessage('Phone is required')
        .notEmpty().withMessage('Phone cannot be empty'),
    body('Address')
        .trim()
        .exists().withMessage('Address is required')
        .notEmpty().withMessage('Address cannot be empty'),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }
        Object.assign(req.body, matchedData(req));
        next();
    }
];

const checkLogin = [
    body('identifier')
        .trim()
        .exists().withMessage('Identifier is required')
        .notEmpty().withMessage('Identifier cannot be empty'),
    body('Password')
        .trim()
        .exists().withMessage('Password is required')
        .notEmpty().withMessage('Password cannot be empty'),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }
        Object.assign(req.body, matchedData(req));
        next();
    }
];

const checkResetPasswordRequest = [
    body('email')
        .trim()
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid'),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }
        Object.assign(req.body, matchedData(req));
        next();
    }
];

const checkResetPassword = [
    body('token')
        .trim()
        .exists().withMessage('Token is required')
        .notEmpty().withMessage('Token cannot be empty'),
    body('newPassword')
        .trim()
        .exists().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }
        Object.assign(req.body, matchedData(req));
        next();
    }
];

module.exports = {
    checkRegister,
    checkLogin,
    checkResetPasswordRequest,
    checkResetPassword
};
