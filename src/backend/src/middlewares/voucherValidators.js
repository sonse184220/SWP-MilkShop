import { validationResult, matchedData, param, body } from 'express-validator';

export async function checkVoucherId(req, res, next) {
    await param("voucherId")
        .trim()
        .escape()
        .exists().withMessage("VoucherId is required!")
        .notEmpty().withMessage("VoucherId can not be blank!")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}

export async function checkVoucherData(req, res, next) {
    await body("discount")
    .trim()
    .escape()
    .exists().withMessage("Discount is required!")
    .notEmpty().withMessage("Discount can not be blank!")
    .isInt({ min: 1, max: 20, allow_leading_zeroes: false }).withMessage("Discount must be an integer and no more than 20!")
    .run(req);

    await body("quantity")
    .trim()
    .escape()
    .exists().withMessage("Quantity is required!")
    .notEmpty().withMessage("Quantity can not be blank!")
    .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("Quantity must be an integer and larger than 1!")
    .run(req);

    await body("expiration")
    .trim()
    .escape()
    .exists().withMessage("Expiration is required!")
    .notEmpty().withMessage("Expiration can not be blank!")
    .isISO8601().withMessage("Expiration must be in ISO 8601 format (YYYY-MM-DD)!")
    .run(req);

    await body("content")
    .trim()
    .exists().withMessage("Content is required!")
    .notEmpty().withMessage("Content can not be blank!")
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.body, matchedData(req));
    next();
}

export async function checkVoucherUpdateData(req, res, next) {
    await body("quantity")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isInt({ min: 1, allow_leading_zeroes: false }).withMessage("Quantity must be an integer and larger than 1!")
    .run(req);

    await body("expiration")
    .optional({ values: "falsy" })
    .trim()
    .escape()
    .isISO8601().withMessage("Expiration must be in ISO 8601 format (YYYY-MM-DD)!")
    .run(req);

    await body("content")
    .optional({ values: "falsy" })
    .trim()
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.body, matchedData(req));
    next();
}