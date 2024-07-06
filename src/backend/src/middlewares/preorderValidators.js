import { body, param, query, validationResult, matchedData } from 'express-validator';

export async function checkPreorderId(req, res, next) {
    await param("preorderId")
        .trim()
        .escape()
        .exists().withMessage("PreorderID is required!")
        .notEmpty().withMessage("PreorderID can not be blank!")
        .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}

export async function checkPreorderInputStatus(req, res, next) {
    const statusList = ["Waiting", "Cancelled", "Shipping", "Done"];

    await body("status")
    .trim()
    .escape()
    .exists().withMessage("Status is required!")
    .notEmpty().withMessage("Status can not be blank!")
    .isIn(statusList).withMessage(`Invalid status input! status can only be: ${statusList.join(", ")}`)
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}
export async function checkPreorderInputEta(req, res, next) {
    await body("eta")
    .trim()
    .escape()
    .exists().withMessage("ETA is required!")
    .notEmpty().withMessage("ETA can not be blank!")
    .isISO8601().withMessage("ETA must be in ISO 8601 format (YYYY-MM-DD)!")
    .run(req);

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).send({ error: result.array() });
    }
    Object.assign(req.params, matchedData(req));
    next();
}

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
    .trim()
    .escape()
    .exists().withMessage("Payment is required!")
    .notEmpty().withMessage("Payment can not be blank!")
    .run(req);

    await body("name")
    .trim()
    .escape()
    .exists().withMessage("Name is required!")
    .notEmpty().withMessage("Name can not be blank!")
    .run(req);

    await body("email")
    .trim()
    .escape()
    .exists().withMessage("Email is required!")
    .notEmpty().withMessage("Email can not be blank!")
    .isEmail().withMessage("Invalid email!")
    .run(req);

    await body("phone")
    .trim()
    .escape()
    .exists().withMessage("Phone is required!")
    .notEmpty().withMessage("Phone can not be blank!")
    .isNumeric().withMessage("Phone number must contain only numbers!")
    .run(req);

    await body("address")
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