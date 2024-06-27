import { body, param, query, validationResult, matchedData } from 'express-validator';

export async function checkPreorderData(req, res, next) {
    await body("userId")
    .trim()
    .escape()
    .exists().withMessage("UserID is required!")
    .notEmpty().withMessage("UserID can not be blank!")
    .run(req);

    await body("productId")
    .trim()
    .escape()
    .exists().withMessage("ProductID is required!")
    .notEmpty().withMessage("ProductID can not be blank!")
    .run(req);

    await body("quantity")
    .trim()
    .escape()
    .exists().withMessage("Quantity is required!")
    .notEmpty().withMessage("Quantity can not be blank!")
    .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("Quantity must be an integer and more than 0!")
    .run(req);

    await body("paymentMethod")
    .optional()
    .trim()
    .escape()
    .exists().withMessage("Payment is required!")
    .notEmpty().withMessage("Payment can not be blank!")
    .run(req);

    await body("phone")
    .optional()
    .trim()
    .escape()
    .exists().withMessage("Phone is required!")
    .notEmpty().withMessage("Phone can not be blank!")
    .isNumeric().withMessage("Phone number must contain only numbers!")
    .run(req);

    await body("address")
    .optional()
    .trim()
    .escape()
    .exists().withMessage("Address is required!")
    .notEmpty().withMessage("Address can not be blank!")
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.body, matchedData(req));
    next();
}