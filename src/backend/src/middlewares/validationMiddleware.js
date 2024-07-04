import { body, validationResult, matchedData } from 'express-validator';

export const checkRegister = [
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

export const checkLogin = [
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

export const checkResetPasswordRequest = [
    body('email')
        .trim()
        .exists().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid'),
    body('newPassword')
        .trim()
        .exists().withMessage('New password is required')
        .notEmpty().withMessage('New password cannot be empty')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    body('confirmPassword')
        .trim()
        .exists().withMessage('Confirm password is required')
        .notEmpty().withMessage('Confirm password cannot be empty')
        .isLength({ min: 6 }).withMessage('Confirm password must be at least 6 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }
        Object.assign(req.body, matchedData(req));
        next();
    }
];

export const checkResetPassword = [
    body('token')
        .trim()
        .exists().withMessage('Token is required')
        .notEmpty().withMessage('Token cannot be empty'),
    body('newPassword')
        .trim()
        .exists().withMessage('New password is required')
        .notEmpty().withMessage('New password cannot be empty')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    body('confirmPassword')
        .trim()
        .exists().withMessage('Confirm password is required')
        .notEmpty().withMessage('Confirm password cannot be empty')
        .isLength({ min: 6 }).withMessage('Confirm password must be at least 6 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }
        Object.assign(req.body, matchedData(req));
        next();
    }
];

export const checkChangePassword = [
    body('oldPassword')
        .trim()
        .exists().withMessage('Old password is required')
        .notEmpty().withMessage('Old password cannot be empty'),
    body('newPassword')
        .trim()
        .exists().withMessage('New password is required')
        .notEmpty().withMessage('New password cannot be empty')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
    body('confirmPassword')
        .trim()
        .exists().withMessage('Confirm password is required')
        .notEmpty().withMessage('Confirm password cannot be empty')
        .isLength({ min: 6 }).withMessage('Confirm password must be at least 6 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
    (req, res, next) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send({ error: result.array() });
        }
        Object.assign(req.body, matchedData(req));
        next();
    }
];

export const checkImageUpload = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).send({ error: 'Invalid file type. Only image files are allowed.' });
    }

    next();
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    res.status(403).json({ message: 'Only Admin can do this.' });
};
export const isStaff = (req, res, next) => {
    if (req.user && req.user.isStaff) {
        return next();
    }
    res.status(403).json({ message: "Only Staff can do this." });
};
export const isStaffOrAdmin = (req, res, next) => {
    if (req.user && req.user.isStaff || req.user && req.user.isAdmin) {
        return next();
    }
    res.status(403).json({ message: 'Only Staff or Admin can do this.' });
};