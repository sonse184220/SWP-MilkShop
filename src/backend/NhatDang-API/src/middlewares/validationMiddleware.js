const { body, validationResult, matchedData } = require('express-validator');

const checkRegister = [
    body('UserID')
        .trim()
        .exists().withMessage('UserID is required')
        .notEmpty().withMessage('UserID cannot be empty'),
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
    body('UserID')
        .trim()
        .exists().withMessage('UserID is required')
        .notEmpty().withMessage('UserID cannot be empty'),
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

module.exports = {
    checkRegister,
    checkLogin
};
